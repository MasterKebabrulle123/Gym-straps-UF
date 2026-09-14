// GripForce UF – script.js
// Vanilla JS, inga beroenden.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initSmoothScroll();
    initColorSwatches();
    initCopySwishNumber();
    initScrollTop();
    initRevealOnScroll();
    initYear();
  });

  /* ---------------- Ljust/mörkt tema ----------------
     Det initiala valet (sparat värde, annars prefers-color-scheme)
     sätts redan synkront i <head> innan sidan målas upp – se den
     inline-scripttaggen i index.html. Här kopplar vi bara på
     klick-hanteringen och håller aria-pressed uppdaterad. */
  function initThemeToggle() {
    var toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    var root = document.documentElement;

    function isLight() {
      return root.getAttribute("data-theme") === "light";
    }

    function syncAria() {
      toggle.setAttribute("aria-pressed", String(isLight()));
    }

    syncAria();

    toggle.addEventListener("click", function () {
      var nextTheme = isLight() ? "dark" : "light";

      if (nextTheme === "light") {
        root.setAttribute("data-theme", "light");
      } else {
        root.removeAttribute("data-theme");
      }

      try {
        localStorage.setItem("theme", nextTheme);
      } catch (e) {}

      syncAria();
    });
  }

  /* ---------------- Mjuk scroll för interna länkar ---------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id.length < 2) return;

        var target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ---------------- Färgval ---------------- */
  function initColorSwatches() {
    var swatches = document.querySelectorAll(".swatch");
    var frame = document.getElementById("productImageFrame");
    var label = document.getElementById("selectedColorLabel");
    if (!swatches.length || !frame) return;

    swatches.forEach(function (swatch) {
      swatch.addEventListener("click", function () {
        var color = swatch.getAttribute("data-color");

        swatches.forEach(function (s) {
          s.classList.remove("is-active");
          s.setAttribute("aria-pressed", "false");
        });
        swatch.classList.add("is-active");
        swatch.setAttribute("aria-pressed", "true");

        // Byt "huvudbilden". Med riktiga produktfoton: ersätt raden nedan
        // med att sätta <img>-elementets src till rätt fil för färgen.
        frame.setAttribute("data-color", color);
        if (label) label.textContent = color;
      });
    });
  }

  /* ---------------- Kopiera Swish-nummer ---------------- */
  function initCopySwishNumber() {
    var btn = document.getElementById("copySwishBtn");
    var confirm = document.getElementById("copyConfirm");
    if (!btn) return;

    var resetTimer;

    btn.addEventListener("click", function () {
      var number = btn.getAttribute("data-swish-number") || "";
      copyText(number).then(function (ok) {
        if (!confirm) return;
        confirm.textContent = ok ? "Kopierat!" : "Kunde inte kopiera";

        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          confirm.textContent = "";
        }, 2000);
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return false; }
      );
    }

    // Fallback för äldre webbläsare / icke-säkra kontexter.
    try {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return Promise.resolve(ok);
    } catch (err) {
      return Promise.resolve(false);
    }
  }

  /* ---------------- Scroll-to-top button ---------------- */
  function initScrollTop() {
    var btn = document.getElementById("scrollTop");
    if (!btn) return;

    function toggleVisibility() {
      if (window.scrollY > 500) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Reveal-on-scroll ---------------- */
  function initRevealOnScroll() {
    var targets = document.querySelectorAll(
      ".product-grid, .sustain-grid, .steps li, .strap-card"
    );

    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    targets.forEach(function (el) { el.classList.add("reveal"); });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- Footer year ---------------- */
  function initYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
})();
