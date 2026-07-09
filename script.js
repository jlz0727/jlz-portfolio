/* =========================================================
   PORTFOLIO — main interactions
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Scroll to top on refresh ---------- */
  window.scrollTo(0, 0);

  /* ---------- Mobile nav ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Smooth scroll with offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Force download for resume PDF ---------- */
  document.querySelector('a[download="Zambrano_Resume.pdf"]').addEventListener('click', function (e) {
    e.preventDefault();
    var link = this;
    fetch(link.href).then(function (res) { return res.blob(); }).then(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = link.getAttribute('download');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });

  /* ---------- Scroll-driven reveal — RAF + lerp, batch-read before write ---------- */
  (function () {
    var reveals = [];
    var ticking = false;

    /* Pre-alloc work arrays — avoids GC pressure in hot loop */
    var metrics = [];

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      reveals.push(el);
    });

    function calcProgress(rect, viewH) {
      var visible = Math.min(rect.bottom, viewH) - Math.max(rect.top, 0);
      return Math.max(0, Math.min(1, visible / rect.height));
    }

    function apply(el, p) {
      p = Math.max(0, Math.min(1, p));

      var ep = 1 - Math.pow(1 - p, 2);

      var translateY = (1 - ep) * 50;
      var opacity    = ep;
      var blur       = (1 - ep) * 6;
      var scale      = 1 - (1 - ep) * 0.06;

      el.style.transform = 'translateY(' + translateY + 'px) scale(' + scale + ') translateZ(0)';
      el.style.opacity = opacity;
      el.style.filter  = 'blur(' + blur + 'px)';
    }

    function update() {
      var viewH = window.innerHeight;

      /* ── PHASE 1: READ (getBoundingClientRect) — no writes interleaved ── */
      metrics.length = 0;
      reveals.forEach(function (el) {
        if (el.classList.contains('reveal-stagger')) {
          [].forEach.call(el.children, function (child, i) {
            var rect = child.getBoundingClientRect();
            var raw  = calcProgress(rect, viewH);
            /* Stagger offset — each child gets a shifted progress lane */
            var shifted = Math.max(0, Math.min(1, (raw - i * 0.07) / (1 - i * 0.07)));
            metrics.push({ el: child, p: shifted });
          });
        } else {
          var rect = el.getBoundingClientRect();
          var p = calcProgress(rect, viewH);
          metrics.push({ el: el, p: p });
        }
      });

      /* ── PHASE 2: LERP — smooth each value toward target for floaty feel ── */
      for (var i = 0; i < metrics.length; i++) {
        var m = metrics[i];
        if (m.el._smoothP === undefined) m.el._smoothP = m.p;
        /* Snap to exact when fully visible or fully hidden — prevents
           blur / offset lingering when scrolling fast through the page */
        if (m.p >= 1 || m.p <= 0) {
          m.el._smoothP = m.p;
        } else {
          m.el._smoothP += (m.p - m.el._smoothP) * 0.08;
          if (Math.abs(m.p - m.el._smoothP) < 0.001) m.el._smoothP = m.p;
        }
      }

      /* ── PHASE 3: WRITE — all style mutations batched ── */
      for (var j = 0; j < metrics.length; j++) {
        apply(metrics[j].el, metrics[j].el._smoothP);
      }

      ticking = false;
    }

    /* Run immediately so elements already in view get correct styles */
    requestAnimationFrame(update);

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      requestAnimationFrame(update);
    }, { passive: true });
  }());

  /* ---------- Loader — logo zooms from centre into the nav bar ---------- */
  (function () {
    var loader = document.getElementById('loader');
    var logo = loader && loader.querySelector('.loader-logo');
    var navLogo = document.querySelector('.brand-logo');
    if (!loader || !logo || !navLogo) return;

    /* Hide the nav logo immediately — it will reappear only after the
       loader logo has flown into position and fully vanished, so the
       viewer never sees both logos at once and alignment is irrelevant. */
    navLogo.style.visibility = 'hidden';

    var startTime = null;
    var delay = 800;
    var duration = 2000;
    var dx, dy, scaleEnd;
    /*
      The nav logo is hidden during the entire animation.  The loader logo
      flies from centre to the nav-bar area and fades out.  Only after it
      has fully vanished (and the loader is removed from the DOM) does the
      nav logo become visible in its natural position — the viewer never
      sees both logos at once, so pixel-perfect alignment isn't needed.

      Logo stays fully opaque for the first 60 % so the flight path is
      clearly visible; background alpha fades early so page content and
      the nav bar emerge beneath the flying logo.
    */

    function frame(ts) {
      if (startTime === null) {
        startTime = ts;

        logo.style.transform = 'translate(0, 0) scale(1)';
        logo.style.opacity = '1';
        loader.style.backgroundColor = 'rgba(11, 12, 14, 1)';

        /* Force layout so getBoundingClientRect reflects the inline
           transform we just set. */
        logo.offsetHeight;

        var logoRect = logo.getBoundingClientRect();
        var navRect  = navLogo.getBoundingClientRect();
        dx = navRect.left - logoRect.left;
        dy = navRect.top  - logoRect.top;
        scaleEnd = navRect.width / logoRect.width;
      }

      var elapsed = ts - startTime;
      if (elapsed < delay) {
        requestAnimationFrame(frame);
        return;
      }

      var p = Math.min(1, (elapsed - delay) / duration);
      var ep = 1 - Math.pow(1 - p, 4);       // ease-out quart

      /* ── TRANSFORM — top-left corner interpolates linearly, scale too ── */
      var x = dx * ep;
      var y = dy * ep;
      var s = 1 + (scaleEnd - 1) * ep;
      logo.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + s + ')';

      /* ── BACKGROUND — alpha fades so page / nav logo show through early ── */
      var bgAlpha = Math.max(0, 1 - ep * 1.5);
      loader.style.backgroundColor = 'rgba(11, 12, 14, ' + bgAlpha + ')';

      /* ── LOGO OPACITY — fully opaque for first 60 %, then fade ── */
      var logoAlpha = p < 0.6 ? 1 : 1 - (p - 0.6) / 0.4;
      logo.style.opacity = logoAlpha;

      /* Reveal nav logo while the loader logo is still partially visible,
         creating a seamless cross-fade hand-off. */
      if (p >= 0.8 && navLogo.style.visibility !== 'visible') {
        navLogo.style.visibility = 'visible';
      }

      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        loader.style.display = 'none';
        navLogo.style.visibility = 'visible';
        window.dispatchEvent(new Event('scroll'));
      }
    }

    requestAnimationFrame(frame);

    setTimeout(function () {
      if (loader.style.display !== 'none') {
        loader.style.display = 'none';
        navLogo.style.visibility = 'visible';
        window.dispatchEvent(new Event('scroll'));
      }
    }, delay + duration + 1000);
  }());

  /* ---------- Nav scroll state + active section highlighting ---------- */
  var nav = document.getElementById('nav');
  var navLinkEls = document.querySelectorAll('.nav-link');
  var sections = ['about','interests','certifications','projects','contact','assistant']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function onScroll() {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    var scrollPos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinkEls.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Info-chip slide-reveal (click to expand) ----------
     Clears inline width so the .open class's `width: auto` takes
     effect, forces a reflow, then captures the exact border-box
     width via getBoundingClientRect so the full text is visible
     without clipping (the old scrollWidth approach could be off
     by 1–2 px due to borders / subpixel rounding).                */
  document.querySelectorAll('.info-chip[data-reveal]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      if (chip.classList.contains('open')) {
        chip.classList.remove('open');
        chip.style.width = '40px';
      } else {
        chip.style.width = '';
        chip.classList.add('open');
        chip.offsetHeight;
        chip.style.width = chip.getBoundingClientRect().width + 'px';
      }
    });
  });

  /* ---------- Brand logo toggle (compact → show full name) ---------- */
  var brand = document.querySelector('.brand');
  if (brand) {
    brand.addEventListener('click', function () {
      var text = this.querySelector('.brand-text');
      if (this.classList.contains('is-open')) {
        this.classList.remove('is-open');
        text.style.width = '0';
      } else {
        text.style.width = '';
        this.classList.add('is-open');
        text.offsetHeight;
        text.style.width = text.getBoundingClientRect().width + 'px';
      }
    });
  }

  /* ---------- Scheduling modal ---------- */
  var modal        = document.getElementById('modal');
  var modalTitle   = document.getElementById('modalTitle');
  var modalSub     = document.getElementById('modalSub');
  var msgLabel     = document.getElementById('msgLabel');
  var modalClose   = document.getElementById('modalClose');
  var scheduleForm = document.getElementById('scheduleForm');
  var formStatus   = document.getElementById('formStatus');
  var modalSubmit  = document.getElementById('modalSubmit');
  var currentModalType = 'meeting';

  var MODAL_CONFIG = {
    meeting:   { title: 'Schedule a Meeting',    sub: "Tell me when works for you, and I'll confirm shortly.", msgLabel: "Anything you'd like to share?" },
    interview: { title: 'Schedule an Interview', sub: "Share the role and a time that works for you.", msgLabel: 'Role or position you\'re considering?' }
  };

  var gyroActive = false;
  var targetTiltX = 0, targetTiltY = 0;
  var currentTiltX = 0, currentTiltY = 0;
  var tiltRaf = null;

  function applyTilt() {
    var card = modal.querySelector('.modal-card');
    if (!card) return;
    currentTiltX += (targetTiltX - currentTiltX) * 0.12;
    currentTiltY += (targetTiltY - currentTiltY) * 0.12;
    card.style.transform = 'perspective(800px) rotateX(' + currentTiltX + 'deg) rotateY(' + currentTiltY + 'deg) scale3d(1.02,1.02,1.02)';
    if (Math.abs(targetTiltX - currentTiltX) > 0.01 || Math.abs(targetTiltY - currentTiltY) > 0.01) {
      tiltRaf = requestAnimationFrame(applyTilt);
    } else {
      tiltRaf = null;
    }
  }

  function tiltCard(e) {
    var card = modal.querySelector('.modal-card');
    if (!card || !modal.classList.contains('open')) return;
    var rect = card.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width;
    var y = (e.clientY - rect.top) / rect.height;
    targetTiltX = (y - 0.5) * -12;
    targetTiltY = (x - 0.5) * 12;
    if (!tiltRaf) tiltRaf = requestAnimationFrame(applyTilt);
  }
  function resetCardTilt() {
    targetTiltX = 0; targetTiltY = 0;
    if (!tiltRaf) tiltRaf = requestAnimationFrame(applyTilt);
  }

  function handleGyro(e) {
    if (!modal.classList.contains('open')) return;
    var beta = e.beta;
    var gamma = e.gamma;
    if (beta === null || gamma === null) return;
    var normBeta = Math.max(-45, Math.min(45, beta));
    var normGamma = Math.max(-45, Math.min(45, gamma));
    targetTiltX = (normBeta / 45) * -10;
    targetTiltY = (normGamma / 45) * 10;
    if (!tiltRaf) tiltRaf = requestAnimationFrame(applyTilt);
    gyroActive = true;
  }

  function openModal(type, btn) {
    var cfg = MODAL_CONFIG[type] || MODAL_CONFIG.meeting;
    currentModalType = type;
    modalTitle.textContent = cfg.title;
    modalSub.textContent   = cfg.sub;
    msgLabel.textContent   = cfg.msgLabel;
    formStatus.textContent = '';
    formStatus.className   = 'form-status';

    var card = modal.querySelector('.modal-card');
    if (btn && card) {
      var br = btn.getBoundingClientRect();
      var originX = ((br.left + br.width / 2) / window.innerWidth) * 100;
      var originY = ((br.top + br.height / 2) / window.innerHeight) * 100;
      card.style.transformOrigin = originX + '% ' + originY + '%';
      card.style.transform = 'scale(0)';
      card.style.opacity = '0';
      void card.offsetHeight;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      card.style.transform = '';
      card.style.opacity = '';
    } else {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
    try {
      if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission().then(function (state) {
            if (state === 'granted') window.addEventListener('deviceorientation', handleGyro);
          }).catch(function () {});
        } else {
          window.addEventListener('deviceorientation', handleGyro);
        }
      }
    } catch (e) {}
    modal.addEventListener('mousemove', tiltCard);
    modal.addEventListener('mouseleave', resetCardTilt);
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    window.removeEventListener('deviceorientation', handleGyro);
    modal.removeEventListener('mousemove', tiltCard);
    modal.removeEventListener('mouseleave', resetCardTilt);
    resetCardTilt();
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(btn.getAttribute('data-modal'), btn); });
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  if (scheduleForm) {
    scheduleForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (window.handleScheduleSubmit) {
        window.handleScheduleSubmit({ type: currentModalType, form: scheduleForm, statusEl: formStatus, submitBtn: modalSubmit });
      } else {
        formStatus.textContent = 'Email service not configured yet.';
        formStatus.className = 'form-status error';
      }
    });
  }

  /* ---------- Certificate Lightbox (multi-image, with error handling) ---------- */
  var lightbox        = document.getElementById('lightbox');
  var lightboxFrame   = document.querySelector('.lightbox-frame');
  var lightboxImg     = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose  = document.getElementById('lightboxClose');
  var lightboxPrev   = document.getElementById('lightboxPrev');
  var lightboxNext   = document.getElementById('lightboxNext');
  var lightboxDots   = document.getElementById('lightboxDots');

  var currentImages  = [];
  var currentIndex   = 0;
  var currentCaption = '';
  var imageLoaded    = false;

  var ERROR_ICON_SVG = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
  var ERROR_HTML = '<div class="lightbox-error">' + ERROR_ICON_SVG +
    '<p>Certificate image not found.</p>' +
    '<p class="error-hint">Place the image file in the <code>assets/certificates/</code> folder with the correct filename.</p></div>';

  function showErrorState() {
    lightboxImg.style.display = 'none';
    var existing = lightboxFrame.querySelector('.lightbox-error');
    if (!existing) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = ERROR_HTML;
      lightboxFrame.insertBefore(wrapper.firstElementChild, lightboxImg);
    }
  }
  function hideErrorState() {
    var existing = lightboxFrame.querySelector('.lightbox-error');
    if (existing) existing.remove();
    lightboxImg.style.display = '';
  }

  function renderDots() {
    lightboxDots.innerHTML = '';
    currentImages.forEach(function (_, i) {
      var dot = document.createElement('span');
      dot.className = 'lb-dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', function () { goTo(i); });
      lightboxDots.appendChild(dot);
    });
    lightboxDots.style.display = currentImages.length > 1 ? 'flex' : 'none';
  }

  function goTo(index) {
    if (!currentImages.length) return;
    if (index < 0) index = currentImages.length - 1;
    if (index >= currentImages.length) index = 0;
    currentIndex = index;
    lightboxImg.style.opacity = '0';
    hideErrorState();
    setTimeout(function () {
      var label = currentCaption;
      if (currentImages.length > 1) label += '  \u00b7  Image ' + (currentIndex + 1) + ' of ' + currentImages.length;
      lightboxCaption.textContent = label;
      renderDots();
      imageLoaded = false;
      lightboxImg.onload = function () { imageLoaded = true; lightboxImg.style.opacity = '1'; };
      lightboxImg.onerror = function () { imageLoaded = false; showErrorState(); };
      lightboxImg.src = currentImages[currentIndex];
      setTimeout(function () {
        if (!imageLoaded && lightboxImg.style.display !== 'none') lightboxImg.style.opacity = '1';
      }, 300);
    }, 150);
  }

  function openLightbox(images, caption) {
    currentImages  = images.slice();
    currentIndex   = 0;
    currentCaption = caption || '';
    hideErrorState();
    lightboxImg.style.opacity = '1';
    var label = currentCaption;
    if (currentImages.length > 1) label += '  \u00b7  Image 1 of ' + currentImages.length;
    lightboxCaption.textContent = label;
    renderDots();
    imageLoaded = false;
    lightboxImg.onload = function () { imageLoaded = true; lightboxImg.style.opacity = '1'; };
    lightboxImg.onerror = function () { imageLoaded = false; showErrorState(); };
    lightboxImg.src = currentImages[0];
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    hideErrorState();
    setTimeout(function () { lightboxImg.src = ''; }, 300);
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.cert-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var raw = card.getAttribute('data-cert-images') || '[]';
      try {
        var images = JSON.parse(raw);
        if (!images.length) return;
        var nameEl = card.querySelector('.cert-name');
        var name = nameEl ? nameEl.textContent.replace(/\s+/g,' ').trim() : '';
        openLightbox(images, name);
      } catch (err) {
        console.warn('Invalid data-cert-images on', card, err);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); goTo(currentIndex - 1); });
  lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); goTo(currentIndex + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (previewOverlay.classList.contains('open')) closePreview();
      else if (lightbox.classList.contains('open')) closeLightbox();
      else if (modal.classList.contains('open')) closeModal();
    }
    if (lightbox.classList.contains('open')) {
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    }
  });

  /* ---------- Theme toggle ----------
     Toggle UI: unchecked shows a circle knob (sun-like) on the dark track;
     checked slides the knob right and removes the inset shadow (moon).
     We map: checked = dark theme, unchecked = light theme.            */
  var themeToggle = document.getElementById('themeToggle');
  var themeToggleMobile = document.querySelector('.theme-toggle-mobile');
  var logoEls = document.querySelectorAll('.loader-logo, .brand-logo, .assistant-logo');

  function applyTheme(theme) {
    document.documentElement.classList.add('smooth-theme');
    requestAnimationFrame(function () {
      document.documentElement.setAttribute('data-theme', theme);
      var isDark = theme === 'dark';
      if (themeToggle) themeToggle.checked = isDark;
      if (themeToggleMobile) themeToggleMobile.checked = isDark;
      /* Swap logo — dark uses white variant, light uses the other white variant */
      var logoSrc = isDark ? 'assets/JLZ-WHITELOGO.png' : 'assets/JLZ-BLACKLOGO.png';
      [].forEach.call(logoEls, function (img) { img.src = logoSrc; });
      try { localStorage.setItem('theme', theme); } catch (e) {}
      setTimeout(function () {
        document.documentElement.classList.remove('smooth-theme');
      }, 800);
    });
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  if (!savedTheme) savedTheme = 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('change', function () {
      applyTheme(themeToggle.checked ? 'dark' : 'light');
    });
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('change', function () {
      applyTheme(themeToggleMobile.checked ? 'dark' : 'light');
    });
  }

  /* ---------- Project Preview (iframe overlay) ---------- */
  var previewOverlay = document.getElementById('previewOverlay');
  var previewIframe   = document.getElementById('previewIframe');
  var previewClose    = document.getElementById('previewClose');
  var previewLoader   = document.getElementById('previewLoader');

  function showLoader() {
    if (previewLoader) previewLoader.classList.add('visible');
  }
  function hideLoader() {
    if (previewLoader) previewLoader.classList.remove('visible');
  }

  document.querySelectorAll('.project-card[data-preview]').forEach(function (card) {
    card.addEventListener('click', function () {
      var url = card.getAttribute('data-preview');
      if (!url) return;
      previewOverlay.classList.add('open');
      previewOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      showLoader();
      setTimeout(function () { previewIframe.src = url; }, 250);
    });
  });

  if (previewIframe) {
    previewIframe.addEventListener('load', hideLoader);
    previewIframe.addEventListener('error', hideLoader);
  }

  function closePreview() {
    previewOverlay.classList.remove('open');
    previewOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hideLoader();
    setTimeout(function () { previewIframe.src = ''; }, 700);
  }

  if (previewClose) previewClose.addEventListener('click', closePreview);
  if (previewOverlay) previewOverlay.addEventListener('click', function (e) {
    if (e.target === previewOverlay) closePreview();
  });

  /* ---------- Hero photo 3D mouse tilt ---------- */
  (function () {
    var img = document.querySelector('.hero-photo img');
    var wrap = img && img.parentElement;
    if (!img || !wrap) return;
    var max = 18;
    var imgRect = null;
    var curX = 0, curY = 0, tgtX = 0, tgtY = 0, raf = null;
    function cacheRect() {
      imgRect = img.getBoundingClientRect();
    }
    cacheRect();
    window.addEventListener('resize', cacheRect);
    function tick() {
      curX += (tgtX - curX) * 0.06;
      curY += (tgtY - curY) * 0.06;
      img.style.transform = 'rotateX(' + curX + 'deg) rotateY(' + curY + 'deg)';
      if (Math.abs(curX - tgtX) > 0.05 || Math.abs(curY - tgtY) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }
    function move(e) {
      if (!imgRect) return;
      if (e.clientX < imgRect.left || e.clientX > imgRect.right ||
          e.clientY < imgRect.top || e.clientY > imgRect.bottom) {
        tgtX = 0; tgtY = 0;
        if (!raf) raf = requestAnimationFrame(tick);
        return;
      }
      var x = ((e.clientX - imgRect.left) / imgRect.width - 0.5) * 2;
      var y = ((e.clientY - imgRect.top) / imgRect.height - 0.5) * 2;
      tgtX = -y * max;
      tgtY = x * max;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function leave() {
      tgtX = 0; tgtY = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    wrap.addEventListener('mousemove', move);
    wrap.addEventListener('mouseleave', leave);
  })();

  /* ---------- Hero typewriter (silky) ---------- */
  (function () {
    var el = document.getElementById('typingText');
    var cursor = document.getElementById('typingCursor');
    if (!el || !cursor) return;
    var text = 'Hi, I am John Lord G. Zambrano.';
    var i = 0;
    var blinkOn = true;
    setInterval(function () {
      blinkOn = !blinkOn;
      cursor.style.opacity = blinkOn ? '1' : '0';
    }, 500);
    function delay() {
      var ch = text.charAt(i);
      if (ch === ',' || ch === '.') return 200;
      if (ch === ' ') return 30;
      return 40 + Math.random() * 70;
    }
    function addChar() {
      var span = document.createElement('span');
      span.className = 'typing-char';
      span.textContent = text.charAt(i);
      el.appendChild(span);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          span.style.animation = 'char-in 0.15s ease forwards';
        });
      });
      i++;
    }
    function frame(ts) {
      if (i >= text.length) return;
      var d = delay();
      var start = ts;
      function wait(now) {
        if (now - start >= d) {
          addChar();
          requestAnimationFrame(frame);
        } else {
          requestAnimationFrame(wait);
        }
      }
      requestAnimationFrame(wait);
    }
    setTimeout(function () { requestAnimationFrame(frame); }, 1400);
  })();

  /* ---------- AI Portfolio Assistant init ---------- */
  (function () {
    var panel   = document.getElementById('chatPanel');
    var msgs    = document.getElementById('chatMessages');
    var welcome = document.getElementById('assistantWelcome');
    var input   = document.getElementById('chatInput');
    var form    = document.getElementById('chatForm');
    if (!panel || !msgs || !welcome) return;

    /* ---------- Helper functions ---------- */
    function progressiveHTML(html, maxChars) {
      var out = '';
      var visible = 0;
      var inTag = false;
      var inEntity = false;
      var entityBuf = '';
      var i = 0;
      while (i < html.length && visible < maxChars) {
        var ch = html[i];
        if (inEntity) {
          entityBuf += ch;
          if (ch === ';') { out += entityBuf; entityBuf = ''; inEntity = false; visible++; }
          i++; continue;
        }
        if (ch === '<' && !inTag) { inTag = true; out += ch; i++; continue; }
        if (inTag) { out += ch; if (ch === '>') inTag = false; i++; continue; }
        if (ch === '&') { inEntity = true; entityBuf = '&'; i++; continue; }
        out += ch;
        if (ch !== ' ') visible++;
        i++;
      }
      while (i < html.length) {
        var c = html[i];
        if (c === '<') { inTag = true; out += c; i++; continue; }
        if (inTag) { out += c; if (c === '>') inTag = false; i++; continue; }
        break;
      }
      return out;
    }

    function typewrite(el) {
      var body = el.querySelector('.msg-body');
      if (!body) return;
      var html = body.innerHTML;
      var text = body.textContent;
      if (!text) return;
      body.innerHTML = '';
      body.style.display = 'inline';
      var i = 0;
      var speed = 28 + Math.random() * 24;
      function tick() {
        if (i < text.length) {
          body.innerHTML = progressiveHTML(html, i) + '<span class="type-cursor">|</span>';
          i++;
          msgs.scrollTop = msgs.scrollHeight;
          setTimeout(tick, speed);
        } else {
          body.innerHTML = html;
          msgs.scrollTop = msgs.scrollHeight;
        }
      }
      tick();
    }

    /* --- Typewriter for AI responses (set up BEFORE greeting so observer catches it) --- */
    var twObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mut) {
        mut.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.classList.contains('msg-ai') && !node.classList.contains('msg-typing')) {
            typewrite(node);
          }
        });
      });
    });
    twObserver.observe(msgs, { childList: true });

    panel.classList.add('open');

    if (!msgs.childElementCount) {
      var greeting = "Ask me anything about John\u2019s projects, certifications, skills, experience, education, or scheduling.";
      var div = document.createElement('div');
      div.className = 'msg msg-ai';
      div.innerHTML = '<span class="prompt-user msg-prompt">jlz</span><span class="prompt-at msg-prompt">@</span><span class="prompt-host msg-prompt">portfolio</span><span class="prompt-colon msg-prompt">:</span><span class="prompt-path msg-prompt">~</span><span class="prompt-dolar msg-prompt">$</span> <span class="msg-body">' + greeting + '</span>';
      msgs.appendChild(div);
      welcome.classList.add('hidden');
    }

    function hideWelcome() {
      if (welcome && !welcome.classList.contains('hidden')) {
        welcome.classList.add('hidden');
      }
    }

    var wObserver = new MutationObserver(function () {
      if (msgs.childElementCount) hideWelcome();
    });
    wObserver.observe(msgs, { childList: true });

    document.querySelectorAll('.quick-cmd').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-ask') || btn.textContent;
        if (input && form) {
          input.value = text;
          hideWelcome();
          form.dispatchEvent(new Event('submit'));
        }
      });
    });

    })();
})();
