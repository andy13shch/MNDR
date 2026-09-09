const GITHUB_USER = "andy13shch";

let memberDateCanvas = null;
let memberDateText = "";

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Java: "#b07219",
  Go: "#00add8",
  Rust: "#dea584",
  Kotlin: "#a97bff",
  Swift: "#f05138",
  PHP: "#4f5d95",
  Ruby: "#701516",
  Shell: "#89e051",
  Vue: "#41b883",
  Dart: "#00b4ab",
  Lua: "#000080",
  SCSS: "#c6538c",
  Svelte: "#ff3e00",
  Zig: "#ec915c",
};

const FORK_SVG =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>';
const ACCOUNT_ADD_SVG =
  '<svg class="acc-add-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true"><path class="aa-body" pathLength="22" d="M3 21v-1c0 -2.21 1.79 -4 4 -4h4c2.21 0 4 1.79 4 4v1"/><path class="aa-head" pathLength="22" d="M9 13c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3Z"/><path class="aa-plus-h" pathLength="8" d="M15 6h6"/><path class="aa-plus-v" pathLength="8" d="M18 3v6"/></svg>';
const CALENDAR_SVG =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>';

const PREVIEW_OVERRIDES = {};

const I18N = {
  en: {
    greeting: "HI, I'M",
    tagline: "Developer.<br>I build projects with love.",
    stats: "STATISTICS",
    projects: "PROJECTS",
    loading: "Loading projects…",
    errEmpty: "No public repositories yet.",
    errFail: "Couldn't load GitHub data.",
    noDesc: "No description.",
    updated: "updated",
    units: { m: "m", h: "h", d: "d", w: "w", mo: "mo", y: "y" },
    codeLbl: "CODE",
    visitLbl: "VISIT",
    starsLbl: "STARS",
    starsCap: "Total stars collected across public repositories on GitHub.",
    projLbl: "PROJECTS",
    reposLbl: "REPOSITORIES",
    followLbl: "FOLLOWERS",
    memberLbl: "ON GITHUB SINCE",
    nav1: "HOME",
    nav2: "STATS",
    nav3: "PROJECTS",
    nav4: "CONTACT",
    rights: "All rights reserved.",
    footerNote: "Designed & built with nothing extra.",
    about: "ABOUT",
    nav5: "ABOUT",
    aboutCard1Title: "Programming & AI",
    aboutCard1A: "Building web and desktop projects with Python, Flask, React and Vite — powered by AI.",
    aboutCard1B: "Exploring practical AI: running local LLMs, integrating neural networks into daily workflows.",
    aboutCard1C: "Writing scripts to automate third-party interfaces (e.g. automotive diagnostic software).",
    aboutCard2Title: "Hardware & DIY Engineering",
    aboutCard2A: "Diagnosing, repairing and configuring computer hardware.",
    aboutCard2B: "Building PCs for personal use.",
    aboutCard2C: "DIY projects: designing circuits for ESP32 microcontrollers.",
    aboutCard2D: "Device jailbreaking — Apple, Nintendo, Android phones and more.",
    aboutCard3Title: "Games & Administration",
    aboutCard3A: "Running a personal Minecraft server for playing with friends.",
    aboutCard3B: "Writing interaction logic via KubeJS, working with command blocks, configuring mod architecture.",
    aboutBased: "Earth, mostly",
    aboutStack: "Python · Flask · React · Vite",
    aboutAI: "Local LLMs · Neural Networks",
    aboutHardware: "ESP32 · Diagnostics",
    aboutStatus: "Open to work",
    statusIdle: "Available for work",
    statusDone: "Email copied",
  },
  ru: {
    greeting: "ПРИВЕТ, Я",
    tagline: "Разработчик.<br>Делаю проекты с любовью.",
    stats: "СТАТИСТИКА",
    projects: "ПРОЕКТЫ",
    loading: "Загрузка проектов…",
    errEmpty: "Публичных репозиториев пока нет.",
    errFail: "Не удалось загрузить данные GitHub.",
    noDesc: "Без описания.",
    updated: "обновлено",
    units: { m: "мин", h: "ч", d: "д", w: "нед", mo: "мес", y: "г" },
    codeLbl: "КОД",
    visitLbl: "ОТКРЫТЬ",
    starsLbl: "ЗВЁЗДЫ",
    starsCap: "Суммарно звёзд на публичных репозиториях GitHub.",
    projLbl: "ПРОЕКТЫ",
    reposLbl: "РЕПОЗИТОРИИ",
    followLbl: "ПОДПИСЧИКИ",
    memberLbl: "НА GITHUB С",
    nav1: "ГЛАВНАЯ",
    nav2: "СТАТИСТИКА",
    nav3: "ПРОЕКТЫ",
    nav4: "КОНТАКТЫ",
    rights: "Все права защищены.",
    footerNote: "Спроектировано и создано без лишнего.",
    about: "ОБО МНЕ",
    nav5: "ОБО МНЕ",
    aboutCard1Title: "Программирование и ИИ",
    aboutCard1A: "Разрабатываю веб- и десктопные проекты, используя Python, Flask, React и Vite с помощью ИИ.",
    aboutCard1B: "Изучаю практическое применение ИИ, запуск локальных языковых моделей и интеграцию нейросетей в повседневную рутину.",
    aboutCard1C: "Пишу скрипты для автоматизации работы сторонних интерфейсов (например, для взаимодействия с автомобильным диагностическим ПО).",
    aboutCard2Title: "Аппаратное обеспечение и DIY-инженерия",
    aboutCard2A: "Занимаюсь диагностикой, ремонтом и настройкой железа.",
    aboutCard2B: "Собираю ПК для личного пользования.",
    aboutCard2C: "Увлекаюсь DIY-проектами: создания схем для микроконтроллеров ESP32.",
    aboutCard2D: "Джейлбрейк устройств — Apple, Nintendo, Android-смартфоны и не только.",
    aboutCard3Title: "Игры и администрирование",
    aboutCard3A: "Держу и настраиваю собственный сервер Minecraft для игр с друзьями.",
    aboutCard3B: "Прописываю логику взаимодействия через KubeJS, работаю с командными блоками и настраиваю архитектуру модов.",
    aboutBased: "Земля, в основном",
    aboutStack: "Python · Flask · React · Vite",
    aboutAI: "Локальные LLM · Нейросети",
    aboutHardware: "ESP32 · Диагностика",
    aboutStatus: "Открыт к предложениям",
    statusIdle: "Открыт к предложениям",
    statusDone: "Почта скопирована",
  },
};

