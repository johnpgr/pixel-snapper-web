import * as i18n from "./lib/i18n.ts";
import "./global.ts"

(async () => {
  await i18n.init();
  i18n.translatePage();

  await import("./components/pixel-snapper-app.ts");
})();
