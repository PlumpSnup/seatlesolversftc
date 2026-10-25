/* =========================================================
   Deadly · FTC Team #34237 — shared header, footer & UI
   Edit TEAM, NAV and SOCIALS below; every page picks it up.
   ========================================================= */

const TEAM = {
  name: "Deadly",
  number: "34237",
  location: "Dubai, UAE",
  email: "hello@example.com", // TODO: real team email
};

// Sister team. Its page (deadlier.html) sets <html data-team="deadlier">.
const DEADLIER = {
  name: "Deadlier",
  number: "XXXXX", // TODO: team number once FIRST assigns it
  // Look for the Deadlier pages: "daycare" (crayon colors + duckling logo)
  // or "orange" (orange accent + orange dragon logo). Change this one word to switch.
  look: "orange",
};

// Tabs in the strip above the header
const TEAMS = [
  { href: "index.html", label: `${TEAM.name} #${TEAM.number}`, cls: "deadly" },
  { href: "deadlier.html", label: `${DEADLIER.name} #${DEADLIER.number}`, cls: "deadlier" },
];

const NAV = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "About" },
  { href: "impact.html", label: "Impact" },
  { href: "robots.html", label: "Robots" },
  { href: "resources.html", label: "Resources" },
  { href: "services.html", label: "Services" },
  { href: "sponsors.html", label: "Sponsors" },
  { href: "contact.html", label: "Contact" },
];

// Deadlier has its own versions of these pages; every other page is shared.
const DEADLIER_PAGES = {
  "index.html": "deadlier.html",
  "about.html": "deadlier-about.html",
  "robots.html": "deadlier-robots.html",
  "resources.html": "deadlier-resources.html",
  "services.html": "deadlier-services.html",
};

