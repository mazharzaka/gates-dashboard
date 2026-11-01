import { ar } from "./ar.js";
import { en } from "./en.js";

export const dictionaries = { ar, en };

/**
 * Translates a key based on language and replaces parameters like {param}
 *
 * @param {'ar'|'en'} lang
 * @param {string} key
 * @param {Record<string, string|number>} [params]
 * @returns {string}
 */
export function t(lang, key, params = {}) {
  const dict = dictionaries[lang] || dictionaries.ar;
  let text = dict[key] ?? dictionaries.en[key] ?? key;

  if (typeof text === "string" && params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
    });
  }

  return text;
}
