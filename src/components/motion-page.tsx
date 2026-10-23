"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Content is visible by default; motion is an optional enhancement. */
export function MotionPage({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const root = scope.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".section-heading, .studio-intro > div, .offering-group, .service-detail-grid > section, .process-service-intro, .process-usecase, .process-method li, .process-service-end, .studio-story-image, .studio-story-copy, .process-steps li, .industry-grid > section, .case-card, .article-body > section",
      ),
    );
    const clear = () => {
      observer?.disconnect();
      for (const target of targets) {
        target.removeAttribute("data-reveal");
        target.removeAttribute("data-revealed");
        target.style.removeProperty("--reveal-delay");
      }
    };
    const reveal = (target: HTMLElement) => {
      target.setAttribute("data-revealed", "true");
      observer?.unobserve(target);
    };
    const setup = () => {
      clear();
      if (preference.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        },
        { rootMargin: "0px 0px -35px 0px", threshold: 0.04 },
      );
      let order = 0;
      for (const target of targets) {
        // Never nest transforms or hide content already in view (including deep links).
        if (target.parentElement?.closest("[data-reveal]")) continue;
        const bounds = target.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) continue;
        target.setAttribute("data-reveal", "");
        target.style.setProperty("--reveal-delay", `${(order++ % 2) * 65}ms`);
        observer.observe(target);
      }
    };
    const focus = (event: FocusEvent) => {
      const target = (event.target as HTMLElement)?.closest<HTMLElement>(
        "[data-reveal]",
      );
      if (target) reveal(target);
    };
    setup();
    preference.addEventListener("change", setup);
    root.addEventListener("focusin", focus);
    return () => {
      clear();
      preference.removeEventListener("change", setup);
      root.removeEventListener("focusin", focus);
    };
  }, [pathname]);
  return (
    <div ref={scope} className="page-enter">
      {children}
    </div>
  );
}

export function MotionMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="studio-marquee" data-paused={paused}>
      <span className="motion-text">
        Prozesse verbinden. Freiraum schaffen.
      </span>
      <div aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i}>
            PROZESSE VERBINDEN <b>↗</b> FREIRAUM SCHAFFEN <b>✳</b>{" "}
          </span>
        ))}
      </div>
      <button
        className="marquee-control"
        aria-label={paused ? "Lauftext fortsetzen" : "Lauftext pausieren"}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? "Weiter ▷" : "Pause Ⅱ"}
      </button>
    </div>
  );
}
