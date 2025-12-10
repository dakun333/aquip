export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

// 如果浏览器或IP解析的语言不在列表内，都会 fallback 到 zh
export function getFallbackLocale(lang: string | null): Locale {
  if (!lang) return defaultLocale;

  const short = lang.split("-")[0].toLowerCase();
  return locales.includes(short as Locale) ? (short as Locale) : defaultLocale;
}
export const i18n = {
  defaultLocale: "en",
  locales: ["zh", "en"],
} as const;
