/* =========================================================
   DIGITAL BOSS — PREMIUM PORTFOLIO
   Main JavaScript
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     01. ELEMENT SELECTORS
  ======================================================= */

  const body = document.body;

  const pageLoader = document.getElementById("pageLoader");

  const menuToggle = document.getElementById("menuToggle");

  const navMenu = document.getElementById("navMenu");

  const navLinks = document.querySelectorAll(".nav-link");

  const sections = document.querySelectorAll("main section[id]");

  const currentYear = document.getElementById("currentYear");

  const identitySection = document.querySelector(".identity-section");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =======================================================
     02. PAGE LOADER
  ======================================================= */

  function hidePageLoader() {
    if (!pageLoader) return;

    pageLoader.classList.add("loader-hidden");

    // Remove the loader after its exit animation.
    window.setTimeout(() => {
      if (pageLoader && pageLoader.parentNode) {
        pageLoader.remove();
      }
    }, 800);
  }

  // Hide loader after the page has fully loaded.
  if (document.readyState === "complete") {
    hidePageLoader();
  } else {
    window.addEventListener("load", hidePageLoader, {
      once: true
    });
  }

  // Safety fallback in case an external resource takes too long.
  window.setTimeout(hidePageLoader, 3000);


  /* =======================================================
     03. AUTOMATIC COPYRIGHT YEAR
  ======================================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =======================================================
     04. MOBILE NAVIGATION
  ======================================================= */

  function openMenu() {
    if (!menuToggle || !navMenu) return;

    menuToggle.classList.add("active");
    navMenu.classList.add("nav-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");

    body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    menuToggle.classList.remove("active");
    navMenu.classList.remove("nav-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    body.classList.remove("menu-open");
  }

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("nav-open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu after clicking a navigation link.
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu when clicking outside it.
    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navMenu.contains(event.target);

      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    // Close menu with Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close mobile menu when returning to desktop layout.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }


  /* =======================================================
     05. SCROLL REVEAL ANIMATIONS
  ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    // Fallback for older browsers or reduced-motion users.
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* =======================================================
     06. ACTIVE NAVIGATION ON SCROLL
  ======================================================= */

  function setActiveNavigation() {

    if (!sections.length || !navLinks.length) return;

    const scrollPosition = window.scrollY + 150;

    let currentSection = "";

    sections.forEach((section) => {

      const sectionTop = section.offsetTop;

      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }

    });

    navLinks.forEach((link) => {

      const target = link.getAttribute("href");

      link.classList.toggle(
        "active",
        target === `#${currentSection}` && currentSection !== ""
      );

    });
  }

  let scrollTicking = false;

  window.addEventListener(
    "scroll",
    () => {

      if (scrollTicking) return;

      scrollTicking = true;

      window.requestAnimationFrame(() => {
        setActiveNavigation();
        scrollTicking = false;
      });

    },
    { passive: true }
  );

  // Set initial active link.
  setActiveNavigation();


  /* =======================================================
     07. INTERACTIVE GOLDEN AMBIENT LIGHT
  ======================================================= */

  if (
    identitySection &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !prefersReducedMotion
  ) {

    identitySection.addEventListener("pointermove", (event) => {

      const rect = identitySection.getBoundingClientRect();

      const x = event.clientX - rect.left;

      const y = event.clientY - rect.top;

      identitySection.style.setProperty("--light-x", `${x}px`);

      identitySection.style.setProperty("--light-y", `${y}px`);

    });

    identitySection.addEventListener("pointerleave", () => {

      identitySection.style.setProperty("--light-x", "50%");

      identitySection.style.setProperty("--light-y", "50%");

    });

  }


  /* =======================================================
     08. SMOOTH INTERNAL NAVIGATION
  ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      // Ignore empty or invalid hash links.
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      // Update the browser URL without a page reload.
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", targetId);
      }

    });

  });


  /* =======================================================
     09. PORTRAIT IMAGE FALLBACK
  ======================================================= */

  const portraitImage = document.querySelector(".portrait-image");

  if (portraitImage) {

    portraitImage.addEventListener("error", () => {

      console.warn(
        "Digital Boss portrait could not be loaded. Check the image filename and assets folder."
      );

      portraitImage.style.opacity = "0.25";

      portraitImage.alt = "Portrait image unavailable. Check the image file path.";

    });

  }


  /* =======================================================
     10. CONTACT LINK PROTECTION
  ======================================================= */

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {

    link.setAttribute("rel", "noopener noreferrer");

  });


  /* =======================================================
     11. OPTIONAL BACK-TO-TOP BUTTON
  ======================================================= */

  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {

    backToTop.addEventListener("click", (event) => {

      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });

    });

  }


  /* =======================================================
     12. INITIAL PAGE STATE
  ======================================================= */

  body.classList.add("page-ready");

  console.log(
    "%c DIGITAL BOSS ",
    "background: #c9a96e; color: #090909; padding: 8px 14px; font-weight: bold;"
  );

  console.log(
    "%cPortfolio successfully initialized.",
    "color: #c9a96e; font-size: 12px;"
  );

});