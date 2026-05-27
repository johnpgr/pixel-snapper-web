let messages: Record<string, { message: string }> = {};
let currentLocale: string = "en";

export async function init(): Promise<void> {
  const lang = navigator.language || "";
  currentLocale = lang.startsWith("pt") ? "pt_BR" : "en";

  try {
    const response = await fetch(`./_locales/${currentLocale}/messages.json`);
    messages = await response.json();
  } catch (error) {
    console.error(`[i18n] Failed to load locale messages for "${currentLocale}":`, error);
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

  document.documentElement.lang = currentLocale.replace("_", "-");
}

export function t(key: string, substitutions?: string | number | Array<string | number>): string {
  const entry = messages[key];
  if (!entry) {
    return key;
  }

  let text = entry.message;
  if (substitutions) {
    const subs = Array.isArray(substitutions) ? substitutions : [substitutions];
    subs.forEach((val, idx) => {
      text = text.replaceAll(`$${idx + 1}`, String(val));
    });
  }
  return text;
}

export function translatePage(): void {
  const pageTitle = t("pageTitle");
  if (pageTitle !== "pageTitle") {
    document.title = pageTitle;
  }

  const textElements = document.querySelectorAll("[data-i18n]");
  textElements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (key) {
      element.textContent = t(key);
    }
  });

  const ariaElements = document.querySelectorAll("[data-i18n-aria-label]");
  ariaElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-aria-label");
    if (key) {
      element.setAttribute("aria-label", t(key));
    }
  });

  const titleElements = document.querySelectorAll("[data-i18n-title]");
  titleElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-title");
    if (key) {
      element.setAttribute("title", t(key));
    }
  });

  const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
  placeholderElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (key) {
      element.setAttribute("placeholder", t(key));
    }
  });

  const metaElements = document.querySelectorAll("[data-i18n-content]");
  metaElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-content");
    if (key) {
      element.setAttribute("content", t(key));
    }
  });
}
