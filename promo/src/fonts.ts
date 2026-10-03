import { continueRender, delayRender } from "remotion";

/**
 * Loads the app's fonts from Google Fonts. Archivo is pulled as the variable
 * font so the condensed width axis (font-stretch: 72%) renders like the app.
 */
const HREF =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Space+Grotesk:wght@400;500;600;700&family=Anuphan:wght@400;500;600;700&display=block";

if (typeof document !== "undefined" && !document.getElementById("tipsy-fonts")) {
  const handle = delayRender("Loading fonts");
  const link = document.createElement("link");
  link.id = "tipsy-fonts";
  link.rel = "stylesheet";
  link.href = HREF;
  link.onload = () => {
    // Touch every face we use so the browser fetches them before the first frame.
    const faces = [
      "800 72px Archivo",
      "700 20px 'Space Grotesk'",
      "600 20px 'Space Grotesk'",
      "400 20px 'Space Grotesk'",
      "700 20px Anuphan",
      "600 20px Anuphan",
      "400 20px Anuphan",
    ];
    Promise.all(faces.map((f) => document.fonts.load(f, "Tipsy เกมวงเหล้า")))
      .then(() => document.fonts.ready)
      .finally(() => continueRender(handle));
  };
  link.onerror = () => continueRender(handle);
  document.head.appendChild(link);
}
