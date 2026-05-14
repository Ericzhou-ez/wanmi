import type {
  MainCollection,
  MegaMenuColumn,
  MegaMenuColumnLink,
  MegaMenuGroup,
  MegaMenuInspirationData,
} from "types/content";
export type {
  MainCollection,
  MegaMenuColumn,
  MegaMenuColumnLink,
  MegaMenuColumnSection,
  MegaMenuGroup,
  MegaMenuInspirationData,
  MegaMenuLegacyItem,
} from "types/content";

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

const FALLBACK_INSPIRATION: MegaMenuInspirationData = {
  title: "Découvrir →",
  href: "/search",
  imageSrc:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80",
  imageAlt: "Aperçu collection",
};

/** Resolves columns for panels and mobile flattening (supports legacy `items`). */
export function getMegaMenuPanelColumns(
  group: MegaMenuGroup,
): MegaMenuColumn[] {
  const cols = group.columns;
  if (Array.isArray(cols) && cols.length > 0) {
    return cols;
  }
  const items = group.items;
  if (Array.isArray(items) && items.length > 0) {
    return [
      {
        id: `${group.trigger}-legacy`,
        title: group.trigger,
        titleHref: "/search",
        links: items.map((item) => ({ label: item.label, href: item.href })),
        inspiration: FALLBACK_INSPIRATION,
      },
    ];
  }
  return [];
}

/** Flatten column links for mobile drawers (excludes inspiration cards). */
export function getMegaMenuFlatLinks(
  group: MegaMenuGroup,
): MegaMenuColumnLink[] {
  const out: MegaMenuColumnLink[] = [];
  for (const col of getMegaMenuPanelColumns(group)) {
    out.push({ label: col.title, href: col.titleHref });
    out.push(...col.links);
    for (const section of col.sections ?? []) {
      out.push(...section.links);
    }
  }
  return out;
}

const unsplash = {
  salon:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
  chambre:
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80",
  salleAManger:
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
  bureau:
    "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80",
  nouveautes:
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=80",
  canape:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  lounge:
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80",
  literie:
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80",
  deco: "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=900&q=80",
  inspiration:
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
  promos:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
} as const;

