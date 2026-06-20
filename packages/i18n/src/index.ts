export type { Locale, Messages } from "./types";
export { es } from "./locales/es";
export { en } from "./locales/en";

import type { Locale, Messages } from "./types";
import { es } from "./locales/es";
import { en } from "./locales/en";

export function getMessages(locale: Locale): Messages {
  return locale === "en" ? en : es;
}

export function t(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

export const LOCALE_COOKIE = "realtor-locale";
