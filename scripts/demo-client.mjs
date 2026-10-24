/* global document */
// Runs only in an exported public demo, never in the Next.js backend.
const trigger = document.querySelector(".menu-trigger");
const panel = document.querySelector("#studio-menu");
let saved = [];
function closeMenu() {
  if (!panel) return;
  panel.hidden = true;
  trigger?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  for (const [element, inert] of saved) element.inert = inert;
  saved = [];
  trigger?.focus();
}
trigger?.addEventListener("click", () => {
  if (!panel) return;
  panel.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  saved = Array.from(document.body.children)
    .filter((e) => e !== panel && e.tagName !== "SCRIPT")
    .map((e) => [e, e.inert]);
  for (const [element] of saved) element.inert = true;
  document.body.style.overflow = "hidden";
  panel.querySelector("button")?.focus();
});
panel?.querySelector("button")?.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) => {
  if (!panel || panel.hidden) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
  }
  if (event.key !== "Tab") return;
  const items = panel.querySelectorAll("a,button");
  const first = items[0],
    last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
const switches = [...document.querySelectorAll(".explorer-switches button")];
if (switches.length) {
  fetch("/explorer.json")
    .then((r) => {
      if (!r.ok) throw new Error("Demo data unavailable");
      return r.json();
    })
    .then((panels) => {
      let active = 0,
        manual = false;
      const render = () => {
        switches.forEach((button, i) =>
          button.setAttribute("aria-pressed", String(i === active)),
        );
        // Only markup captured from this project's own public examples is loaded.
        document.querySelector(".explorer-content").innerHTML =
          panels[active][manual ? 1 : 0];
      };
      switches.forEach((button, i) =>
        button.addEventListener("click", () => {
          active = i;
          render();
        }),
      );
      document
        .querySelector(".explorer-content")
        .addEventListener("click", (event) => {
          const button = event.target.closest(".workflow-comparison button");
          if (!button) return;
          manual = [...button.parentElement.children].indexOf(button) === 0;
          render();
        });
    })
    .catch(() => {
      /* Initial example stays visible if demo data cannot be loaded. */
    });
}
document.querySelectorAll(".marquee-control").forEach((button) =>
  button.addEventListener("click", () => {
    const paused = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(paused));
    button.setAttribute(
      "aria-label",
      paused ? "Lauftext fortsetzen" : "Lauftext pausieren",
    );
    button.textContent = paused ? "Weiter ▷" : "Pause Ⅱ";
    button.closest(".studio-marquee").dataset.paused = String(paused);
  }),
);
document
  .querySelectorAll("form")
  .forEach((form) =>
    form.addEventListener("submit", (event) => event.preventDefault()),
  );