let lang = localStorage.getItem("lang") || "en";
if (!I18N[lang]) lang = "en";

function t(key) {
  return I18N[lang][key];
}

function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll(".lang-switch button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
}

document.querySelectorAll(".lang-switch button").forEach((b) => {
  b.addEventListener("click", () => {
    const next = b.dataset.lang;
    if (!I18N[next] || next === lang) return;
    lang = next;
    localStorage.setItem("lang", lang);
    applyI18n();
    loadAll();
  });
});

applyI18n();

document.getElementById("year").textContent = new Date().getFullYear();

function el(tag, cls) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  return node;
}

function relTime(dateStr) {
  const s = Math.max(0, (Date.now() - new Date(dateStr)) / 1000);
  const u = I18N[lang].units;
  if (s < 3600) return Math.floor(s / 60) + u.m;
  if (s < 86400) return Math.floor(s / 3600) + u.h;
  if (s < 604800) return Math.floor(s / 86400) + u.d;
  if (s < 2592000) return Math.floor(s / 604800) + u.w;
  if (s < 31536000) return Math.floor(s / 2592000) + u.mo;
  return Math.floor(s / 31536000) + u.y;
}

function formatNum(n) {
  return n.toLocaleString(lang === "ru" ? "ru-RU" : "en-US");
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches;

function animateValue(node, target, dur = 1100) {
  const isCanvas = node.tagName === "CANVAS" && window.DotFont;
  const paint = (v) => {
    if (isCanvas) {
      DotFont.render(node, String(v), { pitch: +node.dataset.pitch || 6 });
    } else {
      node.textContent = formatNum(v);
    }
  };
  if (reducedMotion) {
    paint(target);
    return;
  }
  const startT = performance.now();
  function step(now) {
    const p = Math.min(1, (now - startT) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    paint(Math.round(target * e));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function armStatAnimations(scope) {
  const run = () => {
    scope.querySelectorAll("[data-count]").forEach((v) => {
      animateValue(v, +v.dataset.count);
    });
    scope.querySelectorAll(".bars i").forEach((b, i) => {
      setTimeout(() => {
        b.style.height = b.dataset.h + "%";
      }, i * 45);
    });
  };
  if (reducedMotion || !("IntersectionObserver" in window)) {
    run();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      io.disconnect();
      run();
    },
    { threshold: 0.3 }
  );
  io.observe(scope);
}

function renderStats(user, repos) {
  const box = document.getElementById("stats");
  box.innerHTML = "";

  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const top = repos
    .slice()
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 8);
  const max = Math.max(1, ...top.map((r) => r.stargazers_count));

  const primary = el("div", "stat-card stat-primary");
  primary.append(el("div", "stat-hatch"));

  const chip = el("span", "stat-chip mono");
  chip.textContent = t("starsLbl");

  const val = document.createElement("canvas");
  val.className = "stat-value";
  val.dataset.count = totalStars;
  val.dataset.pitch = "8";
  if (window.DotFont) DotFont.render(val, "0", { pitch: 8 });

  const cap = el("p", "stat-caption");
  cap.textContent = t("starsCap");

  primary.append(chip, val, cap);

  const barsCard = el("div", "stat-card stat-bars-tile");
  const barsRow = el("div", "stat-row");
  const barsLbl = el("p", "stat-label mono");
  barsLbl.textContent = t("projLbl");

  const barsNum = document.createElement("canvas");
  barsNum.className = "stat-num";
  barsNum.dataset.count = repos.length;
  barsNum.dataset.pitch = "4";
  if (window.DotFont) DotFont.render(barsNum, "0", { pitch: 4 });

  barsRow.append(barsLbl, barsNum);

  const bars = el("div", "bars");
  top.forEach((r) => {
    const bar = el("i");
    bar.dataset.h = Math.max(12, Math.round((r.stargazers_count / max) * 100));
    bars.append(bar);
  });

  barsCard.append(barsRow, bars);

  const minis = el("div", "stat-minis");

  const followCard = el("div", "stat-card stat-mini");
  const followIcon = el("div", "stat-icon mono");
  followIcon.innerHTML = ACCOUNT_ADD_SVG;
  followCard.append(followIcon);
  followCard.append(makeMini(t("followLbl"), user.followers || 0));

  minis.append(followCard);

  let memberCard = null;
  if (user.created_at) {
    memberCard = el("div", "stat-card stat-mini stat-member");
  const mIcon = el("div", "stat-icon mono");
  mIcon.innerHTML = CALENDAR_SVG;
  memberCard.append(mIcon);

    const d = new Date(user.created_at);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dateText = `${mm}.${d.getFullYear()}`;

    const lbl = el("p", "stat-label mono");
    lbl.textContent = t("memberLbl");

    if (window.DotFont) {
      const dateCanvas = document.createElement("canvas");
      dateCanvas.className = "stat-date";
      DotFont.render(dateCanvas, dateText, { pitch: 6 });
      memberCard.append(mIcon, lbl, dateCanvas);
      memberDateCanvas = dateCanvas;
      memberDateText = dateText;
    } else {
      const date = el("p", "stat-date mono");
      date.textContent = dateText;
      memberCard.append(mIcon, lbl, date);
    }
  }

  box.append(primary, barsCard, minis);
  if (memberCard) box.append(memberCard);
  armStatAnimations(box);
}

function makeMini(label, count) {
  const wrap = el("div");
  const lbl = el("p", "stat-label mono");
  lbl.textContent = label;
  const num = document.createElement("canvas");
  num.className = "stat-num";
  num.dataset.count = count;
  num.dataset.pitch = "4";
  if (window.DotFont) DotFont.render(num, "0", { pitch: 4 });
  wrap.append(lbl, num);
  return wrap;
}

async function loadAll() {
  const statsBox = document.getElementById("stats");
  const projBox = document.getElementById("projects");
  if (!statsBox && !projBox) return;

  if (window.DotFont && DotFont.clearRegistry) DotFont.clearRegistry();

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
    ]);
    if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");

    const [user, repos] = await Promise.all([userRes.json(), reposRes.json()]);
    statsBox.innerHTML = "";
    projBox.innerHTML = "";
    projBox.classList.add("bento");

    const visible = repos
      .filter((r) => !r.fork)
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          new Date(b.pushed_at) - new Date(a.pushed_at)
      )
      .slice(0, 8);

    if (visible.length === 0) {
      projBox.innerHTML = `<p class="error">${t("errEmpty")}</p>`;
      return;
    }

    renderStats(user, visible);
    renderProjects(visible);
  } catch {
    statsBox.innerHTML = "";
    projBox.innerHTML = `<p class="error">${t("errFail")}</p>`;
  }
}

