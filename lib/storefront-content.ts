export type MainCollection = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  collectionId?: string;
  accentClass: string;
};

export const mainCollections: MainCollection[] = [
  {
    slug: "decoration",
    title: "Décoration",
    subtitle: "Objets signatures et détails raffinés",
    description:
      "Vases sculpturaux, luminaires d'ambiance et accessoires qui donnent une identité forte à votre intérieur.",
    tag: "Décoration",
    collectionId: "gid://shopify/Collection/367832105115",
    accentClass: "from-amber-100 via-rose-100 to-orange-100",
  },
  {
    slug: "literie",
    title: "Literie",
    subtitle: "Confort hôtel particulier",
    description:
      "Parures, plaids et coussins premium pour transformer la chambre en cocon élégant.",
    tag: "Literie",
    collectionId: "gid://shopify/Collection/367832072347",
    accentClass: "from-sky-100 via-cyan-100 to-indigo-100",
  },
  {
    slug: "chaises-lounge",
    title: "Chaises Lounge",
    subtitle: "Silhouettes iconiques et accueil moelleux",
    description:
      "Assises enveloppantes, matières tactiles et lignes contemporaines pour vos coins détente.",
    tag: "Chaises Lounge",
    collectionId: "gid://shopify/Collection/367832039579",
    accentClass: "from-violet-100 via-fuchsia-100 to-pink-100",
  },
  {
    slug: "chambre",
    title: "Chambre",
    subtitle: "Ambiance douce et architecture textile",
    description:
      "Mélange de textures, lumière tamisée et mobilier pensé pour le repos.",
    tag: "Chambre",
    collectionId: "gid://shopify/Collection/367831974043",
    accentClass: "from-lime-100 via-emerald-100 to-teal-100",
  },
  {
    slug: "salle-a-manger",
    title: "Salle à Manger",
    subtitle: "L'art de recevoir à la française",
    description:
      "Tables, assises et éléments de mise en scène pour des repas élégants et chaleureux.",
    tag: "Salle à Manger",
    collectionId: "gid://shopify/Collection/367831908507",
    accentClass: "from-orange-100 via-amber-100 to-yellow-100",
  },
  {
    slug: "salon",
    title: "Salon",
    subtitle: "Pièce maîtresse de la maison",
    description:
      "Compositions modernes, tonalités minérales et détails couture pour un salon remarquable.",
    tag: "Salon",
    collectionId: "gid://shopify/Collection/367831842971",
    accentClass: "from-slate-100 via-zinc-100 to-stone-100",
  },
  {
    slug: "canape",
    title: "Canapé",
    subtitle: "Volumes généreux et lignes pures",
    description:
      "Canapés modulaires et pièces statement conçus pour allier esthétique et usage quotidien.",
    tag: "Canapé",
    accentClass: "from-red-100 via-orange-100 to-amber-100",
  },
];

export type MegaMenuGroup = {
  title: string;
  description: string;
  items: {
    label: string;
    helper: string;
    href: string;
  }[];
};

export const megaMenuGroups: MegaMenuGroup[] = [
  {
    title: "Collections",
    description: "Découvrez nos lignes signatures par univers.",
    items: mainCollections.map((collection) => ({
      label: collection.title,
      helper: collection.subtitle,
      href: `/collections/${collection.slug}`,
    })),
  },
  {
    title: "Inspirations",
    description: "Parcourez nos ambiances pour imaginer votre intérieur.",
    items: [
      {
        label: "Paris Élégant",
        helper: "Palette chaude et matières nobles",
        href: "/inspirations/paris-elegant",
      },
      {
        label: "Calme Minéral",
        helper: "Textures naturelles et teintes douces",
        href: "/inspirations/calme-mineral",
      },
      {
        label: "Esprit Galerie",
        helper: "Volumes artistiques et contrastes assumés",
        href: "/inspirations/esprit-galerie",
      },
    ],
  },
  {
    title: "Conseils",
    description: "Guides rapides pour composer des espaces harmonieux.",
    items: [
      {
        label: "Styler un salon moderne",
        helper: "Nos règles de composition visuelle",
        href: "/conseils/styler-salon-moderne",
      },
      {
        label: "Créer une chambre cocon",
        helper: "Textiles, lumière et équilibre",
        href: "/conseils/chambre-cocon",
      },
      {
        label: "Recevoir avec style",
        helper: "Dressage et ambiance de table",
        href: "/conseils/recevoir-avec-style",
      },
    ],
  },
];

export const homeInspirationCards = [
  {
    title: "Paris Élégant",
    blurb:
      "Un mix de pièces sculpturales et de textiles doux pour une ambiance intemporelle.",
    href: "/inspirations/paris-elegant",
  },
  {
    title: "Calme Minéral",
    blurb:
      "Des tons pierre et des matières naturelles qui installent une sensation de sérénité.",
    href: "/inspirations/calme-mineral",
  },
  {
    title: "Esprit Galerie",
    blurb:
      "Contrastes graphiques, objets audacieux et mobilier signature pour une allure éditoriale.",
    href: "/inspirations/esprit-galerie",
  },
];

export const homeGuideCards = [
  {
    title: "Composer un salon chaleureux",
    blurb:
      "Trois étapes pour structurer l'espace sans surcharger votre décoration.",
    href: "/conseils/styler-salon-moderne",
  },
  {
    title: "Bien choisir sa literie",
    blurb: "Nos repères pour associer matières, couleurs et confort premium.",
    href: "/conseils/chambre-cocon",
  },
  {
    title: "Recevoir en toute élégance",
    blurb:
      "Des idées simples pour créer une table contemporaine et conviviale.",
    href: "/conseils/recevoir-avec-style",
  },
];

export function getCollectionBySlug(slug: string) {
  return mainCollections.find((collection) => collection.slug === slug);
}
