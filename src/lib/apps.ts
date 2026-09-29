export type AppLegal = {
  slug: string;
  name: string;
  description: string;
};

/** Add each new product here — creates index links under /{slug}/privacy and /{slug}/terms */
export const APPS: AppLegal[] = [
  {
    slug: "kpss/ortaogretim",
    name: "KPSS Ortaöğretim",
    description: "Çözümlü sorular ve aralıklı tekrar sistemi",
  },
  {
    slug: "shotly",
    name: "Shotly",
    description: "GLP-1 shot, dose, weight, and side-effect tracker",
  },
  {
    slug: "lovely",
    name: "Lovely",
    description: "A private app for two partners: stories, moods, journal and distance",
  },
];
