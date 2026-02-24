// =====================
// Theme (first visit uses browser preference)
// =====================
const THEME_KEY = "at_theme";

function getPreferredThemeFromBrowser() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  syncThemeUI();
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else {
    applyTheme(getPreferredThemeFromBrowser());
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
}

// =====================
// Sync Theme UI (Header + Mobile)
// - Switch checked = dark
// - Text shows what will switch TO
//   light -> "Tema Escuro"
//   dark  -> "Tema Claro"
// =====================
function syncThemeUI() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const isDark = current === "dark";

  const pairs = [
    { sw: "themeSwitchHeader", tx: "themeActionTextHeader" },
    { sw: "themeSwitchMobile", tx: "themeActionTextMobile" },
  ];

  pairs.forEach(({ sw, tx }) => {
    const themeSwitch = document.getElementById(sw);
    const themeText = document.getElementById(tx);

    if (themeSwitch) themeSwitch.checked = isDark;
    if (themeText) themeText.textContent = isDark ? "Tema Claro" : "Tema Escuro";
  });
}

// =====================
// Settings menu (HEADER + MOBILE)
// =====================
function setupSettingsMenu({ openBtnId, menuId, rowBtnId, switchId }) {
  const openBtn = document.getElementById(openBtnId);
  const menu = document.getElementById(menuId);
  const rowBtn = document.getElementById(rowBtnId);
  const sw = document.getElementById(switchId);

  if (!openBtn || !menu) return;

  function closeMenu() {
    menu.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    // fecha qualquer outro menu de settings aberto
    document.querySelectorAll(".settings__menu").forEach((m) => {
      if (m !== menu) m.hidden = true;
    });
    menu.hidden = false;
    openBtn.setAttribute("aria-expanded", "true");
  }

  function toggleMenu() {
    const willOpen = menu.hidden;
    if (willOpen) openMenu();
    else closeMenu();
  }

  openBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // clicar no "row" alterna tema
  if (rowBtn) {
    rowBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleTheme();
    });
  }

  // switch alterna tema
  if (sw) {
    sw.addEventListener("click", (e) => e.stopPropagation());
    sw.addEventListener("change", () => toggleTheme());
  }

  // impedir clique dentro do menu fechar ele
  menu.addEventListener("click", (e) => e.stopPropagation());

  // fechar clicando fora
  document.addEventListener("click", (e) => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== openBtn) closeMenu();
  });

  // fechar ao rolar / ESC
  window.addEventListener("scroll", closeMenu, { passive: true });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

// Header settings
setupSettingsMenu({
  openBtnId: "openSettingsHeader",
  menuId: "settingsMenuHeader",
  rowBtnId: "themeRowBtnHeader",
  switchId: "themeSwitchHeader",
});

// Mobile settings
setupSettingsMenu({
  openBtnId: "openSettingsMobile",
  menuId: "settingsMenuMobile",
  rowBtnId: "themeRowBtnMobile",
  switchId: "themeSwitchMobile",
});

