// GripForce UF – script.js
// Vanilla JS, inga beroenden.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initColorSwatches();
    initScrollTop();
    initRevealOnScroll();
    initYear();
  });

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
