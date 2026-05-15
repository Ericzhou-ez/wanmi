"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  getHotspotPercentForViewport,
  HOME_HERO_LG_MIN_PX,
  homeHero,
  isHomeHeroHotspotVisible,
} from "lib/home-hero";
import { formatPrice } from "lib/format-price";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { HomeHeroProduct } from "types/home-hero";

export function HomeHero({
  productsByHandle,
}: {
  productsByHandle: Record<string, HomeHeroProduct | undefined>;
}) {
  const { slides, styles, imageSizes } = homeHero;
  if (slides.length === 0) return null;
  const [activeIndex, setActiveIndex] = useState(0);
  const [openHandle, setOpenHandle] = useState<string | null>(null);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const goTo = (next: number) => {
    setOpenHandle(null);
    setActiveIndex((current) => {
      const n = typeof next === "number" ? next : current;
      return ((n % slides.length) + slides.length) % slides.length;
    });
  };

  const goPrev = () => goTo(activeIndexRef.current - 1);
  const goNext = () => goTo(activeIndexRef.current + 1);

  const safeIndex =
    ((activeIndex % slides.length) + slides.length) % slides.length;
  const active = slides[safeIndex]!;
  const activeHotspots = useMemo(() => active.hotspots, [active.hotspots]);
  const dotRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const [canHover, setCanHover] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const [cardPos, setCardPos] = useState<{ left: number; top: number } | null>(
    null,
  );

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelScheduledClose();
    // Small delay prevents flicker when moving dot → card.
    closeTimerRef.current = window.setTimeout(() => {
      setOpenHandle(null);
    }, 120);
  }, [cancelScheduledClose]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${HOME_HERO_LG_MIN_PX}px)`);
    const sync = () => setIsLaptop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const visibleHotspots = useMemo(
    () => activeHotspots.filter((h) => isHomeHeroHotspotVisible(h, isLaptop)),
    [activeHotspots, isLaptop],
  );

  useEffect(() => {
    if (!openHandle) return;
    const hotspot = activeHotspots.find((h) => h.handle === openHandle);
    if (!hotspot || !isHomeHeroHotspotVisible(hotspot, isLaptop)) {
      cancelScheduledClose();
      setOpenHandle(null);
    }
  }, [openHandle, activeHotspots, isLaptop, cancelScheduledClose]);
  useEffect(() => {
    if (!openHandle) {
      setCardPos(null);
      return;
    }

    const place = () => {
      const dot = dotRefs.current.get(openHandle);
      if (!dot) return;

      const r = dot.getBoundingClientRect();
      // Don't render visibly until positioned (prevents "flash").
      setCardPos(null);

      // After the hidden card renders, measure & place.
      requestAnimationFrame(() => {
        const el = cardRef.current;
        if (!el) return;
        const cr = el.getBoundingClientRect();
        const pad = 10;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const margin = 0;
        let left = r.right + margin;
        let top = r.top + r.height / 2 - cr.height / 2;

        // If it overflows right, flip to left side of dot.
        if (left + cr.width + pad > vw) {
          left = r.left - margin - cr.width;
        }
        // Clamp within viewport.
        left = Math.max(pad, Math.min(vw - cr.width - pad, left));
        top = Math.max(pad, Math.min(vh - cr.height - pad, top));

        setCardPos({ left, top });
      });
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [openHandle]);

  // Tap/click outside closes on touch devices.
  useEffect(() => {
    if (!openHandle) return;
    if (canHover) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const cardEl = cardRef.current;
      const dotEl = dotRefs.current.get(openHandle) ?? null;
      if (cardEl && cardEl.contains(target)) return;
      if (dotEl && dotEl.contains(target)) return;
      setOpenHandle(null);
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [openHandle, canHover]);

  return (
    <section className={styles.section} aria-label="Carrousel de sélection">
      <div className={styles.shell}>
        <div className={styles.frame}>
          <Image
            src={active.imageSrc}
            alt={active.imageAlt}
            fill
            priority
            sizes={imageSizes}
            className={styles.image}
          />
          <div className={styles.gradient} aria-hidden />

          <div className={styles.content}>
            <div className={styles.contentInner}>
              {active.copy.eyebrow ? (
                <p className={styles.eyebrow}>{active.copy.eyebrow}</p>
              ) : null}
              <h1 className={styles.title}>{active.copy.title}</h1>
              {active.cta ? (
                <div className={styles.ctaRow}>
                  <Link className={styles.cta} href={active.cta.href}>
                    <span>{active.cta.label}</span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 lg:left-6"
            onClick={goPrev}
            aria-label="Précédent"
          >
            <span className={styles.navButton} aria-hidden>
              ‹
            </span>
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:right-6"
            onClick={goNext}
            aria-label="Suivant"
          >
            <span className={styles.navButton} aria-hidden>
              ›
            </span>
          </button>

          {visibleHotspots.map((hotspot) => {
            const product = productsByHandle[hotspot.handle];
            const href = `/product/${hotspot.handle}`;
            const price = product?.priceAmount
              ? formatPrice(product.priceAmount, product.priceCurrency)
              : null;
            const { x: pctX, y: pctY } = getHotspotPercentForViewport(
              hotspot,
              isLaptop,
            );

            return (
              <div
                key={hotspot.handle}
                className="absolute z-20"
                style={{
                  left: `${pctX}%`,
                  top: `${pctY}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={
                  canHover
                    ? () => {
                        cancelScheduledClose();
                        setOpenHandle(hotspot.handle);
                      }
                    : undefined
                }
                onMouseLeave={canHover ? () => scheduleClose() : undefined}
                onFocusCapture={() => setOpenHandle(hotspot.handle)}
                onBlurCapture={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (!next || !e.currentTarget.contains(next)) {
                    setOpenHandle((prev) =>
                      prev === hotspot.handle ? null : prev,
                    );
                  }
                }}
              >
                <button
                  type="button"
                  className={styles.hotspotDot}
                  aria-label={product?.title ?? "Voir le produit"}
                  ref={(el) => {
                    if (el) dotRefs.current.set(hotspot.handle, el);
                    else dotRefs.current.delete(hotspot.handle);
                  }}
                  onClick={() =>
                    setOpenHandle((prev) =>
                      prev === hotspot.handle ? null : hotspot.handle,
                    )
                  }
                />
              </div>
            );
          })}

          {openHandle
            ? (() => {
                const product = productsByHandle[openHandle];
                const href = `/product/${openHandle}`;
                const price = product?.priceAmount
                  ? formatPrice(product.priceAmount, product.priceCurrency)
                  : null;

                return (
                  <div
                    className="fixed"
                    style={
                      cardPos
                        ? { left: cardPos.left, top: cardPos.top }
                        : {
                            left: -10_000,
                            top: -10_000,
                            visibility: "hidden",
                            pointerEvents: "none",
                          }
                    }
                    onMouseEnter={
                      canHover
                        ? () => {
                            cancelScheduledClose();
                            setOpenHandle(openHandle);
                          }
                        : undefined
                    }
                    onMouseLeave={canHover ? () => scheduleClose() : undefined}
                  >
                    <Link
                      href={href}
                      className={styles.card}
                      ref={cardRef}
                      onClick={() => setOpenHandle(null)}
                      tabIndex={cardPos ? 0 : -1}
                      aria-hidden={!cardPos}
                    >
                      <div className="flex items-stretch">
                        <div
                          className={`${styles.cardBody} min-w-0 flex-1 pr-2`}
                        >
                          <p className={styles.cardTitle}>
                            {product?.title ?? openHandle}
                          </p>
                          {price ? (
                            <p className={styles.cardPrice}>{price}</p>
                          ) : null}
                        </div>

                        <div className="shrink-0 flex items-center justify-center px-4 py-3 bg-white">
                          <ChevronRightIcon
                            height={16}
                            width={16}
                            color="black"
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })()
            : null}
        </div>
      </div>
    </section>
  );
}
