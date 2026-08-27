import { dictionaries, type Locale } from "@/i18n";

// TODO: Confirm exact estates, regions, and producer details with founder before production release.
const originClasses = [
  "origin-one",
  "origin-two",
  "origin-three",
  "origin-four",
  "origin-five",
  "origin-six",
];

export function getOrigins(locale: Locale) {
  return dictionaries[locale].origins.map((name, index) => ({
    name,
    className: originClasses[index],
  }));
}
