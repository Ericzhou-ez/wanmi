export type HomeHeroHotspotCoords = {
  x: number;
  y: number;
};

export type HomeHeroHotspot = {
  handle: string;
  lg: HomeHeroHotspotCoords;
  sm?: HomeHeroHotspotCoords;
  hideHotspotsOnMobile?: boolean;
};

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

export type HomeHeroProduct = {
  handle: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  priceAmount?: string;
  priceCurrency?: string;
};