function renderProjects(visible) {
  const container = document.getElementById("projects");

  const isSite = (repo) => !!(repo.homepage || PREVIEW_OVERRIDES[repo.name]);
  const anySite = visible.some(isSite);
  const featuredFallback =
    visible.length >= 5 ? 2 : visible.length >= 3 ? 1 : 0;

  visible.forEach((repo, idx) => {
    const card = el("div", "project");

    const ghUrl = repo.html_url;
    const override = PREVIEW_OVERRIDES[repo.name];
    const demoUrl = override?.demo
      ? override.demo
      : repo.homepage
        ? repo.homepage.startsWith("http")
          ? repo.homepage
          : `https://${repo.homepage}`
        : null;

    if (demoUrl || (!anySite && idx < featuredFallback)) {
      card.classList.add("featured");
    }

    const mediaLink = el("a", "tile-media-link");
    mediaLink.href = demoUrl || ghUrl;
    mediaLink.target = "_blank";
    mediaLink.rel = "noopener";

    const media = el("div", "tile-media");
    media.dataset.letter = (repo.name[0] || "?").toUpperCase();

    let src = null;
    if (override?.img) {
      src = override.img;
    } else if (demoUrl) {
      src = `https://s0.wp.com/mshots/v1/${encodeURIComponent(demoUrl)}?w=900`;
    }

    if (src) {
      const img = new Image();
      img.loading = "lazy";
      img.alt = repo.name;
      img.src = src;
      img.addEventListener("error", () => {
        img.remove();
        media.classList.add("noimg");
      });
      media.append(img);
    } else {
      media.classList.add("noimg");
    }

    const num = el("span", "tile-num mono");
    num.textContent = String(idx + 1).padStart(2, "0");

    const led = el("span", "project-led dotm");
    for (let d = 0; d < 9; d++) led.append(el("i"));

    media.append(num, led);
    mediaLink.append(media);
    card.append(mediaLink);

    const body = el("div", "tile-body");

    const eyebrow = el("span", "tile-eyebrow mono");
    eyebrow.textContent = String(idx + 1).padStart(2, "0");

    const head = el("div", "tile-head");

  const name = el("span", "project-name mono shiny");
  name.textContent = repo.name;

    const stars = el("span", "project-stars mono");
    stars.textContent =
      repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : "";

    head.append(name, stars);

    const desc = el("p", "tile-desc");
    desc.textContent = repo.description || t("noDesc");

    const meta = el("div", "tile-meta mono");
    const parts = [];

    if (repo.language) {
      const langEl = el("span", "meta-lang");
      const dot = el("span", "lang-dot");
      dot.style.background = LANG_COLORS[repo.language] || "#7c7c85";
      langEl.append(dot, document.createTextNode(repo.language));
      parts.push(langEl);
    }

    if (repo.forks_count > 0) {
      const fork = el("span", "meta-fork");
      fork.innerHTML = `${FORK_SVG}<span>${repo.forks_count}</span>`;
      parts.push(fork);
    }

    const upd = el("span", "meta-upd");
    upd.textContent = `${t("updated")} ${relTime(repo.pushed_at)}`;
    parts.push(upd);

    parts.forEach((p, i) => {
      if (i > 0) {
        const sep = el("span", "meta-sep");
        sep.textContent = "·";
        meta.append(sep);
      }
      meta.append(p);
    });

    const actions = el("div", "tile-actions");

    const codeBtn = el("a", "tile-btn mono");
    codeBtn.href = ghUrl;
    codeBtn.target = "_blank";
    codeBtn.rel = "noopener";
    codeBtn.textContent = `${t("codeLbl")} ↗`;
    actions.append(codeBtn);

    if (demoUrl) {
      const visitBtn = el("a", "tile-btn tile-btn--accent mono");
      visitBtn.href = demoUrl;
      visitBtn.target = "_blank";
      visitBtn.rel = "noopener";
      visitBtn.textContent = `${t("visitLbl")} ↗`;
      actions.append(visitBtn);
    }

    body.append(eyebrow, head, desc, meta, actions);
    card.append(body);

    container.append(card);
  });
}

