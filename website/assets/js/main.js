/* BODYSHIFT Landingpage – Interaktion
   Alles, was beim Livegang angepasst wird, steht in CONFIG. */
(function () {
  'use strict';

  var CONFIG = {
    // Ziel für beide Anfrageformulare, z. B. ein LeadConnector "Inbound Webhook".
    // Der Workflow dahinter legt den Kontakt an und schickt euch die Benachrichtigungs-Mail.
    // Leer = Entwurfsmodus: das Formular wird geprüft, aber nicht gesendet.
    formEndpoint: '',

    // Online-Kalender für die Kennenlernbehandlung Abnehmen im Liegen (LeadConnector Booking-Widget).
    // Beckenboden hat keinen Kalender: Anfrage läuft über das Formular.
    calendars: {
      feldbach: 'https://api.leadconnectorhq.com/widget/booking/CJGUjD8shK6GGZnHJy6u',
      leibnitz: 'https://api.leadconnectorhq.com/widget/booking/osIkAlX2LzfnaMBLq56A'
    },
    locations: {
      feldbach: { name: 'Feldbach', phone: '+43 676 30 73 860' },
      leibnitz: { name: 'Leibnitz', phone: '+43 676 63 00 655' }
    },

    // Tracking wird nur nach Zustimmung geladen. Leer = kein Tracking, kein Cookie-Hinweis.
    tracking: { ga4: '', metaPixel: '' }
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }

  /* Farbwelt zum Vergleichen: ?farbe=lila */
  try {
    if (new URLSearchParams(location.search).get('farbe') === 'lila') document.documentElement.setAttribute('data-palette', 'lila');
  } catch (e) {}

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

  /* Mobile Leiste: immer sichtbar, außer ein Formular oder der Kalender ist im Bild */
  var bar = $('#mobile-bar');
  var watch = $all('#anfrage, #kontakt, #termin');
  if (bar && 'IntersectionObserver' in window && watch.length) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var any = Object.keys(visible).some(function (k) { return visible[k]; });
      bar.classList.toggle('show', !any);
    }, { threshold: 0.1 });
    watch.forEach(function (el) { io.observe(el); });
  } else if (bar) { bar.classList.add('show'); }

  /* Links mit data-interest wählen im Zielformular die Behandlung vor */
  function setInterest(form, value) {
    if (!form || !value) return;
    $all('input[name="interest"]', form).forEach(function (r) { r.checked = (r.value === value); });
  }
  $all('[data-interest]').forEach(function (a) {
    a.addEventListener('click', function () {
      var target = $(a.getAttribute('href'));
      var form = target && (target.matches('form') ? target : $('form', target));
      setInterest(form, a.getAttribute('data-interest'));
    });
  });

  /* ---------- Online-Kalender (nur Abnehmen im Liegen) ---------- */
  var booking = $('#booking'), cal = $('#cal'), calBody = $('#cal-body'), calTitle = $('#cal-title');
  var embedScriptLoaded = false;
  if (booking) {
    $all('.loc-btn', booking).forEach(function (btn) {
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        var key = btn.getAttribute('data-loc');
        var loc = CONFIG.locations[key], url = CONFIG.calendars[key];
        $all('.loc-btn', booking).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        calTitle.textContent = 'Kennenlernbehandlung in ' + loc.name;
        calBody.innerHTML = '';
        var f = document.createElement('iframe');
        f.src = url;
        f.title = 'Online-Terminbuchung ' + loc.name;
        f.loading = 'lazy';
        f.setAttribute('scrolling', 'no');
        f.id = 'cal-' + key;
        calBody.appendChild(f);
        if (!embedScriptLoaded) {
          var s = document.createElement('script');
          s.src = 'https://link.msgsndr.com/js/form_embed.js'; // Höhenanpassung des Widgets
          s.async = true;
          document.body.appendChild(s);
          embedScriptLoaded = true;
        }
        cal.hidden = false;
        cal.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---------- Anfrageformulare ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function mark(el, bad) {
    el.classList.toggle('invalid', bad);
    el.setAttribute('aria-invalid', bad ? 'true' : 'false');
  }

  $all('form.lead-form').forEach(function (form) {
    var status = $('.form-status', form);
    var btn = $('button[type="submit"]', form);
    var btnLabel = btn.textContent;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      status.className = 'form-status'; status.textContent = '';
      var firstBad = null;

      ['name', 'phone', 'email'].forEach(function (n) {
        var el = form.elements[n]; if (!el) return;
        var v = el.value.trim();
        var bad = !v || (n === 'email' && !EMAIL_RE.test(v)) || (n === 'phone' && v.replace(/\D/g, '').length < 6);
        mark(el, bad);
        if (bad && !firstBad) firstBad = el;
      });
      var locChecked = $('input[name="location"]:checked', form);
      var locSet = $('input[name="location"]', form).closest('fieldset');
      locSet.classList.toggle('invalid-group', !locChecked);

      if (!locChecked) { status.className = 'form-status err'; status.textContent = 'Bitte wähle dein Studio.'; $('input[name="location"]', form).focus(); return; }
      if (firstBad) { status.className = 'form-status err'; status.textContent = 'Bitte prüfe Name, Telefon und E-Mail.'; firstBad.focus(); return; }
      var consent = form.elements.consent;
      if (!consent.checked) { status.className = 'form-status err'; status.textContent = 'Bitte bestätige noch die Einwilligung.'; consent.focus(); return; }
      if (form.elements.website && form.elements.website.value) return; // Spam-Falle

      var data = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        location: locChecked.value,
        interest: (($('input[name="interest"]:checked', form)) || {}).value || '',
        message: form.elements.message ? form.elements.message.value.trim() : '',
        source: 'website-' + (form.getAttribute('data-source') || 'formular'),
        page: location.href.split('#')[0],
        consent: true,
        submittedAt: new Date().toISOString()
      };

      if (!CONFIG.formEndpoint) {
        status.className = 'form-status ok';
        status.textContent = 'Entwurf: Formular noch nicht verbunden. Die Eingaben sind gültig.';
        return;
      }
      btn.disabled = true; btn.textContent = 'Wird gesendet …';
      fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Danke, ' + data.name.split(' ')[0] + '! Wir rufen dich werktags innerhalb von 24 Stunden an.';
          if (window.fbq) window.fbq('track', 'Lead', { content_name: data.interest });
          if (window.gtag) window.gtag('event', 'generate_lead', { interest: data.interest, location: data.location });
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Das hat leider nicht geklappt. Ruf uns bitte an: +43 676 38 06 222.';
        })
        .then(function () { btn.disabled = false; btn.textContent = btnLabel; });
    });
  });

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
