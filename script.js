// GripForce UF – script.js
// Vanilla JS, inga beroenden.

(function () {
  "use strict";

  var PRICE_PER_PAIR = 199;

  document.addEventListener("DOMContentLoaded", function () {
    initAccordion();
    initOrderForm();
    initScrollTop();
    initRevealOnScroll();
    initYear();
  });

  /* ---------------- FAQ accordion ---------------- */
  function initAccordion() {
    var triggers = document.querySelectorAll(".accordion-trigger");

    triggers.forEach(function (trigger) {
      var panel = trigger.nextElementSibling;
      panel.style.maxHeight = "0px";

      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        // Close all
        triggers.forEach(function (t) {
          t.setAttribute("aria-expanded", "false");
          t.nextElementSibling.style.maxHeight = "0px";
        });

        // Open the clicked one, unless it was already open
        if (!isOpen) {
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------------- Order form ---------------- */
  function initOrderForm() {
    var form = document.getElementById("orderForm");
    if (!form) return;

    var quantityInput = document.getElementById("quantity");
    var totalEl = document.getElementById("orderTotal");
    var statusEl = document.getElementById("formStatus");

    function updateTotal() {
      var qty = parseInt(quantityInput.value, 10);
      if (isNaN(qty) || qty < 1) qty = 1;
      var total = qty * PRICE_PER_PAIR;
      totalEl.textContent = total.toLocaleString("sv-SE") + " kr";
    }

    quantityInput.addEventListener("input", updateTotal);
    updateTotal();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.className = "form-status";
      statusEl.textContent = "";

      var valid = true;
      var name = document.getElementById("name");
      var email = document.getElementById("email");
      var quantity = document.getElementById("quantity");

      var nameError = document.getElementById("nameError");
      var emailError = document.getElementById("emailError");
      var quantityError = document.getElementById("quantityError");

      nameError.textContent = "";
      emailError.textContent = "";
      quantityError.textContent = "";

      if (!name.value.trim()) {
        nameError.textContent = "Ange ditt namn.";
        valid = false;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        emailError.textContent = "Ange en giltig e-postadress.";
        valid = false;
      }

      var qtyValue = parseInt(quantity.value, 10);
      if (isNaN(qtyValue) || qtyValue < 1 || qtyValue > 20) {
        quantityError.textContent = "Ange ett antal mellan 1 och 20.";
        valid = false;
      }

      if (!valid) {
        statusEl.textContent = "Kontrollera fälten markerade ovan.";
        statusEl.className = "form-status error";
        return;
      }

      // Ingen backend i detta projekt – vi bekräftar lokalt.
      var qty = qtyValue;
      var total = (qty * PRICE_PER_PAIR).toLocaleString("sv-SE");

      statusEl.textContent =
        "Tack, " + name.value.trim() + "! Din beställning på " + qty +
        " par (" + total + " kr) är mottagen. Vi hör av oss till " +
        email.value.trim() + " inom kort.";
      statusEl.className = "form-status success";

      form.reset();
      updateTotal();
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
      ".feature-card, .product-grid, .steps li, .about-grid, .strap-card"
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
