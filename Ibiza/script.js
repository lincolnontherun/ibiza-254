/* ============================================
   IBIZA 254 — Premium Script
   Features:
   - Custom cursor
   - Nav scroll behaviour
   - Hamburger menu
   - Scroll reveal animations
   - Real countdown timer
   - Events list population
   - AI-powered About section (Anthropic API)
   - Form validation + submission
   - Menu page tab filtering
   ============================================ */

"use strict";

/* ── PAGE ENTRY ── */
document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initNav();
  initHamburger();
  initScrollReveal();
  initEvents();
  initCountdown();
  initAboutAI();
  initForm();
  initMenuTabs();
});


/* ── CUSTOM CURSOR ── */
function initCursor() {
  const cursor      = document.getElementById("cursor");
  const cursorTrail = document.getElementById("cursorTrail");
  if (!cursor || !cursorTrail) return;

  let mouseX = -100, mouseY = -100;
  let trailX  = -100, trailY  = -100;
  let raf;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + "px";
    cursorTrail.style.top  = trailY + "px";
    raf = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity      = "0";
    cursorTrail.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity      = "1";
    cursorTrail.style.opacity = "1";
  });
}


/* ── NAV SCROLL ── */
function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Smooth scroll for all nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      // Close mobile menu if open
      const mobileMenu = document.getElementById("mobileMenu");
      const hamburger  = document.getElementById("hamburger");
      if (mobileMenu && mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        hamburger && hamburger.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  });
}


/* ── HAMBURGER ── */
function initHamburger() {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
}


/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  // Mark elements as reveal targets
  const selectors = [
    ".section-header",
    ".exp-card",
    ".event-card",
    ".about-content",
    ".about-img-wrap",
    ".location-info",
    ".map-wrap",
    ".contact-copy",
    ".reserve-form",
    ".menu-category",
    ".menu-cta"
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add("reveal");
      if (i < 4) el.classList.add(`reveal-delay-${i + 1}`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}


/* ── EVENTS LIST ── */
function initEvents() {
  const list = document.getElementById("eventsList");
  if (!list) return;

  const today = new Date();

  const events = [
    {
      day: nextDay(today, 5),
      name: "Friday Ritual",
      type: "Afrobeats · House · R&B"
    },
    {
      day: nextDay(today, 6),
      name: "Saturday Sessions",
      type: "DJ Residency Night"
    },
    {
      day: nextDay(today, 12),
      name: "The Nairobi Experience",
      type: "Live Performance · Special Guest"
    },
    {
      day: nextDay(today, 13),
      name: "Ibiza Sundays",
      type: "Rooftop Brunch → Night"
    }
  ];

  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  events.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card reveal";
    card.innerHTML = `
      <div class="event-date">${pad(ev.day.getDate())}</div>
      <div class="event-month">${months[ev.day.getMonth()]} ${ev.day.getFullYear()}</div>
      <div class="event-name">${ev.name}</div>
      <div class="event-type">${ev.type}</div>
    `;
    list.appendChild(card);
  });
}

function nextDay(from, addDays) {
  const d = new Date(from);
  d.setDate(d.getDate() + addDays);
  return d;
}

function pad(n) {
  return String(n).padStart(2, "0");
}


/* ── COUNTDOWN ── */
function initCountdown() {
  const ctH = document.getElementById("ctH");
  const ctM = document.getElementById("ctM");
  const ctS = document.getElementById("ctS");
  if (!ctH || !ctM || !ctS) return;

  // Next Friday at 21:00
  function getNextTarget() {
    const now   = new Date();
    const target = new Date(now);
    const day   = now.getDay();       // 0=Sun, 5=Fri
    const daysToFri = (5 - day + 7) % 7 || 7;
    target.setDate(now.getDate() + daysToFri);
    target.setHours(21, 0, 0, 0);
    return target;
  }

  function update() {
    const diff = getNextTarget() - new Date();
    if (diff <= 0) return;

    const totalSec = Math.floor(diff / 1000);
    const h        = Math.floor(totalSec / 3600);
    const m        = Math.floor((totalSec % 3600) / 60);
    const s        = totalSec % 60;

    ctH.textContent = pad(h);
    ctM.textContent = pad(m);
    ctS.textContent = pad(s);
  }

  update();
  setInterval(update, 1000);
}


