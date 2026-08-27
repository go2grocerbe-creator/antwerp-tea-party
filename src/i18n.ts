export const locales = ["nl", "fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "nl";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale, hash = "") {
  return `/${locale}${hash}`;
}

export const dictionaries = {
  en: {
    metadata: {
      title: "The Antwerp Tea Party | Tea Shop Antwerp",
      description:
        "A specialized tea boutique in Antwerp offering rare artisanal teas, matcha, infusions, tastings, and a quiet place to discover tea.",
    },
    language: {
      label: "Choose language",
      nl: "Dutch",
      fr: "French",
      en: "English",
    },
    navigation: {
      label: "Primary navigation",
      home: "The Antwerp Tea Party homepage",
      teas: "Teas",
      tastings: "Tastings",
      about: "About",
      visit: "Visit",
    },
    hero: {
      eyebrow: "Leaf · origin · storage · cup",
      headline: "Every cup begins somewhere.",
      body: "Follow the leaf into the shop, the kettle, and the quiet of the table.",
      scroll: "Scroll to follow the journey",
    },
    journey: {
      tinTitle: "Stored with care.",
      tinBody: "Selected with knowledge.",
      shelfTitle: "Hundreds of teas. One place to discover them.",
      shelfBody: "Find the tea that feels like yours.",
      shelfCta: "Explore the teas",
      originsLabel: "Tea sourcing locations",
    },
    origins: ["Darjeeling", "China", "Nepal", "India", "Bangladesh", "Mozambique"],
    shop: {
      eyebrow: "Inside the shop",
      title: "A tea shop built for curiosity.",
      body: "Ask questions. Smell the leaves. Discover something unfamiliar. Or simply find the tea you already love.",
      categories: ["Rare teas", "Pu Erh", "Matcha", "Teaware", "Gifts"],
    },
    knowledge: {
      eyebrow: "Knowledge",
      title: "Tea chosen with knowledge.",
      body: "A good tea shop is not only about selection. It is about helping someone discover what suits them.",
    },
    table: {
      eyebrow: "The table",
      title: "Some teas are better shared.",
      body: "Tea tastings · Private gatherings · Conversations about tea",
      primaryCta: "Book a tasting",
      secondaryCta: "Discover tea experiences",
    },
    paths: {
      discoverTitle: "Discover the shop",
      discoverAction: "Explore the tea collection",
      experienceTitle: "Experience tea",
      experienceAction: "Book a tasting",
      visitTitle: "Visit",
      visitAction: "Find us in Antwerp",
      label: "Three ways to continue",
    },
    footer: {
      eyebrow: "Visit",
      title: "Come find your tea.",
      openingHours: "Opening hours",
      telephone: "Telephone",
      email: "Email",
      instagram: "Instagram",
      hoursValue: "Opening hours to be confirmed",
      phoneValue: "Telephone to be confirmed",
      emailValue: "Email to be confirmed",
      instagramValue: "Instagram to be confirmed",
    },
  },
  nl: {
    metadata: {
      title: "The Antwerp Tea Party | Theewinkel Antwerpen",
      description:
        "Een gespecialiseerde theeboetiek in Antwerpen met bijzondere artisanale thee, matcha, infusies, proeverijen en een rustige plek om thee te ontdekken.",
    },
    language: {
      label: "Kies taal",
      nl: "Nederlands",
      fr: "Frans",
      en: "Engels",
    },
    navigation: {
      label: "Hoofdnavigatie",
      home: "The Antwerp Tea Party startpagina",
      teas: "Thee",
      tastings: "Proeverijen",
      about: "Over ons",
      visit: "Bezoek",
    },
    hero: {
      eyebrow: "Blad · herkomst · bewaring · kopje",
      headline: "Elk kopje begint ergens.",
      body: "Volg het theeblad naar de winkel, de theepot en de rust van de tafel.",
      scroll: "Scroll en volg de reis",
    },
    journey: {
      tinTitle: "Met zorg bewaard.",
      tinBody: "Met kennis geselecteerd.",
      shelfTitle: "Honderden soorten thee. Een plek om ze te ontdekken.",
      shelfBody: "Vind de thee die bij u past.",
      shelfCta: "Ontdek onze thee",
      originsLabel: "Herkomstlocaties van thee",
    },
    origins: ["Darjeeling", "China", "Nepal", "India", "Bangladesh", "Mozambique"],
    shop: {
      eyebrow: "In de winkel",
      title: "Een theewinkel voor nieuwsgierige mensen.",
      body: "Stel vragen. Ruik aan de bladeren. Ontdek iets nieuws. Of vind gewoon de thee waar u al van houdt.",
      categories: ["Bijzondere thee", "Pu Erh", "Matcha", "Theebenodigdheden", "Geschenken"],
    },
    knowledge: {
      eyebrow: "Kennis",
      title: "Thee gekozen met kennis.",
      body: "Een goede theewinkel draait niet alleen om keuze. Het gaat erom iemand te helpen ontdekken welke thee bij hem of haar past.",
    },
    table: {
      eyebrow: "Aan tafel",
      title: "Sommige thee smaakt beter samen.",
      body: "Theeproeverijen · Privébijeenkomsten · Gesprekken over thee",
      primaryCta: "Boek een proeverij",
      secondaryCta: "Ontdek thee-ervaringen",
    },
    paths: {
      discoverTitle: "Ontdek de winkel",
      discoverAction: "Bekijk de theecollectie",
      experienceTitle: "Beleef thee",
      experienceAction: "Boek een proeverij",
      visitTitle: "Bezoek",
      visitAction: "Vind ons in Antwerpen",
      label: "Drie manieren om verder te gaan",
    },
    footer: {
      eyebrow: "Bezoek",
      title: "Kom uw thee ontdekken.",
      openingHours: "Openingsuren",
      telephone: "Telefoon",
      email: "E-mail",
      instagram: "Instagram",
      hoursValue: "Openingsuren nog te bevestigen",
      phoneValue: "Telefoonnummer nog te bevestigen",
      emailValue: "E-mailadres nog te bevestigen",
      instagramValue: "Instagram nog te bevestigen",
    },
  },
  fr: {
    metadata: {
      title: "The Antwerp Tea Party | Boutique de thé à Anvers",
      description:
        "Une boutique de thé spécialisée à Anvers, avec des thés artisanaux rares, du matcha, des infusions, des dégustations et un lieu calme pour découvrir le thé.",
    },
    language: {
      label: "Choisir la langue",
      nl: "Néerlandais",
      fr: "Français",
      en: "Anglais",
    },
    navigation: {
      label: "Navigation principale",
      home: "Accueil The Antwerp Tea Party",
      teas: "Thés",
      tastings: "Dégustations",
      about: "À propos",
      visit: "Visiter",
    },
    hero: {
      eyebrow: "Feuille · origine · conservation · tasse",
      headline: "Chaque tasse commence quelque part.",
      body: "Suivez la feuille de thé jusqu'à la boutique, la théière et au calme de la table.",
      scroll: "Faites défiler pour suivre le voyage",
    },
    journey: {
      tinTitle: "Conservé avec soin.",
      tinBody: "Sélectionné avec expertise.",
      shelfTitle: "Des centaines de thés. Un seul endroit pour les découvrir.",
      shelfBody: "Trouvez le thé qui vous correspond.",
      shelfCta: "Découvrir nos thés",
      originsLabel: "Lieux d'origine du thé",
    },
    origins: ["Darjeeling", "Chine", "Népal", "Inde", "Bangladesh", "Mozambique"],
    shop: {
      eyebrow: "Dans la boutique",
      title: "Une boutique de thé faite pour la curiosité.",
      body: "Posez vos questions. Sentez les feuilles. Découvrez quelque chose de nouveau. Ou retrouvez simplement le thé que vous aimez déjà.",
      categories: ["Thés rares", "Pu Erh", "Matcha", "Accessoires de thé", "Cadeaux"],
    },
    knowledge: {
      eyebrow: "Savoir-faire",
      title: "Du thé choisi avec expertise.",
      body: "Une bonne boutique de thé ne se résume pas au choix. Elle aide chacun à découvrir le thé qui lui convient.",
    },
    table: {
      eyebrow: "À table",
      title: "Certains thés sont meilleurs lorsqu'ils sont partagés.",
      body: "Dégustations · Rencontres privées · Conversations autour du thé",
      primaryCta: "Réserver une dégustation",
      secondaryCta: "Découvrir les expériences autour du thé",
    },
    paths: {
      discoverTitle: "Découvrir la boutique",
      discoverAction: "Explorer la collection de thés",
      experienceTitle: "Vivre le thé",
      experienceAction: "Réserver une dégustation",
      visitTitle: "Visiter",
      visitAction: "Nous trouver à Anvers",
      label: "Trois manières de continuer",
    },
    footer: {
      eyebrow: "Visiter",
      title: "Venez trouver votre thé.",
      openingHours: "Heures d'ouverture",
      telephone: "Téléphone",
      email: "E-mail",
      instagram: "Instagram",
      hoursValue: "Horaires à confirmer",
      phoneValue: "Téléphone à confirmer",
      emailValue: "Adresse e-mail à confirmer",
      instagramValue: "Instagram à confirmer",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];