loadAll().finally(scrollToHash);

function scrollToHash() {
  if (location.hash && location.hash.length > 1) {
    const target = document.querySelector(location.hash);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }
}
window.addEventListener("load", scrollToHash);

const statusBtn = document.getElementById("statusBtn");
if (statusBtn) {
  statusBtn.addEventListener("click", async () => {
    if (statusBtn.dataset.status !== "idle") return;
    statusBtn.dataset.status = "loading";
    try {
      await navigator.clipboard.writeText("andy13shch@gmail.com");
    } catch (e) {}
    setTimeout(() => {
      statusBtn.dataset.status = "success";
      setTimeout(() => {
        statusBtn.dataset.status = "idle";
      }, 1600);
    }, 900);
  });
}

// Dot matrix circular sweep for status button
(function initStatusDotMatrix() {
  const canvas = document.querySelector(".sb-dot");
  if (!canvas || canvas.tagName !== "CANVAS") return;

  const grid = 5;
  const cell = 18 / grid;
  const dotR = cell * 0.35;
  const cx = grid / 2;
  const cy = grid / 2;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 18 * dpr;
  canvas.height = 18 * dpr;
  canvas.style.width = "18px";
  canvas.style.height = "18px";

  const ctx = canvas.getContext("2d");

  const BASE = 0.14;
  const SWEEP = 1.0;
  const NEAR = 0.52;
  const RING = 0.35;
  const IDLE_DELAY = 0;

  let phase = 0;
  let raf;
  let lastTime = 0;
  let lastActivity = Date.now();
  let sweeping = false;

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#d71921";
  }

  function onActivity() {
    lastActivity = Date.now();
    sweeping = false;
    phase = 0;
  }

  document.addEventListener("mousemove", onActivity);
  document.addEventListener("keydown", onActivity);
  document.addEventListener("touchstart", onActivity);

  function draw(ts) {
    const btn = canvas.closest(".status-btn");
    if (!btn || btn.dataset.status !== "idle") {
      raf = requestAnimationFrame(draw);
      return;
    }

    const dt = lastTime ? (ts - lastTime) / 1000 : 0;
    lastTime = ts;

    if (!sweeping && Date.now() - lastActivity >= IDLE_DELAY) {
      sweeping = true;
    }

    if (sweeping) {
      phase = (phase + dt * 0.55) % 1;
    } else {
      phase = 0;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, 18, 18);

    const accent = getAccent();
    const theta = phase * Math.PI * 2;
    const sweepX = Math.cos(theta);
    const sweepY = Math.sin(theta);

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        const dx = c - cx;
        const dy = r - cy;
        const radius = Math.hypot(dx, dy);
        if (radius > 2.0) continue;

        const projection = dx * sweepX + dy * sweepY;
        const perpendicular = Math.abs(dx * sweepY - dy * sweepX);

        let opacity;
        if (radius < 0.5) {
          opacity = 0.78;
        } else if (projection > 0.3 && perpendicular < 0.55) {
          opacity = SWEEP;
        } else if (projection > 0 && perpendicular < 1.15) {
          opacity = NEAR;
        } else if (radius > 1.6 && radius < 2.0) {
          opacity = RING;
        } else {
          opacity = BASE;
        }

        ctx.globalAlpha = opacity;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(c * cell + cell / 2, r * cell + cell / 2, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
})();

const glowStates = new WeakMap();
let glowX = -1e4;
let glowY = -1e4;
let glowRaf = null;

function glowTick() {
  const cards = document.querySelectorAll(
    ".project, .stat-card, .tile-media-link, .tile-btn, .tile-meta"
  );
  const rects = [];
  cards.forEach((card) => rects.push(card.getBoundingClientRect()));

  let active = false;
  cards.forEach((card, i) => {
    let s = glowStates.get(card);
    if (!s) {
      s = { x: glowX - rects[i].left, y: glowY - rects[i].top };
      glowStates.set(card, s);
    }
    const tx = glowX - rects[i].left;
    const ty = glowY - rects[i].top;
    s.x += (tx - s.x) * 0.16;
    s.y += (ty - s.y) * 0.16;
    if (Math.abs(tx - s.x) > 0.4 || Math.abs(ty - s.y) > 0.4) active = true;
    card.style.setProperty("--mx", `${s.x.toFixed(1)}px`);
    card.style.setProperty("--my", `${s.y.toFixed(1)}px`);
  });

  glowRaf = active ? requestAnimationFrame(glowTick) : null;
}

document.addEventListener(
  "pointermove",
  (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
    if (!glowRaf) glowRaf = requestAnimationFrame(glowTick);
  },
  { passive: true }
);

(function initThemeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  function sync() {
    const isLight = root.classList.contains("light");
    btn.setAttribute("aria-pressed", String(isLight));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isLight ? "#f4f4f5" : "#0a0a0b");
  }
  sync();

  function apply(next) {
    root.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch (e) {}
    document.dispatchEvent(new Event("themechange"));
    sync();
  }

  btn.addEventListener("click", () => {
    const goLight = !root.classList.contains("light");
    if (document.startViewTransition) {
      document.startViewTransition(() => apply(goLight));
    } else {
      apply(goLight);
    }
  });

  document.addEventListener("themechange", () => {
    if (window.DotFont && DotFont.refresh) DotFont.refresh();
  });
})();
