/* ========================================
   SIAM MEHEDI ANIK — PORTFOLIO SCRIPTS
   script.js
   ======================================== */


/* ---------- 1. SCROLL FADE-IN ANIMATION ----------
   Watches every .fade-in element and adds the
   'visible' class when it enters the viewport.
-------------------------------------------------- */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger each element slightly for a wave effect
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-in').forEach((el) => {
  fadeObserver.observe(el);
});


/* ---------- 2. ACTIVE NAV LINK ON SCROLL ----------
   Highlights the correct nav link as the user
   scrolls through each section.
-------------------------------------------------- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav ul a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => navObserver.observe(section));


/* ---------- 3. STICKY NAV SHADOW ON SCROLL ----------
   Adds a subtle shadow to the navbar when the
   user scrolls below the top of the page.
-------------------------------------------------- */
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
  } else {
    nav.style.boxShadow = 'none';
  }
});


/* ---------- 4. CONTACT FORM VALIDATION ----------
   Basic client-side validation with friendly
   feedback messages. Wire up to a real backend
   (e.g. EmailJS, Formspree) to make it live.
-------------------------------------------------- */
const sendBtn      = document.getElementById('sendBtn');
const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const messageInput = document.getElementById('message');
const feedback     = document.getElementById('form-feedback');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Clear previous feedback
    feedback.textContent = '';
    feedback.className   = 'form-feedback';

    // Simple validation
    if (!name) {
      showFeedback('Please enter your name.', 'error');
      nameInput.focus();
      return;
    }

    if (!email || !isValidEmail(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    if (!message) {
      showFeedback('Please write a message.', 'error');
      messageInput.focus();
      return;
    }

    // All good — simulate a successful send
    sendBtn.textContent  = 'Sending...';
    sendBtn.disabled     = true;

    setTimeout(() => {
      showFeedback('Message sent! I\'ll get back to you soon 🚀', 'success');
      nameInput.value    = '';
      emailInput.value   = '';
      messageInput.value = '';
      sendBtn.textContent = 'Send Message →';
      sendBtn.disabled    = false;
    }, 1200);

    /* ------ TO MAKE IT LIVE WITH EMAILJS ------
       1. Sign up at https://emailjs.com (free tier)
       2. npm install @emailjs/browser  OR load via CDN:
          <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
       3. Replace the setTimeout block above with:

       emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
         from_name:  name,
         from_email: email,
         message:    message,
       }, 'YOUR_PUBLIC_KEY')
       .then(() => {
         showFeedback("Message sent! I'll get back to you soon 🚀", 'success');
         nameInput.value = emailInput.value = messageInput.value = '';
         sendBtn.textContent = 'Send Message →';
         sendBtn.disabled = false;
       })
       .catch(() => {
         showFeedback('Something went wrong. Please try again.', 'error');
         sendBtn.textContent = 'Send Message →';
         sendBtn.disabled = false;
       });
    ------------------------------------------- */
  });
}

/* Helper: display feedback message */
function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className   = 'form-feedback ' + type;
}

/* Helper: basic email format check */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ---------- 5. SMOOTH SCROLL FOR NAV LINKS ----------
   Ensures smooth scrolling even on browsers that
   don't fully support scroll-behavior: smooth.
-------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ---------- 6. TYPING EFFECT ON HERO SUBTITLE ----------
   Cycles through role descriptions under the name.
   Uses a fixed-height container + inline cursor span
   so the page never jumps when text length changes.
-------------------------------------------------- */
const roles = [
  'CSE Undergraduate',
  'Software Developer',
  'AI / ML Researcher',
  'Data Analyst',
  'Open Source Enthusiast',
];

const typingEl = document.querySelector('.hb-role-title .line2') || document.querySelector('.hero h1 .line2');

if (typingEl) {
  // Build inner structure: a text node + a blinking cursor
  // The .line2 already has min-height set in CSS so layout is stable
  typingEl.innerHTML = '<span class="typed-text"></span><span class="typed-cursor">|</span>';

  const typedText   = typingEl.querySelector('.typed-text');
  const cursor      = typingEl.querySelector('.typed-cursor');

  // Style the cursor via JS so no extra CSS file edit is needed
  cursor.style.cssText = `
    display: inline-block;
    width: 2px;
    margin-left: 2px;
    background: currentColor;
    color: transparent;
    border-right: 2px solid #a78bfa;
    animation: blink 0.75s step-end infinite;
  `;

  // Inject blink keyframe once
  if (!document.getElementById('blink-style')) {
    const s = document.createElement('style');
    s.id = 'blink-style';
    s.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
    document.head.appendChild(s);
  }

  let roleIndex      = 0;
  let charIndex      = 0;
  let isDeleting     = false;
  const typingSpeed  = 90;
  const deleteSpeed  = 50;
  const pauseDelay   = 1800;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      typedText.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        setTimeout(() => { isDeleting = true; typeLoop(); }, pauseDelay);
        return;
      }
    } else {
      typedText.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeLoop, isDeleting ? deleteSpeed : typingSpeed);
  }

  setTimeout(typeLoop, 1000);
}