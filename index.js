import * as i18n from "./lib/i18n.js";

(async () => {
  // Initialize translations and apply to standard DOM elements first
  await i18n.init();
  i18n.translatePage();

  // Dynamically import the app to ensure custom elements connect to translated DOM
  await import("./components/pixel-snapper-app.js");
})();

