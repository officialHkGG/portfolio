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
  // stäng meny när man klickar på en länk i mobil
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

// Reveal on scroll (IntersectionObserver)
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Projects from JS
const projects = [
  {
    title: "Projekt 1 – REST API",
    desc: "Java backend med REST endpoints, validering och enkel auth.",
    tags: ["Java", "Spring", "REST"],
    github: "#",
    live: "#"
  },
  {
    title: "Projekt 2 – Dockerized app",
    desc: "Containeriserad app med DB + miljövariabler.",
    tags: ["Docker", "MySQL", "CI/CD"],
    github: "#",
    live: "#"
  },
  {
    title: "Projekt 3 – AI/OpenCV",
    desc: "Bildanalys/automation med OpenCV och ML-integration.",
    tags: ["Python", "OpenCV", "Integration"],
    github: "#",
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

  // observer på nya cards också
  document.querySelectorAll(".project.reveal").forEach(el => io.observe(el));
}

// Skills progress bars from JS
const skills = [
  { name: "Java", level: 75 },
  { name: "Spring Boot", level: 65 },
  { name: "SQL / MySQL", level: 70 },
  { name: "Docker", level: 60 },
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

  // animera fills när sektionen syns
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

  // Honeypot: om detta är ifyllt -> bot
  const hp = contactForm.querySelector('input[name="_gotcha"]');
  if (hp && hp.value.trim() !== "") {
    // Låtsas lyckas (så botten inte lär sig)
    contactForm.reset();
    showToast("Tack!", "Ditt meddelande är skickat.");
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
      let msg = "Något gick fel. Testa igen om en stund.";
      try {
        const data = await res.json();
        if (data && data.errors && data.errors.length) {
          msg = data.errors.map(e => e.message).join(" ");
        }
      } catch {}
      setButtonState("idle");
      if (formHint) formHint.textContent = "⚠️ Kunde inte skicka. Försök igen.";
      showToast("Kunde inte skicka", msg, true);
    }
  } catch (err) {
    setButtonState("idle");
    if (formHint) formHint.textContent = "⚠️ Nätverksfel. Kontrollera internet och prova igen.";
    showToast("Nätverksfel", "Kunde inte nå tjänsten. Försök igen.", true);
  }
});
