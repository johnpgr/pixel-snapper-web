/**
 * @fileoverview Lightweight, zero-dependency client-side internationalization (i18n) module.
 * Loads JSON locale files and translates DOM elements and dynamic strings.
 */

/**
 * Current dictionary of message keys and translations.
 * @type {Record<string, { message: string }>}
 */
let messages = {};

/**
 * Currently loaded locale code (e.g. "en" or "pt_BR").
 * @type {string}
 */
let currentLocale = "en";

/**
 * Detects the user's browser language, loads the corresponding JSON locale file,
 * and updates the HTML lang attribute for accessibility/SEO.
 *
 * @returns {Promise<void>}
 */
export async function init() {
  const lang = navigator.language || "";
  currentLocale = lang.startsWith("pt") ? "pt_BR" : "en";

  try {
    const response = await fetch(`./_locales/${currentLocale}/messages.json`);
    messages = await response.json();
  } catch (error) {
    console.error(`[i18n] Failed to load locale messages for "${currentLocale}":`, error);
    // Try falling back to English if it wasn't English
    if (currentLocale !== "en") {
      try {
        const response = await fetch("./_locales/en/messages.json");
        messages = await response.json();
        currentLocale = "en";
      } catch (fallbackError) {
        console.error("[i18n] Failed to load fallback locale \"en\":", fallbackError);
      }
    }
  }

  // Update HTML document lang tag following BCP 47 standards (hyphen instead of underscore)
  document.documentElement.lang = currentLocale.replace("_", "-");
}

/**
 * Retrieves the localized string for a given key, substituting placeholder variables if provided.
 * Supports Chrome-extension style placeholders (e.g., "$1" representing first substitution).
 *
 * @param {string} key - The key of the message.
 * @param {string | number | Array<string | number>} [substitutions] - A single value or an array of values to substitute.
 * @returns {string} The localized string, or the key itself if not found.
 */
export function t(key, substitutions) {
  const entry = messages[key];
  if (!entry) {
    return key;
  }

  let text = entry.message;
  if (substitutions !== undefined) {
    const subs = Array.isArray(substitutions) ? substitutions : [substitutions];
    subs.forEach((val, idx) => {
      text = text.replaceAll(`$${idx + 1}`, String(val));
    });
  }
  return text;
}

/**
 * Performs a declarative translation of the entire DOM structure using custom data-i18n attributes.
 * Also dynamically updates the browser page title.
 */
export function translatePage() {
  // Translate page title
  const pageTitle = t("pageTitle");
  if (pageTitle !== "pageTitle") {
    document.title = pageTitle;
  }

  // Translate text content
  const textElements = document.querySelectorAll("[data-i18n]");
  textElements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (key) {
      element.textContent = t(key);
    }
  });

  // Translate aria-label attributes
  const ariaElements = document.querySelectorAll("[data-i18n-aria-label]");
  ariaElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-aria-label");
    if (key) {
      element.setAttribute("aria-label", t(key));
    }
  });

  // Translate title attributes (tooltips)
  const titleElements = document.querySelectorAll("[data-i18n-title]");
  titleElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-title");
    if (key) {
      element.setAttribute("title", t(key));
    }
  });

  // Translate placeholder attributes
  const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
  placeholderElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (key) {
      element.setAttribute("placeholder", t(key));
    }
  });

  // Translate meta tags content attributes
  const metaElements = document.querySelectorAll("[data-i18n-content]");
  metaElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-content");
    if (key) {
      element.setAttribute("content", t(key));
    }
  });
}
