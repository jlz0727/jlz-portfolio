/* =========================================================
   SCHEDULING — EmailJS integration
   ========================================================= */

(function () {
  'use strict';

  var EMAILJS_PUBLIC_KEY = 'GRANkw-yIL1aSS6vp';
  var SERVICE_ID         = 'service_v8icvnd';
  var TEMPLATE_MEETING   = 'template_69odoxo';
  var TEMPLATE_INTERVIEW = 'template_emhb2fg';
  var CONFIGURED = !!EMAILJS_PUBLIC_KEY;

  if (CONFIGURED && window.emailjs) {
    try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (e) { console.error('[emailjs] init failed:', e); }
  }

  window.handleScheduleSubmit = function (opts) {
    var type      = opts.type;
    var form      = opts.form;
    var statusEl  = opts.statusEl;
    var submitBtn = opts.submitBtn;

    if (!CONFIGURED || !window.emailjs) {
      statusEl.textContent = 'Email service is not configured yet. Set EMAILJS_PUBLIC_KEY in emailjs-handler.js.';
      statusEl.className = 'form-status error';
      return;
    }

    var data = {
      from_name:  (form.name.value || '').trim(),
      from_email: (form.email.value || '').trim(),
      message:    (form.message.value || '').trim()
    };
    if (!data.from_name || !data.from_email) {
      statusEl.textContent = 'Please enter your name and email.';
      statusEl.className = 'form-status error';
      return;
    }

    var templateId = type === 'interview' ? TEMPLATE_INTERVIEW : TEMPLATE_MEETING;
    var payload = Object.assign({}, data, {
      meeting_date:   form.date.value,
      interview_date: form.date.value
    });

    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    emailjs.send(SERVICE_ID, templateId, payload).then(function () {
      statusEl.textContent = "\u2713 Request sent! I'll get back to you soon.";
      statusEl.className = 'form-status success';
      form.reset();
      setTimeout(function () {
        var modal = document.getElementById('modal');
        if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
      }, 1600);
    }).catch(function (err) {
      console.error('[emailjs] send failed:', err);
      statusEl.textContent = 'Something went wrong. Try emailing me directly at jlgzambrano27@gmail.com.';
      statusEl.className = 'form-status error';
    }).finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    });
  };

  if (!CONFIGURED) console.info('[emailjs] Not configured — set EMAILJS_PUBLIC_KEY in emailjs-handler.js.');
})();
