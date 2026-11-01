/**
 * Formats an ISO date/time string into a human-readable date and time.
 * Supports Arabic and English locales.
 *
 * @param {string|Date} timestamp
 * @param {'ar'|'en'} language
 * @returns {string}
 */
export function formatDateTime(timestamp, language = "ar") {
  if (!timestamp) return "-";
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  if (isNaN(date.getTime())) return "-";

  const locale = language === "ar" ? "ar-EG" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).format(date);
}

/**
 * Formats time only (HH:MM:SS AM/PM)
 */
export function formatTimeOnly(timestamp, language = "ar") {
  if (!timestamp) return "-";
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  if (isNaN(date.getTime())) return "-";

  const locale = language === "ar" ? "ar-EG" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).format(date);
}

