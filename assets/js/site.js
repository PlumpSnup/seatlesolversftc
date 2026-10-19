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

function socialsHTML() {
  return SOCIALS.map(
    (s) => `<a href="${s.href}" aria-label="${s.label}" target="_blank" rel="noopener">${s.icon}</a>`
  ).join("");
}

function headerHTML() {
  const links = NAV.map(
    (n) => `<li><a href="${n.href}"${n.href === current ? ' aria-current="page"' : ""}>${n.label}</a></li>`
  ).join("");
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="index.html" aria-label="${TEAM.name} home">
        <img src="assets/img/logo.svg" alt="" width="42" height="42">
        <span class="brand-text"><strong>${TEAM.name.toUpperCase()}</strong><span>FTC #${TEAM.number}</span></span>
      </a>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span></span></button>
      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul class="nav-links">${links}</ul>
        <div class="socials">${socialsHTML()}</div>
        <a class="btn" href="sponsors.html#become">Sponsor us ${ARROW}</a>
      </nav>
    </div>
  </header>`;
}

function footerHTML() {
  const year = new Date().getFullYear();
  const half = Math.ceil(NAV.length / 2);
  const col = (items) => items.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("");
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html">
            <img src="assets/img/logo.svg" alt="" width="42" height="42">
            <span class="brand-text"><strong>${TEAM.name.toUpperCase()}</strong><span>FTC #${TEAM.number}</span></span>
          </a>
          <p class="muted" style="margin-top:16px;max-width:34ch">A student-led robotics team from ${TEAM.location}, competing in <em>FIRST</em> Tech Challenge.</p>
          <div class="socials">${socialsHTML()}</div>
        </div>
        <div><h4>Explore</h4><ul>${col(NAV.slice(0, half))}</ul></div>
        <div><h4>More</h4><ul>${col(NAV.slice(half))}<li><a href="mailto:${TEAM.email}">${TEAM.email}</a></li></ul></div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${year} ${TEAM.name} · FTC Team #${TEAM.number} · ${TEAM.location}</span>
        <span><em>FIRST</em>&reg; and FIRST&reg; Tech Challenge are trademarks of <em>FIRST</em>.</span>
      </div>
    </div>
  </footer>`;
}

document.querySelectorAll('[data-include="header"]').forEach((el) => (el.outerHTML = headerHTML()));
document.querySelectorAll('[data-include="footer"]').forEach((el) => (el.outerHTML = footerHTML()));
document.querySelectorAll("[data-socials]").forEach((el) => (el.innerHTML = socialsHTML()));

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
