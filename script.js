// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && nav.classList.contains("open")) {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// Dark / Light toggle
const themeBtn = document.getElementById("themeBtn");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeBtn) themeBtn.textContent = theme === "dark" ? "🌙" : "☀️";
}
setTheme(localStorage.getItem("theme") || "dark");

themeBtn?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in");
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Active section in nav (pro detail)
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];

const activeIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(s => activeIO.observe(s));

// Projects data (edit these)
const projects = [
  {
    title: "Job CRM",
    desc: "Fullstack CRM application for managing job applications.",
    tags: ["Java", "Spring Boot", "React", "PostgreSQL"],
    github: "https://github.com/officialHkGG/job-crm",
    live: "https://job-crm-six.vercel.app/"
  },

  {
    title: "Portfolio Website",
    desc: "My personal developer portfolio.",
    tags: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/officialHkGG/portfolio",
    live: "https://your-portfolio.vercel.app"
  },

  {
  title: "Bostadskollen",
  desc: "A smart housing discovery platform built with Java that aggregates rental listings, tracks new opportunities, and helps users find safer housing faster.",
  tags: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Docker"],
  github: "https://github.com/officialHkGG/Bostadsk-",
  live: "#"
}
];

const projectsGrid = document.getElementById("projectsGrid");
if (projectsGrid) {
  projectsGrid.innerHTML = projects.map(p => `
    <article class="card project reveal">
      <h3>${p.title}</h3>
      <p class="muted">${p.desc}</p>
      <div class="tags">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
      </div>
      <div class="links">
        <a class="link" href="${p.github}" target="_blank" rel="noreferrer">GitHub</a>
        <a class="link" href="${p.live}" target="_blank" rel="noreferrer">Live</a>
      </div>
    </article>
  `).join("");
  document.querySelectorAll(".project.reveal").forEach(el => io.observe(el));
}

// Skills progress bars (edit levels)
const skills = [
  { name: "Java", level: 78 },
  { name: "Spring Boot", level: 68 },
  { name: "SQL / MySQL", level: 72 },
  { name: "Docker", level: 62 },
  { name: "Git", level: 70 },
  { name: "JavaScript", level: 55 }
];

const skillsList = document.getElementById("skillsList");
if (skillsList) {
  skillsList.innerHTML = skills.map(s => `
    <div class="skill">
      <div><strong>${s.name}</strong></div>
      <div class="bar"><div class="fill" data-level="${s.level}"></div></div>
      <div class="muted">${s.level}%</div>
    </div>
  `).join("");

  const fillEls = skillsList.querySelectorAll(".fill");
  const skillIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fillEls.forEach(el => el.style.width = el.dataset.level + "%");
        skillIO.disconnect();
      }
    });
  }, { threshold: 0.2 });
  skillIO.observe(skillsList);
}

// Formspree (AJAX) + honeypot + toast + success animation
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xbdakaba";
const contactForm = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const formHint = document.getElementById("formHint");
const toast = document.getElementById("toast");

function showToast(title, body, isError = false) {
  if (!toast) return;
  toast.innerHTML = `
    <div class="t-title">${isError ? "⚠️ " : "✅ "}${title}</div>
    <div class="t-body">${body}</div>
  `;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3800);
}

function setButtonState(state) {
  if (!sendBtn) return;
  sendBtn.classList.remove("loading", "success");
  sendBtn.querySelector(".btn-text").textContent = "Skicka";
  if (state === "loading") {
    sendBtn.classList.add("loading");
    sendBtn.querySelector(".btn-text").textContent = "Skickar...";
  }
  if (state === "success") {
    sendBtn.classList.add("success");
    sendBtn.querySelector(".btn-text").textContent = "Skickat!";
  }
}

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const hp = contactForm.querySelector('input[name="_gotcha"]');
  if (hp && hp.value.trim() !== "") {
    contactForm.reset();
    showToast("Skickat!", "Tack! Jag återkommer så snart som möjligt.");
    return;
  }

  setButtonState("loading");
  if (formHint) formHint.textContent = "Skickar…";

  try {
    const formData = new FormData(contactForm);
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: formData
    });

    if (res.ok) {
      contactForm.reset();
      setButtonState("success");
      if (formHint) formHint.textContent = "✅ Skickat! Tack för ditt meddelande.";
      showToast("Skickat!", "Tack! Jag återkommer så snart som möjligt.");
      setTimeout(() => setButtonState("idle"), 1600);
    } else {
      setButtonState("idle");
      if (formHint) formHint.textContent = "⚠️ Kunde inte skicka. Försök igen.";
      showToast("Kunde inte skicka", "Något gick fel. Försök igen om en stund.", true);
    }
  } catch {
    setButtonState("idle");
    if (formHint) formHint.textContent = "⚠️ Nätverksfel. Kontrollera internet och prova igen.";
    showToast("Nätverksfel", "Kunde inte nå tjänsten. Försök igen.", true);
  }
});

