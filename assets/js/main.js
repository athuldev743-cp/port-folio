/**
 * Custom main.js for TOP NAV layout (no sidebar)
 * - Safe guards to avoid "Cannot read properties of null"
 * - Transparent header on top, solid on scroll
 * - Mobile menu toggle
 */

(function () {
  "use strict";

  // Helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /**
   * Header scroll effect (transparent -> solid)
   */
  const header = $("#header");
  function onHeaderScroll() {
    if (!header) return;
    header.classList.toggle("header-scrolled", window.scrollY > 50);
  }
  window.addEventListener("load", onHeaderScroll);
  document.addEventListener("scroll", onHeaderScroll);

  /**
   * Mobile nav toggle
   * Uses:
   *  - .mobile-nav-toggle icon
   *  - #navmenu element
   * Adds:
   *  - navmenu.show
   *  - mobile icon switches bi-list <-> bi-x
   */
  const nav = $("#navmenu");
  const mobileToggle = $(".mobile-nav-toggle");

  function closeMobileNav() {
    if (!nav) return;
    nav.classList.remove("show");
    if (mobileToggle) {
      mobileToggle.classList.add("bi-list");
      mobileToggle.classList.remove("bi-x");
    }
  }

  function toggleMobileNav() {
    if (!nav || !mobileToggle) return;

    nav.classList.toggle("show");
    mobileToggle.classList.toggle("bi-list");
    mobileToggle.classList.toggle("bi-x");
  }

  if (mobileToggle && nav) {
    mobileToggle.addEventListener("click", toggleMobileNav);

    // close menu on link click
    $$("#navmenu a").forEach((a) => {
      a.addEventListener("click", () => closeMobileNav());
    });

    // close menu if user clicks outside nav (optional)
    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("show")) return;
      const clickedInsideNav = nav.contains(e.target);
      const clickedToggle = mobileToggle.contains(e.target);
      if (!clickedInsideNav && !clickedToggle) closeMobileNav();
    });
  }

  /**
   * Preloader
   */
  const preloader = $("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTopBtn = $(".scroll-top");

  function toggleScrollTop() {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle("active", window.scrollY > 100);
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop);
  }

  /**
   * AOS init
   */
  function aosInit() {
    if (typeof AOS === "undefined") return;
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Typed.js init
   */
  const typedEl = $(".typed");
  if (typedEl && typeof Typed !== "undefined") {
    let typedStrings = typedEl.getAttribute("data-typed-items") || "";
    typedStrings = typedStrings
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (typedStrings.length) {
      new Typed(".typed", {
        strings: typedStrings,
        loop: true,
        typeSpeed: 70,
        backSpeed: 35,
        backDelay: 1800,
      });
    }
  }

  /**
   * PureCounter init
   */
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }

  /**
   * Skills progress animation (Waypoint)
   * Only runs if .skills-animation exists and Waypoint is loaded
   */
  const skillsBlocks = $$(".skills-animation");
  if (skillsBlocks.length && typeof Waypoint !== "undefined") {
    skillsBlocks.forEach((block) => {
      new Waypoint({
        element: block,
        offset: "80%",
        handler: function () {
          const bars = $$(".progress .progress-bar", block);
          bars.forEach((bar) => {
            const val = bar.getAttribute("aria-valuenow") || "0";
            bar.style.width = `${val}%`;
          });
        },
      });
    });
  }

  /**
   * GLightbox init (optional)
   * You removed preview screenshots mostly, but this keeps it safe.
   */
  if (typeof GLightbox !== "undefined" && $(".glightbox")) {
    GLightbox({ selector: ".glightbox" });
  }

  /**
   * Isotope init (optional)
   * Your current portfolio markup still contains "isotope-container".
   * But you DO NOT have filters now.
   * We'll only init if the required libs + elements exist.
   */
  const isoContainer = $(".isotope-container");
  if (
    isoContainer &&
    typeof Isotope !== "undefined" &&
    typeof imagesLoaded !== "undefined"
  ) {
    imagesLoaded(isoContainer, function () {
      new Isotope(isoContainer, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });
      // re-run AOS after layout
      aosInit();
    });
  }

  /**
   * Swiper init (testimonials)
   */
  function initSwiper() {
    if (typeof Swiper === "undefined") return;

    $$(".init-swiper").forEach((swiperEl) => {
      const cfgEl = $(".swiper-config", swiperEl);
      if (!cfgEl) return;

      let config = {};
      try {
        config = JSON.parse(cfgEl.textContent.trim());
      } catch (e) {
        console.warn("Invalid swiper config JSON:", e);
        return;
      }

      new Swiper(swiperEl, config);
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Scrollspy (active nav link)
   */
  const navLinks = $$(".navmenu a");
  function navmenuScrollspy() {
    const pos = window.scrollY + 120;

    navLinks.forEach((link) => {
      if (!link.hash) return;
      const section = $(link.hash);
      if (!section) return;

      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (pos >= top && pos <= bottom) {
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);

  /**
   * Correct scroll position for hash on page load (optional)
   */
  window.addEventListener("load", function () {
    if (!window.location.hash) return;
    const target = $(window.location.hash);
    if (!target) return;

    setTimeout(() => {
      const headerHeight = header ? header.offsetHeight : 0;
      window.scrollTo({
        top: target.offsetTop - headerHeight,
        behavior: "smooth",
      });
    }, 80);
  });
})();
