"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/", "Start"],
  ["/leistungen", "Leistungen"],
  ["/loesungen", "Lösungen"],
  ["/beispiele", "Beispiele"],
  ["/vorgehensweise", "Vorgehen"],
  ["/ueber-uns", "Über uns"],
  ["/wissen", "Wissen"],
  ["/kontakt", "Kontakt"],
];

export function SiteNavigation({ name }: { name: string }) {
  return <NavigationForPage key={usePathname()} name={name} />;
}
function NavigationForPage({ name }: { name: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const opener = trigger.current;
    const previous = document.body.style.overflow;
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        "body > header, body > main, body > footer, body > .preview-notice, body > .skip-link",
      ),
    );
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = panel.current?.querySelectorAll<HTMLElement>("a, button");
      if (!items?.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keys);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      if (opener && document.contains(opener)) opener.focus();
      document.removeEventListener("keydown", keys);
    };
  }, [open]);
  return (
    <>
      <noscript>
        <nav className="no-script-nav" aria-label="Navigation ohne JavaScript">
          <Link href="/leistungen">Leistungen</Link>
          <Link href="/beispiele">Beispiele</Link>
          <Link href="/kontakt">Projekt anfragen</Link>
        </nav>
      </noscript>
      <header className="site-header studio-header">
        <Link href="/" className="brand" title="Startseite">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            {name}
            <small>PROZESSE. VERBUNDEN.</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          {[
            ["/leistungen", "Leistungen"],
            ["/beispiele", "Beispiele"],
            ["/vorgehensweise", "Vorgehen"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path.startsWith(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="button header-cta" href="/kontakt">
            Projekt anfragen <span aria-hidden="true">↗</span>
          </Link>
          <button
            ref={trigger}
            className="menu-trigger"
            aria-expanded={open}
            aria-controls="studio-menu"
            onClick={() => setOpen(true)}
          >
            Menü{" "}
            <span className="menu-lines" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>
      {open && (
        <div
          ref={panel}
          id="studio-menu"
          className="studio-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Seitenmenü"
        >
          <div className="menu-top">
            <span>{name}</span>
            <button
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              Schließen <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav aria-label="Alle Seiten">
            {links.map(([href, label], i) => (
              <Link
                href={href}
                key={href}
                aria-current={path === href ? "page" : undefined}
                onClick={() => {
                  setOpen(false);
                  trigger.current?.focus();
                }}
              >
                <small>0{i + 1}</small>
                <span>{label}</span>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </nav>
          <div className="menu-bottom">
            <span>WENIGER ROUTINE. MEHR FREIRAUM.</span>
            <Link href="/kontakt">Ihr nächster Schritt beginnt hier ↗</Link>
          </div>
        </div>
      )}
    </>
  );
}

export function PageTransitions() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      document.getElementById("inhalt")?.focus({ preventScroll: true });
      lastPath.current = pathname;
    }
  }, [pathname]);
  return null;
}