// ===== Language toggle (SV/EN) without changing HTML structure =====
const langBtn = document.getElementById("langBtn");

const i18n = {
  sv: {
    nav: ["Om", "Fokus", "Featured", "Projekt", "Skills", "Kontakt"],
    pill: "Java • Backend • AI integration",
    heroTitle: "Building reliable backend systems with Java.",
    heroLead:
      "Nyexaminerad Javautvecklare med praktisk erfarenhet från LIA i skarpa projekt.\n" +
      "Jag bygger strukturerade API:er, jobbar gärna med databaser och Docker,\n" +
      "och har erfarenhet av att integrera AI-flöden med Java & Python.",
    cta1: "Se featured case",
    cta2: "Projekt",
    cta3: "Examensbevis (PDF)",
    meta: ["📍 Stockholm/Solna", "💼 Öppen för juniorroll / trainee", "🚗 B-körkort"],
    contactTitle: "Contact",
    aboutTitle: "Om mig",
    profileTitle: "Profil",
    backgroundTitle: "Bakgrund",
    focusTitle: "What I focus on",
    featuredTitle: "Featured case",
    featuredCardTitle: "AI-Integration i plattform (LIA – Spend Ninja)",
    problemLabel: "Problem:",
    solutionLabel: "Lösning:",
    problemText: "Plattformen behövde smartare automation/bildanalys för att minska manuellt arbete.",
    solutionText: "Byggde AI-funktioner med OpenCV/ML och integrerade dem i plattformen via Java backend.",
    kv: { tech: "Tech", ansvar: "Ansvar", lardom: "Lärdom" },
    kvVals: {
      tech: "Java, Python, OpenCV, REST, Docker",
      ansvar: "Utveckling, integration, testning, förbättringar",
      lardom: "Integration mellan ML-flöden och backend, robusthet i pipeline"
    },
    moreProjects: "Se fler projekt",
    contactMe: "Kontakta mig",
    skillsTitle: "Skills",
    coreSkillsTitle: "Core skills",
    toolsTitle: "Tools",
    languagesTitle: "Languages",
    contactSectionTitle: "Kontakt",
    form: { name: "Namn", email: "Email", message: "Meddelande", send: "Skicka", hint: "Jag återkommer så snabbt som möjligt." }
  },

  en: {
    nav: ["About", "Focus", "Featured", "Projects", "Skills", "Contact"],
    pill: "Java • Backend • AI integration",
    heroTitle: "Building reliable backend systems with Java.",
    heroLead:
      "Newly graduated Java developer with hands-on experience from real-world internship projects.\n" +
      "I build structured APIs, enjoy working with databases and Docker,\n" +
      "and have experience integrating AI workflows using Java & Python.",
    cta1: "View featured case",
    cta2: "Projects",
    cta3: "Diploma (PDF)",
    meta: ["📍 Stockholm/Solna", "💼 Open to junior/trainee roles", "🚗 Driving license (B)"],
    contactTitle: "Contact",
    aboutTitle: "About me",
    profileTitle: "Profile",
    backgroundTitle: "Background",
    focusTitle: "What I focus on",
    featuredTitle: "Featured case",
    featuredCardTitle: "AI Integration in Platform (Internship – Spend Ninja)",
    problemLabel: "Problem:",
    solutionLabel: "Solution:",
    problemText: "The platform needed smarter automation/image analysis to reduce manual work.",
    solutionText: "Built AI features using OpenCV/ML and integrated them into the platform through the Java backend.",
    kv: { tech: "Tech", ansvar: "Responsibility", lardom: "Key learning" },
    kvVals: {
      tech: "Java, Python, OpenCV, REST, Docker",
      ansvar: "Development, integration, testing, improvements",
      lardom: "Connecting ML workflows with backend services, making the pipeline robust"
    },
    moreProjects: "See more projects",
    contactMe: "Contact me",
    skillsTitle: "Skills",
    coreSkillsTitle: "Core skills",
    toolsTitle: "Tools",
    languagesTitle: "Languages",
    contactSectionTitle: "Contact",
    form: { name: "Name", email: "Email", message: "Message", send: "Send", hint: "I’ll get back to you as soon as possible." }
  }
};

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return [...document.querySelectorAll(sel)]; }

