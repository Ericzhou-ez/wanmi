"use client";

import { useEffect } from "react";

/** Publishes `--site-navbar-height` on `<html>` for overlays (e.g. mega-menu scrim). */
export function NavbarMetrics() {
  useEffect(() => {
    const root = document.documentElement;
    const nav = document.querySelector("[data-site-navbar]");
    if (!nav || !(nav instanceof HTMLElement)) {
      return;
    }

    const publish = () => {
      root.style.setProperty(
        "--site-navbar-height",
        `${Math.round(nav.getBoundingClientRect().height)}px`,
      );
    };

    let thresholdPx = Math.round(window.innerHeight * 0.25);
    let rafId = 0;
    let hidden = false;
    let lastY = window.scrollY;
    let downDistance = 0;
    let upDistance = 0;

    const setHidden = (nextHidden: boolean) => {
      if (hidden === nextHidden) {
        return;
      }
      hidden = nextHidden;
      nav.dataset.navHidden = nextHidden ? "true" : "false";
    };

    const syncThreshold = () => {
      thresholdPx = Math.round(window.innerHeight * 0.25);
    };

    const updateScrollState = () => {
      rafId = 0;
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (currentY <= thresholdPx) {
        downDistance = 0;
        upDistance = 0;
        setHidden(false);
        lastY = currentY;
        return;
      }

      if (Math.abs(delta) < 2) {
        lastY = currentY;
        return;
      }

      if (delta > 0) {
        downDistance += delta;
        upDistance = 0;
        if (downDistance >= 8) {
          setHidden(true);
        }
      } else {
        upDistance += Math.abs(delta);
        downDistance = 0;
        if (upDistance >= 8) {
          setHidden(false);
        }
      }

      lastY = currentY;
    };

    const onScroll = () => {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(updateScrollState);
    };

    nav.dataset.navHidden = "false";
    publish();
    syncThreshold();
    const ro = new ResizeObserver(publish);
    ro.observe(nav);
    window.addEventListener("resize", publish);
    window.addEventListener("resize", syncThreshold);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      ro.disconnect();
      window.removeEventListener("resize", publish);
      window.removeEventListener("resize", syncThreshold);
      window.removeEventListener("scroll", onScroll);
      delete nav.dataset.navHidden;
    };
  }, []);

  return null;
}
