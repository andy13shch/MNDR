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
  '<svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>';

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
    aboutLead: "Developer who builds software with intent — clean interfaces, honest engineering, and a soft spot for the details nobody asks about.",
    aboutBio1: "I work across the stack: from pixel-precise frontends to the tooling that keeps them alive. Most of my projects start as a small obsession and end up as something I actually use every day.",
    aboutBio2: "When I'm not shipping, I'm usually digging into generative graphics, motion, or whatever weird corner of the web caught my attention this week.",
    aboutBased: "Earth, mostly",
    aboutFocus: "Web · Tooling · Graphics",
    aboutStack: "JS · TS · Python",
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
    footerNote: "Спроектировано и собрано вручную.",
    about: "ОБО МНЕ",
    nav5: "ОБО МНЕ",
    aboutLead: "Разработчик, который создаёт софт с умыслом — чистые интерфейсы, честный код и любовь к деталям, о которых никто не просит.",
    aboutBio1: "Работаю по всему стеку: от пиксельно-точных фронтендов до инструментов, которые держат их в живых. Большинство проектов начинаются с маленькой идеи-фикс и заканчиваются чем-то, чем я пользуюсь каждый день.",
    aboutBio2: "Когда не пишу код, обычно копаюсь в генеративной графике, анимации или в очередном странном уголке веба, который приглянулся на этой неделе.",
    aboutBased: "Земля, в основном",
    aboutFocus: "Веб · Инструменты · Графика",
    aboutStack: "JS · TS · Python",
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
  followIcon.textContent = "@";
  followCard.append(followIcon);
  followCard.append(makeMini(t("followLbl"), user.followers || 0));

  minis.append(followCard);

  let memberCard = null;
  if (user.created_at) {
    memberCard = el("div", "stat-card stat-mini stat-member");
    const mIcon = el("div", "stat-icon mono");
    mIcon.innerHTML =
      '<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.55v6.7c0 .14.11.25.25.25h10.5c.14 0 .25-.11.25-.25v-6.7Z"/></svg>';
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
    if (window.DitherArt) DitherArt.apply(projBox);
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