// =====================
// Mobile menu
// =====================
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const willOpen = mobileMenu.hidden;
    mobileMenu.hidden = !willOpen;
    menuBtn.setAttribute("aria-expanded", String(willOpen));
  });

  // Fecha ao clicar em A ou BUTTON, EXCETO o botão de abrir configurações (senão fecha antes de abrir)
  mobileMenu.addEventListener("click", (e) => {
    const el = e.target;
    if (!el) return;

    const clickedSettings =
      el.id === "openSettingsMobile" || el.closest?.("#openSettingsMobile");

    if (clickedSettings) return; // não fecha

    if (el.tagName === "A" || el.tagName === "BUTTON") {
      mobileMenu.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// =====================
// Back to top button (always works)
// =====================
const toTopBtn = document.getElementById("toTopBtn");

function updateToTopVisibility() {
  if (!toTopBtn) return;
  const show = window.scrollY > 500;
  toTopBtn.classList.toggle("is-show", show);
}

if (toTopBtn) {
  toTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("scroll", updateToTopVisibility, { passive: true });
updateToTopVisibility();

// =====================
// Scroll progress bar
// =====================
const scrollBar = document.getElementById("scrollBar");

function updateScrollBar() {
  if (!scrollBar) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollBar.style.width = pct.toFixed(2) + "%";
}

document.addEventListener("scroll", updateScrollBar, { passive: true });
updateScrollBar();

// =====================
// Reveal animations (entrada/saída)
// =====================
const reveals = Array.from(document.querySelectorAll(".reveal"));
let lastY = window.scrollY;

const io = new IntersectionObserver(
  (entries) => {
    const dirDown = window.scrollY >= lastY;
    lastY = window.scrollY;

    for (const entry of entries) {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add("is-in");
        el.classList.remove("is-out-up", "is-out-down");
      } else {
        el.classList.remove("is-in");
        el.classList.add(dirDown ? "is-out-up" : "is-out-down");
      }
    }
  },
  { threshold: 0.12 }
);

reveals.forEach((el) => io.observe(el));

// =====================
// Auth dialog (login / register)
// (SEM settings aqui dentro)
// =====================
const authDialog = document.getElementById("authDialog");
const openAuth = document.getElementById("openAuth");
const openAuthMobile = document.getElementById("openAuthMobile");
const openAuthHero = document.getElementById("openAuthHero");
const openAuthSimulados = document.getElementById("openAuthSimulados");
const openAuthCta = document.getElementById("openAuthCta");
const closeAuth = document.getElementById("closeAuth");

function showAuth() {
  if (!authDialog) return;
  authDialog.showModal();
}
function hideAuth() {
  if (!authDialog) return;
  authDialog.close();
}

[openAuth, openAuthMobile, openAuthHero, openAuthSimulados, openAuthCta].forEach(
  (btn) => {
    if (btn) btn.addEventListener("click", showAuth);
  }
);

document.querySelectorAll("[data-open-auth='true']").forEach((btn) => {
  btn.addEventListener("click", showAuth);
});

if (closeAuth) closeAuth.addEventListener("click", hideAuth);

if (authDialog) {
  const panel = authDialog.querySelector(".auth__panel");

  // Segurança extra: clique dentro do painel nunca fecha
  if (panel) {
    panel.addEventListener("click", (e) => e.stopPropagation());
  }

  // ✅ Fecha SOMENTE quando clicar no backdrop (fora do painel)
  authDialog.addEventListener("click", (e) => {
    // Se clicou no próprio <dialog> (o "fundo"), fecha
    if (e.target === authDialog) hideAuth();
  });
}

// Tabs
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const loginPane = document.getElementById("loginPane");
const registerPane = document.getElementById("registerPane");

function setAuthTab(which) {
  if (!tabLogin || !tabRegister || !loginPane || !registerPane) return;
  const isLogin = which === "login";
  tabLogin.classList.toggle("is-active", isLogin);
  tabRegister.classList.toggle("is-active", !isLogin);
  loginPane.classList.toggle("is-active", isLogin);
  registerPane.classList.toggle("is-active", !isLogin);
}

if (tabLogin) tabLogin.addEventListener("click", () => setAuthTab("login"));
if (tabRegister) tabRegister.addEventListener("click", () => setAuthTab("register"));

// Actions (mock)
const doLogin = document.getElementById("doLogin");
if (doLogin) {
  doLogin.addEventListener("click", () => {
    alert("Login (mockup): conecte ao seu backend depois.");
    hideAuth();
  });
}

const doRegister = document.getElementById("doRegister");
if (doRegister) {
  doRegister.addEventListener("click", () => {
    const plan = document.querySelector("input[name='plan']:checked")?.value || "free";

    if (plan === "free") {
      alert("Conta criada (mockup) no plano Gratuito!");
      hideAuth();
      return;
    }

    window.location.href = `pagamento.html?plano=${encodeURIComponent(plan)}`;
  });
}

// =====================
// Footer year
// =====================
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// =====================
// Theme init + system changes
// =====================
initTheme();

// Se o usuário ainda NÃO escolheu manualmente, reage a mudança do sistema
const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
if (mq) {
  mq.addEventListener("change", () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (!saved) applyTheme(getPreferredThemeFromBrowser());
  });
}

// =====================
// Show / Hide password (eye / eye-slash SVG)
// =====================
const PASS_ICONS = {
  hide: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M2.1 12s3.6-7 9.9-7 9.9 7 9.9 7-3.6 7-9.9 7S2.1 12 2.1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  show: `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M10.7 10.7a3.2 3.2 0 0 0 4.6 4.6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.5 6.6C4 8.5 2.1 12 2.1 12s3.6 7 9.9 7c2 0 3.8-.5 5.2-1.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13.5 5.2c5.2.8 8.4 6.8 8.4 6.8s-.9 1.8-2.6 3.7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
};

function setPassIcon(btn, state) {
  const holder = btn.querySelector(".pass__ic");
  if (!holder) return;

  // state: "hidden" => senha escondida => mostrar ícone de "olho"
  // state: "shown"  => senha aparecendo => mostrar ícone "olho cortado"
  holder.innerHTML = state === "shown" ? PASS_ICONS.hide : PASS_ICONS.show;
  btn.dataset.passState = state;
  btn.setAttribute("aria-label", state === "shown" ? "Ocultar senha" : "Mostrar senha");
}

function setupPasswordToggles() {
  document.querySelectorAll("[data-toggle-pass]").forEach((btn) => {
    // inicializa ícone certo
    setPassIcon(btn, btn.dataset.passState || "hidden");

    btn.addEventListener("click", () => {
      const inputId = btn.getAttribute("data-toggle-pass");
      const input = document.getElementById(inputId);
      if (!input) return;

      const willShow = input.type === "password";
      input.type = willShow ? "text" : "password";

      setPassIcon(btn, willShow ? "shown" : "hidden");
    });
  });
}

setupPasswordToggles();