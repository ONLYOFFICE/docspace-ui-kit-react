/**
 * The numbering system to pass to Intl and toLocale*String(). Intl takes the digits
 * from the locale, and ar-SA prints Arabic-Indic ones; the portal shows Western digits
 * in every language. The client keeps the same constant in
 * `@docspace/shared/utils/latin-digits`.
 */
export const LATIN_NUMBERING_SYSTEM = "latn";
