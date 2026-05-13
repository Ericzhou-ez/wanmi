/**
 * Home page hero carousel.
 *
 * Edit slides, copy, hotspots, and layout here.
 * Tailwind classes must stay as complete literal strings so the compiler can see them.
 */

export const HOME_HERO_LG_MIN_PX = 1150;

export type HomeHeroHotspotCoords = {
   /** 0–100 from left of hero frame */
   x: number;
   /** 0–100 from top of hero frame */
   y: number;
};

export type HomeHeroHotspot = {
   /** Shopify product handle. */
   handle: string;
   /** Laptop / desktop (viewport ≥ `HOME_HERO_LG_MIN_PX`). */
   lg: HomeHeroHotspotCoords;
   /** Mobile (viewport below `HOME_HERO_LG_MIN_PX`). Omit to reuse `lg` on mobile. */
   sm?: HomeHeroHotspotCoords;
   /** When true, this hotspot is not shown below `HOME_HERO_LG_MIN_PX`. */
   hideHotspotsOnMobile?: boolean;
};

/** Resolved hotspot placement (% within frame) for the current viewport. */
export function getHotspotPercentForViewport(
   hotspot: HomeHeroHotspot,
   isLaptopOrWider: boolean,
): HomeHeroHotspotCoords {
   if (isLaptopOrWider) return hotspot.lg;
   return hotspot.sm ?? hotspot.lg;
}

/** Whether this hotspot should render at the current breakpoint. */
export function isHomeHeroHotspotVisible(
   hotspot: HomeHeroHotspot,
   isLaptopOrWider: boolean,
): boolean {
   if (isLaptopOrWider) return true;
   return hotspot.hideHotspotsOnMobile !== true;
}

export type HomeHeroSlide = {
   id: string;
   imageSrc: string;
   imageAlt: string;
   copy: {
      eyebrow?: string;
      title: string;
      subtitle?: string;
   };
   cta?: {
      href: string;
      label: string;
   };
   hotspots: HomeHeroHotspot[];
};

export const homeHero = {
   imageSizes: "(min-width: 1280px) 1200px, 100vw",
   styles: {
      section: "mx-auto",
      /** Mobile height uses `h-[…vh]`; `lg:h-auto` restores laptop/desktop sizing. */
      shell: "relative h-[80vh] overflow-hidden rounded-none bg-neutral-950 lg:h-auto lg:min-h-[50vh]",
      frame: "relative h-full w-full lg:mx-auto lg:h-auto lg:max-w-(--breakpoint-2xl) lg:aspect-[16/7]",
      image: "object-cover",
      gradient:
         "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10",
      content:
         "pointer-events-none absolute inset-0 flex items-end justify-center px-6 pb-10 text-center text-white sm:px-10 sm:pb-14 lg:items-center lg:pb-0",
      contentInner: "mx-auto w-full max-w-2xl",
      eyebrow: "text-xs uppercase tracking-[0.32em] text-white/85",
      title: "mt-3 font-(family-name:--font-playfair) text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl",
      subtitle: "mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base",
      ctaRow: "pointer-events-auto mt-10 flex items-center justify-center gap-3",
      cta: "inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm text-neutral-900 transition hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
      navButton:
         "pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-10 sm:w-10 lg:h-11 lg:w-11",
      hotspotDot:
         "pointer-events-auto relative h-4 w-4 rounded-full bg-white/90 backdrop-blur-[12px] shadow-[0_0_0_6px_rgba(255,255,255,0.16)] transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
      card: "pointer-events-auto block w-[300px] overflow-hidden rounded-lg bg-white/90 backdrop-blur-[20px] text-left text-neutral-950 shadow-[0_20px_60px_rgba(0,0,0,0.22)]",
      cardBody: "space-y-0.5 px-4 py-3",
      cardTitle: "truncate text-lg font-medium leading-snug",
      cardPrice: "text-sm font-medium text-red-500",
   },
   slides: [
      {
         id: "outdoor",
         imageSrc: "/assets/outdoor_hero.png",
         imageAlt: "Ambiance extérieure avec mobilier et textiles.",
         copy: {
            eyebrow: "Extérieur",
            title: "Se détendre. Dîner. Décompresser.",
         },
         cta: { href: "/collections/exterieur", label: "Explorer l’outdoor" },
         hotspots: [
            {
               handle: "canape-de-jardin-moderne-cove-102-75",
               lg: { x: 16, y: 40 },
            },
            {
               handle: "table-de-jardin-moderne-cove-34-25",
               lg: { x: 38, y: 66 },
               sm: { x: 35, y: 63 },
            },
            {
               handle: "tapis-interieur-exterieur-9x12-motif-pied-de-poule",
               lg: { x: 16, y: 70 },
               sm: { x: 12, y: 85 },
            },
            {
               handle: "table-d-appoint-exterieure-en-ceramique",
               lg: { x: 5, y: 60 },
               hideHotspotsOnMobile: true,
            },
         ],
      },
      {
         id: "bedroom",
         imageSrc: "/assets/bedroom-hero.png",
         imageAlt: "Ambiance chambre avec literie et éclairage.",
         copy: {
            eyebrow: "Chambre",
            title: "Dormir. Superposer. Rêver.",
         },
         cta: { href: "/collections/chambre", label: "Explorer la chambre" },
         hotspots: [
            {
               handle: "lit-king-capitonne-moderne",
               lg: { x: 80, y: 70 },
               sm: { x: 80, y: 60 },
            },
            {
               handle: "housse-de-couette-gaze-de-coton-king",
               lg: { x: 30, y: 70 },
               sm: { x: 30, y: 50 },
            },
            {
               handle: "lampe-de-table-design-moderne",
               lg: { x: 13, y: 42 },
               hideHotspotsOnMobile: true,
            },
            {
               handle: "tapis-interieur-exterieur-8x10-moderne",
               lg: { x: 20, y: 95 },
            },
         ],
      },
   ] satisfies HomeHeroSlide[],
} as const;

export function getHomeHeroHandles() {
   return Array.from(
      new Set(
         homeHero.slides.flatMap((slide) =>
            slide.hotspots.map((h) => h.handle),
         ),
      ),
   );
}
