export type MainCollection = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  collectionId?: string;
  accentClass: string;
};

export type MegaMenuInspirationData = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export type MegaMenuColumnLink = {
  label: string;
  href: string;
};

export type MegaMenuColumnSection = {
  label: string;
  links: MegaMenuColumnLink[];
};

export type MegaMenuColumn = {
  id: string;
  title: string;
  titleHref: string;
  links: MegaMenuColumnLink[];
  sections?: MegaMenuColumnSection[];
  inspiration: MegaMenuInspirationData;
  tone?: "default" | "muted";
};

export type MegaMenuLegacyItem = {
  label: string;
  href: string;
  helper?: string;
};

export type MegaMenuGroup = {
  trigger: string;
  columns?: MegaMenuColumn[];
  items?: MegaMenuLegacyItem[];
};