// TODO: replace "#" with your real profile links
const SOCIALS = [
  { label: "Instagram", href: "#", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>' },
  { label: "YouTube", href: "#", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg>' },
  { label: "Discord", href: "#", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M8 6c-1.5.3-3 .8-4 1.5C2.5 10.5 2 13.5 2.2 16.5 3.6 17.6 5 18.2 6.5 18.6l1-1.6M16 6c1.5.3 3 .8 4 1.5 1.5 3 2 6 1.8 9-1.4 1.1-2.8 1.7-4.3 2.1l-1-1.6M7 16.5c3.3 1.5 6.7 1.5 10 0M8 6.5c2.7-.8 5.3-.8 8 0"/><circle cx="9" cy="12.5" r="1.3" fill="currentColor"/><circle cx="15" cy="12.5" r="1.3" fill="currentColor"/></svg>' },
  { label: "LinkedIn", href: "#", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7"/></svg>' },
];

const ARROW = '<span class="arrow" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 8h11M9 4l4 4-4 4"/></svg></span>';

document.documentElement.classList.remove("no-js");

const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
const isDeadlier = document.documentElement.dataset.team === "deadlier";
const brand = isDeadlier ? DEADLIER : TEAM;
const home = isDeadlier ? "deadlier.html" : "index.html";
// A visitor's choice from the switch on the home page wins over DEADLIER.look
// "v2": choices saved before the switch moved to the bottom are ignored, so everyone starts on orange
const LOOK_KEY = "deadlierLook.v2";
try { localStorage.removeItem("deadlierLook"); } catch (e) {}
let look = DEADLIER.look;
try {
  const saved = localStorage.getItem(LOOK_KEY);
  if (saved === "daycare" || saved === "orange") look = saved;
} catch (e) {}
document.documentElement.dataset.look = look;
// Deadlier logo files; the daycare look uses the *-daycare.png duckling versions
const dlLogo = (name) => `assets/img/${name}${look === "daycare" ? "-daycare" : ""}.png`;
if (isDeadlier) {
  document.querySelector('link[rel="icon"]')?.setAttribute("href", dlLogo("logo-deadlier"));
  document.querySelector('link[rel="apple-touch-icon"]')?.setAttribute("href", dlLogo("apple-touch-icon-deadlier"));
}
const nav = isDeadlier ? NAV.map((n) => ({ ...n, href: DEADLIER_PAGES[n.href] || n.href })) : NAV;

function socialsHTML() {
  return SOCIALS.map(
    (s) => `<a href="${s.href}" aria-label="${s.label}" target="_blank" rel="noopener">${s.icon}</a>`
  ).join("");
}

function headerHTML() {
  const links = nav.map(
    (n) => `<li><a href="${n.href}"${n.href === current ? ' aria-current="page"' : ""}>${n.label}</a></li>`
  ).join("");
  const tabs = TEAMS.map(
    (t) => `<a class="${t.cls}" href="${t.href}"${(t.cls === "deadlier") === isDeadlier ? ' aria-current="true"' : ""}>${t.label}</a>`
  ).join("");
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="site-top">
  <nav class="team-switch" aria-label="Teams"><div class="container">${tabs}</div></nav>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="${home}" aria-label="${brand.name} home">
        <img src="${isDeadlier ? dlLogo("logo-deadlier") : "assets/img/logo.png"}" alt="" width="42" height="42">
        <span class="brand-text"><strong>${brand.name.toUpperCase()}</strong><span>FTC #${brand.number}</span></span>
      </a>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span></span></button>
      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul class="nav-links">${links}</ul>
        <div class="socials">${socialsHTML()}</div>
        <a class="btn" href="sponsors.html#become">Sponsor us ${ARROW}</a>
      </nav>
    </div>
  </header>
  </div>`;
}

function footerHTML() {
  const year = new Date().getFullYear();
  const half = Math.ceil(nav.length / 2);
  const col = (items) => items.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("");
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="footer-logo" href="${home}">
            <img src="${isDeadlier ? dlLogo("logo-full-deadlier") : "assets/img/logo-full.png"}" alt="${brand.name} logo" width="160" height="${isDeadlier ? 127 : 139}">
          </a>
          <p class="muted" style="margin-top:16px;max-width:34ch">${isDeadlier
            ? `The sister team of ${TEAM.name} #${TEAM.number}, competing in <em>FIRST</em> Tech Challenge from ${TEAM.location}.`
            : `A student-led robotics team from ${TEAM.location}, competing in <em>FIRST</em> Tech Challenge.`}</p>
          <div class="socials">${socialsHTML()}</div>
        </div>
        <div><h4>Explore</h4><ul>${col(nav.slice(0, half))}</ul></div>
        <div><h4>More</h4><ul>${col(nav.slice(half))}<li><a href="mailto:${TEAM.email}">${TEAM.email}</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${year} ${brand.name} · FTC Team #${brand.number} · ${TEAM.location}</span>
        <span><em>FIRST</em>&reg; and FIRST&reg; Tech Challenge are trademarks of <em>FIRST</em>.</span>
      </div>
    </div>
  </footer>`;
}

document.querySelectorAll('[data-include="header"]').forEach((el) => (el.outerHTML = headerHTML()));
document.querySelectorAll('[data-include="footer"]').forEach((el) => (el.outerHTML = footerHTML()));
document.querySelectorAll("[data-socials]").forEach((el) => (el.innerHTML = socialsHTML()));

/* ---------- Deadlier look switch (home page) ---------- */
document.querySelectorAll("[data-look-toggle]").forEach((el) => {
  el.innerHTML = `
    <span class="look-toggle-label">Deadlier look</span>
    <span class="look-toggle-opt" data-opt="orange">Original</span>
    <button type="button" role="switch" class="look-switch" aria-label="Daycare look for the Deadlier pages"><span class="knob"></span></button>
    <span class="look-toggle-opt" data-opt="daycare">Daycare</span>`;
  const btn = el.querySelector(".look-switch");
  const sync = () => {
    btn.setAttribute("aria-checked", String(look === "daycare"));
    el.querySelectorAll(".look-toggle-opt").forEach((o) => o.classList.toggle("is-on", o.dataset.opt === look));
  };
  btn.addEventListener("click", () => {
    look = look === "daycare" ? "orange" : "daycare";
    document.documentElement.dataset.look = look;
    try { localStorage.setItem(LOOK_KEY, look); } catch (e) {}
    sync();
  });
  sync();
});

// Add the arrow circle to any .btn that doesn't have one yet
document.querySelectorAll(".btn:not(.no-arrow)").forEach((b) => {
  if (!b.querySelector(".arrow")) b.insertAdjacentHTML("beforeend", ARROW);
});

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector(".nav-toggle");
if (toggle) {
  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
  document.querySelectorAll(".site-nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  matchMedia("(min-width: 1100px)").addEventListener("change", (e) => e.matches && setOpen(false));
}

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Count-up stats ---------- */
const counters = document.querySelectorAll("[data-count]");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
  const co = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    co.unobserve(e.target);
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.firstChild.nodeValue = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.5 });
  counters.forEach((el) => co.observe(el));
}
