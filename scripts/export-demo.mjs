/* global document, location */
import { URL } from "node:url";
import { Buffer } from "node:buffer";
const client =
  'const trigger=document.querySelector(".menu-trigger"), panel=document.querySelector("#studio-menu");\nlet saved=[];\nfunction closeMenu(){panel.hidden=true;trigger.setAttribute("aria-expanded","false");document.body.style.overflow="";for(const [e,v] of saved)e.inert=v;saved=[];trigger.focus();}\ntrigger?.addEventListener("click",()=>{panel.hidden=false;trigger.setAttribute("aria-expanded","true");saved=Array.from(document.body.children).filter(e=>e!==panel&&e.tagName!=="SCRIPT").map(e=>[e,e.inert]);for(const [e] of saved)e.inert=true;document.body.style.overflow="hidden";panel.querySelector("button").focus();});\npanel?.querySelector("button")?.addEventListener("click",closeMenu);\ndocument.addEventListener("keydown",e=>{if(!panel||panel.hidden)return;if(e.key==="Escape"){e.preventDefault();closeMenu();}if(e.key==="Tab"){const all=panel.querySelectorAll("a,button");const first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});\nconst buttons=[...document.querySelectorAll(".explorer-switches button")];\nif(buttons.length)fetch("/explorer.json").then(r=>r.json()).then(panels=>buttons.forEach((button,i)=>button.addEventListener("click",()=>{buttons.forEach((b,j)=>b.setAttribute("aria-pressed",String(i===j)));document.querySelector(".explorer-content").innerHTML=panels[i];})));\ndocument.querySelectorAll(".marquee-control").forEach(b=>b.addEventListener("click",()=>{const paused=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(paused));b.setAttribute("aria-label",paused?"Lauftext fortsetzen":"Lauftext pausieren");b.textContent=paused?"Weiter ▷":"Pause Ⅱ";b.closest(".studio-marquee").dataset.paused=String(paused);}));\ndocument.querySelectorAll("form").forEach(f=>f.addEventListener("submit",e=>e.preventDefault()));\n';
import { chromium } from "@playwright/test";
import { mkdir, writeFile, readdir, copyFile } from "node:fs/promises";
import path from "node:path";

const origin = process.env.TEST_BASE_URL || "http://127.0.0.1:3110";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin))
  throw new Error("Use a local preview origin.");
const output = path.resolve(process.env.DEMO_OUTPUT || "demo-export");
const browser = await chromium.launch({
  channel: process.env.TEST_BROWSER_CHANNEL || "chrome",
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const queue = ["/"];
const visited = new Set();
const css = new Set();
const explorer = [];
const skip = (p) =>
  /^(\/admin|\/api|\/einwilligung|\/einstellungen|\/danke|\/_next)/.test(p);
await mkdir(output, { recursive: true });
try {
  while (queue.length) {
    const route = queue.shift();
    if (visited.has(route) || skip(route)) continue;
    const response = await page.goto(origin + route, {
      waitUntil: "networkidle",
    });
    if (response.status() !== 200)
      throw new Error("Unexpected route status: " + route);
    visited.add(route);
    await page.locator(".menu-trigger").click();
    const menu = await page
      .locator("#studio-menu")
      .evaluate((e) => e.outerHTML);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((es) => es.map((e) => e.getAttribute("href")))) {
      const pathname = new URL(href, locationSafeOrigin()).pathname;
      if (!visited.has(pathname) && !skip(pathname)) queue.push(pathname);
    }
    await page.getByRole("button", { name: "Schließen" }).click();
    if (route === "/") {
      const buttons = page.locator(".explorer-switches button");
      for (let i = 0; i < (await buttons.count()); i++) {
        await buttons.nth(i).click();
        explorer.push(await page.locator(".explorer-content").innerHTML());
      }
      await buttons.first().click();
    }
    for (const href of await page
      .locator('link[rel="stylesheet"]')
      .evaluateAll((es) => es.map((e) => e.getAttribute("href"))))
      css.add(href);
    await page.evaluate(
      ({ menu }) => {
        document
          .querySelectorAll(
            "script,link[rel=preload],link[rel=modulepreload],link[rel=canonical],meta[property='og:url']",
          )
          .forEach((e) => e.remove());
        document
          .querySelectorAll("[inert]")
          .forEach((e) => e.removeAttribute("inert"));
        document.querySelectorAll("[data-reveal]").forEach((e) => {
          e.removeAttribute("data-reveal");
          e.removeAttribute("data-revealed");
        });
        for (const img of document.querySelectorAll("img")) {
          const u = new URL(img.src, location.origin);
          if (u.pathname === "/_next/image") {
            img.src = u.searchParams.get("url");
            img.removeAttribute("srcset");
          }
        }
        for (const form of document.querySelectorAll("form")) {
          form.removeAttribute("action");
          form.removeAttribute("method");
          form.querySelectorAll("input,textarea,select,button").forEach((e) => {
            e.disabled = true;
          });
          form
            .querySelectorAll('input[type="hidden"]')
            .forEach((e) => e.remove());
          const notice = form.querySelector(".notice");
          if (notice)
            notice.textContent =
              "Portfolio-Demo: Das Formular ist deaktiviert. Es werden keine Anfragen gespeichert oder versendet.";
        }
        const notice = document.querySelector(".preview-notice");
        if (notice) {
          notice.textContent =
            "PORTFOLIO-DEMO · Konzeptionelles Projekt · Kein Anfrageversand · ";
          const a = document.createElement("a");
          a.href = "https://github.com/mekanxy-art/prozesswerk";
          a.textContent = "Quellcode auf GitHub";
          a.style.textDecoration = "underline";
          notice.append(a);
        }
        document.body.insertAdjacentHTML("beforeend", menu);
        document.querySelector("#studio-menu").hidden = true;
        document
          .querySelectorAll(
            'meta[property="og:image"],meta[name="twitter:image"]',
          )
          .forEach((e) => e.remove());
        const style = document.createElement("style");
        style.textContent =
          "[hidden]{display:none!important}.studio-menu[hidden]{display:none!important}";
        document.head.append(style);
        const script = document.createElement("script");
        script.src = "/demo.js";
        script.defer = true;
        document.body.append(script);
      },
      { menu },
    );
    const dest = path.join(output, route, "index.html");
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, await page.content());
  }
  for (const href of css) {
    const url = new URL(href, origin);
    const file = path.join(output, url.pathname);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
  }
  async function copyPublic(dir, rel = "") {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const r = path.join(rel, e.name);
      if (e.isDirectory()) await copyPublic(path.join(dir, e.name), r);
      else if (!r.endsWith(".png")) {
        const dest = path.join(output, r);
        await mkdir(path.dirname(dest), { recursive: true });
        await copyFile(path.join(dir, e.name), dest);
      }
    }
  }
  await copyPublic(path.resolve("public"));
  await writeFile(path.join(output, "explorer.json"), JSON.stringify(explorer));
  await writeFile(
    path.join(output, "robots.txt"),
    "User-agent: *\nDisallow: /\n",
  );
  await writeFile(path.join(output, "demo.js"), client);
  await writeFile(
    path.join(output, "demo-manifest.json"),
    JSON.stringify(
      {
        kind: "static portfolio demonstration",
        routes: [...visited],
        backend: false,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({ output, routes: visited.size, stylesheets: css.size }),
  );
} finally {
  await browser.close();
}
function locationSafeOrigin() {
  return origin;
}
