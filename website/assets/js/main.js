/* BODYSHIFT Landingpage – Interaktion
   Alles, was beim Livegang angepasst wird, steht in CONFIG. */
(function () {
  'use strict';

  var CONFIG = {
    // Ziel für das Rückruf-Formular, z. B. ein LeadConnector "Inbound Webhook".
    // Leer = Entwurfsmodus: das Formular wird geprüft, aber nicht gesendet.
    formEndpoint: '',

    // Online-Kalender je Standort und Behandlung (LeadConnector Booking-Widget-URLs).
    // Leer = kein Online-Kalender, es erscheinen Telefon und Rückruf.
    calendars: {
      seiersberg: { abnehmen: 'https://api.leadconnectorhq.com/widget/booking/QadV4h7eBaDyY9vwwaCd', beckenboden: '' },
      feldbach:   { abnehmen: 'https://api.leadconnectorhq.com/widget/booking/CJGUjD8shK6GGZnHJy6u', beckenboden: '' },
      leibnitz:   { abnehmen: 'https://api.leadconnectorhq.com/widget/booking/osIkAlX2LzfnaMBLq56A', beckenboden: '' }
    },
    locations: {
      seiersberg: { name: 'Graz-Seiersberg', phone: '+43 676 78 33 350' },
      feldbach:   { name: 'Feldbach',        phone: '+43 676 30 73 860' },
      leibnitz:   { name: 'Leibnitz',        phone: '+43 676 63 00 655' }
    },

    // Tracking wird nur nach Zustimmung geladen. Leer = kein Tracking, kein Cookie-Hinweis.
    tracking: { ga4: '', metaPixel: '' }
  };

  var TREATMENT_LABEL = { abnehmen: 'Abnehmen im Liegen', beckenboden: 'Beckenboden mit BetterPelvi' };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }

  /* Farbwelt zum Vergleichen: ?farbe=lila */
  try {
    var farbe = new URLSearchParams(location.search).get('farbe');
    if (farbe === 'lila') document.documentElement.setAttribute('data-palette', 'lila');
  } catch (e) {}

  /* Jahr im Footer */
  var y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());

  /* Navigation mobil */
  var toggle = $('#nav-toggle'), nav = $('#nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $all('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* Mobile Buchungsleiste erst nach dem Hero zeigen, im Buchungsbereich ausblenden */
  var bar = $('#mobile-bar'), hero = $('.hero'), bookingSection = $('#buchen'), contact = $('#kontakt');
  if (bar && hero && 'IntersectionObserver' in window) {
    var heroVisible = true, bookingVisible = false;
    var update = function () { bar.classList.toggle('show', !heroVisible && !bookingVisible); };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(hero);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.target === bookingSection || en.target === contact) en.target._vis = en.isIntersecting; });
      bookingVisible = !!(bookingSection && bookingSection._vis) || !!(contact && contact._vis);
      update();
    }, { threshold: 0.15 });
    if (bookingSection) io.observe(bookingSection);
    if (contact) io.observe(contact);
  } else if (bar) { bar.classList.add('show'); }

  /* ---------- Buchung ---------- */
  var booking = $('#booking');
  var cal = $('#cal'), calBody = $('#cal-body'), calTitle = $('#cal-title');
  var state = { treatment: 'abnehmen', loc: null };
  var embedScriptLoaded = false;

  function currentTreatment() {
    var r = $('input[name="treatment"]:checked');
    return r ? r.value : 'abnehmen';
  }

  function render() {
    if (!state.loc) { cal.hidden = true; return; }
    var url = (CONFIG.calendars[state.loc] || {})[state.treatment];
    var loc = CONFIG.locations[state.loc];
    calTitle.textContent = TREATMENT_LABEL[state.treatment] + ' in ' + loc.name;
    calBody.innerHTML = '';
    if (url) {
      var f = document.createElement('iframe');
      f.src = url;
      f.title = 'Online-Terminbuchung ' + loc.name;
      f.loading = 'lazy';
      f.setAttribute('scrolling', 'no');
      f.id = 'cal-' + state.loc + '-' + state.treatment;
      calBody.appendChild(f);
      if (!embedScriptLoaded) {
        // Höhenanpassung des LeadConnector-Widgets
        var s = document.createElement('script');
        s.src = 'https://link.msgsndr.com/js/form_embed.js';
        s.async = true;
        document.body.appendChild(s);
        embedScriptLoaded = true;
      }
    } else {
      var tel = loc.phone.replace(/\s/g, '');
      calBody.innerHTML =
        '<div class="cal-fallback">' +
          '<p>Für ' + TREATMENT_LABEL[state.treatment] + ' in ' + loc.name + ' vereinbaren wir den Termin persönlich mit dir.</p>' +
          '<div class="cta-row">' +
            '<a class="btn btn-primary" href="tel:' + tel + '">Anrufen: ' + loc.phone + '</a>' +
            '<a class="btn btn-outline" href="#kontakt" data-prefill="1">Rückruf anfordern</a>' +
          '</div>' +
        '</div>';
      var pre = $('[data-prefill]', calBody);
      if (pre) pre.addEventListener('click', function () { prefillContact(state.treatment, loc.name); });
    }
    cal.hidden = false;
  }

  if (booking) {
    $all('input[name="treatment"]', booking).forEach(function (r) {
      r.addEventListener('change', function () { state.treatment = currentTreatment(); render(); });
    });
    $all('.loc-btn', booking).forEach(function (btn) {
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        state.loc = btn.getAttribute('data-loc');
        state.treatment = currentTreatment();
        $all('.loc-btn', booking).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        store('bs-loc', state.loc);
        render();
        cal.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* Buttons mit data-book wählen die Behandlung vor */
  $all('[data-book]').forEach(function (a) {
    a.addEventListener('click', function () {
      var t = a.getAttribute('data-book');
      var radio = $('#t-' + t);
      if (radio) { radio.checked = true; state.treatment = t; if (state.loc) render(); }
    });
  });

  /* ---------- Kontaktformular ---------- */
  function prefillContact(treatment, locName) {
    var map = { abnehmen: '#i-abnehmen', beckenboden: '#i-beckenboden' };
    var r = $(map[treatment] || '#i-abnehmen'); if (r) r.checked = true;
    var sel = $('#f-location');
    if (sel && locName) { $all('option', sel).forEach(function (o) { if (o.textContent === locName) sel.value = o.textContent; }); }
  }
  $all('[data-interest]').forEach(function (a) {
    a.addEventListener('click', function () { prefillContact(a.getAttribute('data-interest')); });
  });

  var form = $('#contact-form'), status = $('#form-status');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      status.className = 'form-status'; status.textContent = '';
      var required = ['#f-name', '#f-phone', '#f-location'];
      var firstBad = null;
      required.forEach(function (id) {
        var el = $(id); var bad = !el.value.trim();
        el.classList.toggle('invalid', bad); el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && !firstBad) firstBad = el;
      });
      var email = $('#f-email');
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.classList.add('invalid'); firstBad = firstBad || email; }
      else email.classList.remove('invalid');
      var consent = $('#f-consent');
      if (firstBad) { status.className = 'form-status err'; status.textContent = 'Bitte fülle Name, Telefon und Standort aus.'; firstBad.focus(); return; }
      if (!consent.checked) { status.className = 'form-status err'; status.textContent = 'Bitte bestätige noch die Datenschutz-Einwilligung.'; consent.focus(); return; }
      if ($('#f-website').value) return; // Spam-Falle

      var data = {
        name: $('#f-name').value.trim(),
        phone: $('#f-phone').value.trim(),
        email: email.value.trim(),
        location: $('#f-location').value,
        interest: ($('input[name="interest"]:checked') || {}).value || '',
        message: $('#f-msg').value.trim(),
        source: 'website-landingpage',
        consent: true,
        submittedAt: new Date().toISOString()
      };

      if (!CONFIG.formEndpoint) {
        status.className = 'form-status ok';
        status.textContent = 'Entwurf: Das Formular ist noch nicht mit dem CRM verbunden. Eingaben sind gültig.';
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Wird gesendet …';
      fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Danke! Wir rufen dich innerhalb eines Werktags zurück.';
          if (window.fbq) window.fbq('track', 'Lead');
          if (window.gtag) window.gtag('event', 'generate_lead');
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Das hat leider nicht geklappt. Ruf uns bitte an: +43 676 38 06 222.';
        })
        .then(function () { btn.disabled = false; btn.textContent = 'Rückruf anfordern'; });
    });
  }

  /* ---------- Einwilligung & Tracking ---------- */
  var hasTracking = !!(CONFIG.tracking.ga4 || CONFIG.tracking.metaPixel);
  var banner = $('#consent-banner'), settingsBtn = $('#cookie-settings');

  function loadTracking() {
    if (CONFIG.tracking.ga4) {
      var g = document.createElement('script');
      g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.tracking.ga4;
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', CONFIG.tracking.ga4, { anonymize_ip: true });
    }
    if (CONFIG.tracking.metaPixel) {
      /* Meta Pixel Basis-Code */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', CONFIG.tracking.metaPixel);
      window.fbq('track', 'PageView');
    }
  }

  if (hasTracking && banner) {
    if (settingsBtn) { settingsBtn.hidden = false; settingsBtn.addEventListener('click', function () { banner.hidden = false; }); }
    var choice = store('bs-consent');
    if (choice === 'all') loadTracking();
    else if (choice !== 'necessary') banner.hidden = false;
    $('#consent-accept').addEventListener('click', function () { store('bs-consent', 'all'); banner.hidden = true; loadTracking(); });
    $('#consent-deny').addEventListener('click', function () { store('bs-consent', 'necessary'); banner.hidden = true; });
  }
})();
