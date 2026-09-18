// GripForce UF – theme-init.js
// Måste laddas synkront i <head>, INNAN style.css, och köras före första
// målningen. Extern fil (inte en inline <script>) med avsikt: en strikt
// Content-Security-Policy utan 'unsafe-inline' i script-src kräver det.

(function () {
  "use strict";

  // Sätter sparat/föredraget tema innan sidan målas upp, så det aldrig
  // blinkar till fel tema (FOUC). CSS:ens standard (inget data-theme) är
  // redan mörkt tema, så vi behöver bara agera när resultatet blir ljust.
  try {
    var saved = localStorage.getItem("theme");
    var wantsLight = saved
      ? saved === "light"
      : window.matchMedia("(prefers-color-scheme: light)").matches;
    if (wantsLight) document.documentElement.setAttribute("data-theme", "light");
  } catch (e) {}

  // Enkelt clickjacking-skydd (frame-busting). GitHub Pages tillåter inte
  // egna HTTP-headers, så X-Frame-Options/CSP frame-ancestors går inte att
  // sätta där – det här är ett fallback-skydd i JS för den hosting-miljön.
  // Netlify (se _headers) skyddas redan korrekt via riktiga headers, vilket
  // alltid är starkare än denna JS-baserade reserv.
  try {
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  } catch (e) {
    // Cross-origin-inramning kastar ofta ett SecurityError redan vid
    // jämförelsen ovan – det är i sig en signal om att sidan är inramad,
    // så vi döljer innehållet som sista utväg. En CSS-klass istället för
    // element.style.* – vår CSP tillåter inga JS-satta inline-stilar.
    document.documentElement.classList.add("js-framed-hidden");
  }
})();