function setLang(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  const t = i18n[lang];

  // Navbar links (first 6 links)
  const navLinks = qsa("nav#nav a").slice(0, 6);
  navLinks.forEach((a, i) => { if (t.nav[i]) a.textContent = t.nav[i]; });

  // Hero
  const pill = qs(".hero .pill");
  if (pill) pill.textContent = t.pill;

  const heroTitle = qs(".hero .headline");
  if (heroTitle) heroTitle.textContent = t.heroTitle;

  const heroLead = qs(".hero .lead");
  if (heroLead) heroLead.textContent = t.heroLead;

  // CTA buttons (3)
  const ctas = qsa(".hero .cta a");
  if (ctas[0]) ctas[0].textContent = t.cta1;
  if (ctas[1]) ctas[1].textContent = t.cta2;
  if (ctas[2]) ctas[2].textContent = t.cta3;

  // Meta
  const metaSpans = qsa(".hero .meta span");
  metaSpans.forEach((s, i) => { if (t.meta[i]) s.textContent = t.meta[i]; });

  // Contact card title
  const contactTitle = qs(".contact-card h2");
  if (contactTitle) contactTitle.textContent = t.contactTitle;

  // Section titles + headings
  const aboutH2 = qs("#about h2");
  if (aboutH2) aboutH2.textContent = t.aboutTitle;

  const aboutH3 = qsa("#about h3");
  if (aboutH3[0]) aboutH3[0].textContent = t.profileTitle;
  if (aboutH3[1]) aboutH3[1].textContent = t.backgroundTitle;

  const focusH2 = qs("#focus h2");
  if (focusH2) focusH2.textContent = t.focusTitle;

  const featuredH2 = qs("#featured h2");
  if (featuredH2) featuredH2.textContent = t.featuredTitle;

  // Featured card
  const featuredCardTitle = qs("#featured .featured h3");
  if (featuredCardTitle) featuredCardTitle.textContent = t.featuredCardTitle;

  const featuredPs = qsa("#featured .featured p.muted");
  // These are the two lines with Problem/Solution
  if (featuredPs[0]) featuredPs[0].innerHTML = `<strong>${t.problemLabel}</strong> ${t.problemText}`;
  if (featuredPs[1]) featuredPs[1].innerHTML = `<strong>${t.solutionLabel}</strong> ${t.solutionText}`;

  // KV labels + values
  const kvRows = qsa("#featured .kv > div");
  if (kvRows[0]) {
    kvRows[0].querySelector(".k").textContent = t.kv.tech;
    kvRows[0].querySelector(".v").textContent = t.kvVals.tech;
  }
  if (kvRows[1]) {
    kvRows[1].querySelector(".k").textContent = t.kv.ansvar;
    kvRows[1].querySelector(".v").textContent = t.kvVals.ansvar;
  }
  if (kvRows[2]) {
    kvRows[2].querySelector(".k").textContent = t.kv.lardom;
    kvRows[2].querySelector(".v").textContent = t.kvVals.lardom;
  }

  // Featured links buttons
  const featuredBtns = qsa("#featured .links a");
  if (featuredBtns[0]) featuredBtns[0].textContent = t.moreProjects;
  if (featuredBtns[1]) featuredBtns[1].textContent = t.contactMe;

  // Projects / Skills / Contact titles
  const projectsH2 = qs("#projects h2");
  if (projectsH2) projectsH2.textContent = (lang === "sv" ? "Projekt" : "Projects");

  const skillsH2 = qs("#skills h2");
  if (skillsH2) skillsH2.textContent = t.skillsTitle;

  const coreSkillsH3 = qs("#skills .grid-2 .card h3");
  if (coreSkillsH3) coreSkillsH3.textContent = t.coreSkillsTitle;

  // Tools/Languages headings (second card)
  const rightCardH3s = qsa("#skills .grid-2 .card:nth-child(2) h3");
  if (rightCardH3s[0]) rightCardH3s[0].textContent = t.toolsTitle;
  if (rightCardH3s[1]) rightCardH3s[1].textContent = t.languagesTitle;

  const contactH2 = qs("#contact h2");
  if (contactH2) contactH2.textContent = t.contactSectionTitle;

  // Form labels + button + hint
  const formLabels = qsa("#contactForm label");
  if (formLabels[0]) formLabels[0].childNodes[0].textContent = t.form.name + "\n";
  if (formLabels[1]) formLabels[1].childNodes[0].textContent = t.form.email + "\n";
  if (formLabels[2]) formLabels[2].childNodes[0].textContent = t.form.message + "\n";

  const sendText = qs("#sendBtn .btn-text");
  if (sendText) sendText.textContent = t.form.send;

  if (formHint) formHint.textContent = t.form.hint;

  // Button shows the OTHER language to switch to
  if (langBtn) langBtn.textContent = (lang === "sv" ? "EN" : "SV");
}

// Init language
const savedLang = localStorage.getItem("lang") || "sv";
setLang(savedLang);

langBtn?.addEventListener("click", () => {
  const current = localStorage.getItem("lang") || "sv";
  setLang(current === "sv" ? "en" : "sv");
});