export const megaMenuGroups: MegaMenuGroup[] = [
  {
    trigger: "Par pièce",
    columns: [
      {
        id: "salon",
        title: "Salon",
        titleHref: "/collections/salon",
        links: [
          { label: "Canapés et fauteuils", href: "/collections/canape" },
          { label: "Tables basses et consoles", href: "/collections/salon" },
          { label: "Rangements et bibliothèques", href: "/collections/salon" },
          { label: "Luminaires salon", href: "/collections/decoration" },
          { label: "Textiles et tapis", href: "/collections/literie" },
        ],
        inspiration: {
          title: "Inspiration salon →",
          href: "/collections/salon",
          imageSrc: unsplash.salon,
          imageAlt: "Intérieur de salon lumineux avec canapé et table basse",
        },
      },
      {
        id: "chambre",
        title: "Chambre",
        titleHref: "/collections/chambre",
        links: [
          { label: "Lits et têtes de lit", href: "/collections/chambre" },
          { label: "Literie premium", href: "/collections/literie" },
          { label: "Commodes et chevets", href: "/collections/chambre" },
          { label: "Armoires", href: "/collections/chambre" },
          { label: "Lumière tamisée", href: "/collections/decoration" },
        ],
        inspiration: {
          title: "Inspiration chambre →",
          href: "/collections/chambre",
          imageSrc: unsplash.chambre,
          imageAlt: "Chambre élégante avec literie claire",
        },
      },
      {
        id: "salle-a-manger",
        title: "Salle à manger",
        titleHref: "/collections/salle-a-manger",
        links: [
          { label: "Tables à manger", href: "/collections/salle-a-manger" },
          { label: "Chaises et bancs", href: "/collections/chaises-lounge" },
          {
            label: "Buffets et vaisseliers",
            href: "/collections/salle-a-manger",
          },
          { label: "Art de la table", href: "/collections/decoration" },
          { label: "Luminaires suspendus", href: "/collections/decoration" },
        ],
        inspiration: {
          title: "Inspiration repas →",
          href: "/collections/salle-a-manger",
          imageSrc: unsplash.salleAManger,
          imageAlt: "Salle à manger avec table en bois et chaises design",
        },
      },
      {
        id: "bureau-plus",
        title: "Bureau & plus",
        titleHref: "/search?q=bureau",
        links: [
          { label: "Bureaux et secrétaires", href: "/search?q=bureau" },
          {
            label: "Fauteuils de travail",
            href: "/collections/chaises-lounge",
          },
          { label: "Rangements bureau", href: "/collections/decoration" },
        ],
        sections: [
          {
            label: "Plus de pièces",
            links: [
              { label: "Entrée et couloir", href: "/collections/decoration" },
              { label: "Salle de bain", href: "/collections/decoration" },
            ],
          },
          {
            label: "Par matière",
            links: [
              { label: "Bois clair", href: "/search?q=bois+clair" },
              { label: "Noir et métal", href: "/search?q=noir" },
            ],
          },
        ],
        inspiration: {
          title: "Coin bureau →",
          href: "/search?q=bureau",
          imageSrc: unsplash.bureau,
          imageAlt: "Espace bureau à domicile minimaliste",
        },
      },
      {
        id: "nouveautes",
        title: "Nouveautés",
        titleHref: "/search?sort=latest-desc",
        tone: "muted",
        links: [
          { label: "Coups de cœur", href: "/search?sort=best-selling" },
          { label: "Arrivages récents", href: "/search?sort=latest-desc" },
        ],
        sections: [
          {
            label: "Promotions",
            links: [
              { label: "Offres du moment", href: "/search" },
              { label: "Meilleures ventes", href: "/search?sort=best-selling" },
            ],
          },
        ],
        inspiration: {
          title: "Collection éditoriale →",
          href: "/search?sort=latest-desc",
          imageSrc: unsplash.nouveautes,
          imageAlt: "Mobilier design contemporain dans un intérieur",
        },
      },
    ],
  },
  {
    trigger: "Produits",
    columns: [
      {
        id: "canapes",
        title: "Canapés",
        titleHref: "/collections/canape",
        links: [
          { label: "Modulaires", href: "/collections/canape" },
          { label: "Droits 2 et 3 places", href: "/collections/canape" },
          { label: "Angle et panoramiques", href: "/collections/canape" },
        ],
        inspiration: {
          title: "Univers canapé →",
          href: "/collections/canape",
          imageSrc: unsplash.canape,
          imageAlt: "Grand canapé moderne dans un salon",
        },
      },
      {
        id: "assises",
        title: "Assises",
        titleHref: "/collections/chaises-lounge",
        links: [
          { label: "Chaises lounge", href: "/collections/chaises-lounge" },
          { label: "Fauteuils club", href: "/collections/chaises-lounge" },
          { label: "Repose-pieds", href: "/collections/chaises-lounge" },
        ],
        inspiration: {
          title: "Détente assise →",
          href: "/collections/chaises-lounge",
          imageSrc: unsplash.lounge,
          imageAlt: "Fauteuil lounge près d'une fenêtre",
        },
      },
      {
        id: "textiles",
        title: "Literie & textiles",
        titleHref: "/collections/literie",
        links: [
          { label: "Parures et draps", href: "/collections/literie" },
          { label: "Coussins et plaids", href: "/collections/literie" },
          { label: "Surmatelas", href: "/collections/literie" },
        ],
        inspiration: {
          title: "Cocon textile →",
          href: "/collections/literie",
          imageSrc: unsplash.literie,
          imageAlt: "Lit dressé avec coussins et draps naturels",
        },
      },
      {
        id: "deco-produit",
        title: "Décoration",
        titleHref: "/collections/decoration",
        links: [
          { label: "Luminaires", href: "/collections/decoration" },
          { label: "Vases et objets", href: "/collections/decoration" },
          { label: "Miroirs et cadres", href: "/collections/decoration" },
          { label: "Voir tout le catalogue", href: "/search" },
        ],
        inspiration: {
          title: "Détails déco →",
          href: "/collections/decoration",
          imageSrc: unsplash.deco,
          imageAlt: "Accessoires de décoration sur une étagère",
        },
      },
    ],
  },
  {
    trigger: "Collections",
    columns: mainCollections.slice(0, 4).map((c, index) => {
      const collectionImages = [
        unsplash.salon,
        unsplash.chambre,
        unsplash.salleAManger,
        unsplash.lounge,
      ];
      return {
        id: c.slug,
        title: c.title,
        titleHref: `/collections/${c.slug}`,
        links: [
          { label: "Voir la collection", href: `/collections/${c.slug}` },
          { label: "Pièces phares", href: `/collections/${c.slug}` },
        ],
        inspiration: {
          title: `Inspiration ${c.title} →`,
          href: `/collections/${c.slug}`,
          imageSrc: collectionImages[index % collectionImages.length]!,
          imageAlt: c.description.slice(0, 120),
        },
      };
    }),
  },
  {
    trigger: "Inspirations",
    columns: [
      {
        id: "paris",
        title: "Paris élégant",
        titleHref: "/inspirations/paris-elegant",
        links: [
          { label: "Palette chaude", href: "/inspirations/paris-elegant" },
          { label: "Matières nobles", href: "/inspirations/paris-elegant" },
        ],
        inspiration: {
          title: "Découvrir l'univers →",
          href: "/inspirations/paris-elegant",
          imageSrc: unsplash.salon,
          imageAlt: "Ambiance intérieure élégante",
        },
      },
      {
        id: "minerale",
        title: "Calme minéral",
        titleHref: "/inspirations/calme-mineral",
        links: [
          { label: "Tons pierre", href: "/inspirations/calme-mineral" },
          { label: "Textures naturelles", href: "/inspirations/calme-mineral" },
        ],
        inspiration: {
          title: "Découvrir l'univers →",
          href: "/inspirations/calme-mineral",
          imageSrc: unsplash.chambre,
          imageAlt: "Intérieur aux teintes minérales",
        },
      },
      {
        id: "galerie",
        title: "Esprit galerie",
        titleHref: "/inspirations/esprit-galerie",
        links: [
          {
            label: "Contrastes graphiques",
            href: "/inspirations/esprit-galerie",
          },
          { label: "Pièces statement", href: "/inspirations/esprit-galerie" },
        ],
        inspiration: {
          title: "Toutes les inspirations →",
          href: "/inspirations",
          imageSrc: unsplash.deco,
          imageAlt: "Décoration style galerie d'art",
        },
      },
    ],
  },
  {
    trigger: "Sélections",
    columns: [
      {
        id: "best",
        title: "Meilleures ventes",
        titleHref: "/search?sort=best-selling",
        links: [
          { label: "Les plus aimés", href: "/search?sort=best-selling" },
          { label: "Canapés stars", href: "/collections/canape" },
        ],
        inspiration: {
          title: "Shopper le top →",
          href: "/search?sort=best-selling",
          imageSrc: unsplash.canape,
          imageAlt: "Meilleures ventes mobilier",
        },
      },
      {
        id: "nouveaux",
        title: "Nouveautés",
        titleHref: "/search?sort=latest-desc",
        links: [
          { label: "Derniers arrivages", href: "/search?sort=latest-desc" },
          { label: "Tendances", href: "/search?sort=trending-desc" },
        ],
        inspiration: {
          title: "Voir les nouveautés →",
          href: "/search?sort=latest-desc",
          imageSrc: unsplash.nouveautes,
          imageAlt: "Nouvelle collection mobilier",
        },
      },
      {
        id: "guides",
        title: "Guides",
        titleHref: "/conseils",
        links: [
          { label: "Conseils déco", href: "/conseils" },
          { label: "Aide & livraison", href: "/aide/livraison" },
        ],
        inspiration: {
          title: "Lire les guides →",
          href: "/conseils",
          imageSrc: unsplash.bureau,
          imageAlt: "Conseils aménagement",
        },
      },
      {
        id: "promo-block",
        title: "Offres",
        titleHref: "/search",
        tone: "muted",
        links: [
          { label: "Promotions", href: "/search" },
          { label: "Outlet", href: "/search" },
        ],
        inspiration: {
          title: "Profiter des offres →",
          href: "/search",
          imageSrc: unsplash.promos,
          imageAlt: "Salon chaleureux en promotion",
        },
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
