import { useEffect } from "react";
import useMediaQuery from "./useMediaQuery.js";
import { motionConfig } from "../lib/motion-config.js";

export default function useHomeMotion(rootRef) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return undefined;

    let disposed = false;
    let observer;
    const scopes = [];

    import("animejs").then(({ animate, createScope }) => {
      if (disposed || !root.isConnected) return;

      const reveal = (section, hero = false) => {
        if (disposed) return;
        const targets = hero
          ? Array.from(section.querySelectorAll("[data-hero-reveal]"))
          : Array.from(section.querySelectorAll("h2, ol > li, a[href]"));
        if (!targets.length) return;

        // Never animate a link containing current keyboard focus.
        const safeTargets = targets.filter((target) => !target.contains(document.activeElement));
        if (!safeTargets.length) return;

        const scope = createScope({ root: section });
        scopes.push(scope);
        try {
          scope.add(() => {
            animate(safeTargets, {
              opacity: [hero ? 0.65 : 0, 1],
              translateY: [hero ? 14 : motionConfig.revealDistance, 0],
              duration: hero ? motionConfig.heroDuration : motionConfig.revealDuration,
              delay: (_, index) => Math.min(index * motionConfig.staggerDelay, motionConfig.maxStaggerDelay),
              ease: "out(3)",
            });
          });
        } catch (error) {
          scope.revert();
          console.warn("Motion enhancement skipped; content remains available.", error);
        }
      };

      const sections = Array.from(root.querySelectorAll("section"));
      const hero = sections.shift();
      if (hero && document.visibilityState === "visible") reveal(hero, true);
      if (!("IntersectionObserver" in window)) return;

      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (document.visibilityState === "visible") reveal(entry.target);
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
      sections.forEach((section) => observer.observe(section));
    }).catch((error) => {
      if (!disposed) console.warn("Motion module unavailable; using static content.", error);
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      scopes.forEach((scope) => scope.revert());
    };
  }, [rootRef, reducedMotion]);
}
