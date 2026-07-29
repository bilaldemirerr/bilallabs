export type AppLegal = {
  slug: string;
  name: string;
  description: string;
};

/** Add each new product here — creates index links under /{slug}/privacy and /{slug}/terms */
export const APPS: AppLegal[] = [
  {
    slug: "shotly",
    name: "Shotly",
    description: "GLP-1 shot, dose, weight, and side-effect tracker",
  },
];
