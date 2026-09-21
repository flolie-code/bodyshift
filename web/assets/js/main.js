/* =========================================================
   BODYSHIFT — Frontend-Interaktionen
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Sticky-Nav Schatten beim Scrollen ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile-Menu ---------- */
  const burger = document.getElementById("burger");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("is-open"))
    );
  }

  /* ---------- FAQ-Accordion ---------- */
  document.querySelectorAll(".faq__item").forEach((item) => {
    const q = item.querySelector(".faq__q");
    const a = item.querySelector(".faq__a");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", isOpen ? "true" : "false");
      a.style.maxHeight = isOpen ? a.scrollHeight + "px" : "0";
    });
  });

  /* ---------- Vorher/Nachher-Slider ---------- */
  document.querySelectorAll("[data-ba]").forEach((el) => {
    const before = el.querySelector(".ba__before");
    const handle = el.querySelector(".ba__handle");
    if (!before || !handle) return;

    const set = (pct) => {
      const clamped = Math.max(0, Math.min(100, pct));
      before.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      handle.style.left = clamped + "%";
    };
    set(50);

    let active = false;
    const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);
    const move = (e) => {
      if (!active) return;
      const rect = el.getBoundingClientRect();
      const pct = ((getX(e) - rect.left) / rect.width) * 100;
      set(pct);
    };
    const start = (e) => { active = true; move(e); };
    const end = () => { active = false; };

    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);
  });

  /* ---------- Reveal-on-scroll ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Formular ---------- */
  const form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // simple HTML5-Validierung
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      /* ==== HIER Backend-Integration einbauen ====
         Beispiel — Zapier / Make Webhook:
         fetch("https://hooks.zapier.com/DEIN-HOOK", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(Object.fromEntries(new FormData(form)))
         });
      ============================================= */

      form.classList.add("is-sent");
      window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
    });
  }

  /* ---------- Jahr im Footer ---------- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