/* ── AI-POWERED ABOUT ── */
async function initAboutAI() {
  const container = document.getElementById("aboutText");
  if (!container) return;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Write a compelling, atmospheric "About Us" story for Ibiza 254, a premium nightlife lounge in Nairobi, Kenya located on the 5th floor of Lavington Mall.

Details:
- They serve premium cocktails, fine dining (steaks, burgers, pizza), and host DJ nights and rooftop events
- Rated 4.2 stars with 468 Google reviews  
- Instagram: @ibiza_254
- Phone: +254 728 466 007
- Open 24 hours

Write 3 short paragraphs (2-3 sentences each) that feel luxury, editorial, and cinematic in tone. Avoid clichés and generic hospitality language. Write as if Nairobi's social elite are reading it. Use evocative, sensory language. Do NOT use any markdown formatting, headers, or bullet points — just plain paragraph text with no extra labels.`
          }
        ]
      })
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    const text = data.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("")
      .trim();

    // Split into paragraphs and render
    const paras = text.split(/\n+/).filter(p => p.trim().length > 0);

    container.innerHTML = paras
      .map(p => `<p>${p.trim()}</p>`)
      .join("");

  } catch (err) {
    // Graceful fallback
    container.innerHTML = `
      <p>Ibiza 254 was born from a singular obsession — that Nairobi deserved a night out that felt truly world-class. Perched on the fifth floor of Lavington Mall, the lounge was designed as a refuge from the ordinary: a space where craft cocktails, elevated cuisine, and immersive music converge into something felt long after the night ends.</p>
      <p>Every detail was deliberate. The rooftop catches the city's lights like scattered diamonds. The menu reads like a letter to indulgence. The DJs don't just play — they architect emotion, moving a room through something close to transcendence.</p>
      <p>Four years and 468 reviews later, the verdict is unanimous. Ibiza 254 is not just a venue. It is the standard by which Nairobi's nights are measured.</p>
    `;
  }
}


/* ── FORM VALIDATION & SUBMISSION ── */
function initForm() {
  const form    = document.getElementById("reserveForm");
  if (!form) return;

  const submitBtn = document.getElementById("formSubmit");
  const success   = document.getElementById("formSuccess");

  // Set min date to today
  const dateInput = document.getElementById("fdate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    // Simulate booking submission (replace with real API)
    await new Promise(r => setTimeout(r, 1800));

    // Success
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
    submitBtn.style.opacity = "0.5";

    success.textContent = "✓ Your reservation has been received. We'll confirm within 2 hours.";
    success.classList.add("visible");

    form.reset();

    setTimeout(() => {
      success.classList.remove("visible");
      submitBtn.style.opacity = "";
    }, 6000);
  });

  // Live validation
  ["fname", "fphone", "fdate"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("blur", () => validateField(el));
      el.addEventListener("input", () => clearError(el));
    }
  });
}

function validateForm() {
  let valid = true;

  const fname   = document.getElementById("fname");
  const fphone  = document.getElementById("fphone");
  const fdate   = document.getElementById("fdate");
  const fguests = document.getElementById("fguests");

  if (!fname || !fname.value.trim()) {
    showError("nameError", "Please enter your full name");
    valid = false;
  }

  if (!fphone || !fphone.value.trim()) {
    showError("phoneError", "Please enter your phone number");
    valid = false;
  } else if (!/^[\+\d\s\-\(\)]{8,20}$/.test(fphone.value.trim())) {
    showError("phoneError", "Please enter a valid phone number");
    valid = false;
  }

  if (!fdate || !fdate.value) {
    showError("dateError", "Please select a date");
    valid = false;
  }

  return valid;
}

function validateField(input) {
  if (!input.value.trim() && input.required) {
    const errId = input.id.replace("f", "") + "Error";
    showError(errId, "This field is required");
  }
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearError(input) {
  const errId = input.id.replace("f", "") + "Error";
  const el    = document.getElementById(errId);
  if (el) el.textContent = "";
}


/* ── MENU TAB FILTERING ── */
function initMenuTabs() {
  const tabs = document.querySelectorAll(".tab");
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;
      const cats   = document.querySelectorAll(".menu-category");

      cats.forEach(cat => {
        if (filter === "all" || cat.dataset.cat === filter) {
          cat.classList.remove("hidden");
          // Re-trigger reveal animation
          cat.classList.remove("visible");
          setTimeout(() => cat.classList.add("visible"), 30);
        } else {
          cat.classList.add("hidden");
        }
      });
    });
  });
}