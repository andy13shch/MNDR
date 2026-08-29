(function () {
  const host = document.getElementById("dotgrid");
  if (!host || typeof gsap === "undefined") return;
  if (window.InertiaPlugin) gsap.registerPlugin(InertiaPlugin);

  const cfg = {
    dotSize: 1.7,
    gap: 24,
    baseColor: "#404048",
    activeColor: "#ffffff",
    proximity: 150,
    speedTrigger: 90,
    shockRadius: 240,
    shockStrength: 4,
    maxSpeed: 5000,
    resistance: 750,
    returnDuration: 1.4,
    throttleMs: 40,
  };

  let ready = false;
  function readThemeColors() {
    const cs = getComputedStyle(document.documentElement);
    cfg.baseColor = cs.getPropertyValue("--dot-base").trim() || cfg.baseColor;
    cfg.activeColor = cs.getPropertyValue("--dot-active").trim() || cfg.activeColor;
    if (ready) draw();
  }
  readThemeColors();
  document.addEventListener("themechange", readThemeColors);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const wrap = document.createElement("div");
  wrap.className = "dotgrid-wrap";
  const canvas = document.createElement("canvas");
  canvas.className = "dotgrid-canvas";
  wrap.append(canvas);
  host.append(wrap);

  const ctx = canvas.getContext("2d");

  function hexToRgb(hex) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16),
    };
  }

  let dots = [];
  let W = 0;
  let H = 0;

  function build() {
    const rect = wrap.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cell = cfg.dotSize + cfg.gap;
    const cols = Math.max(1, Math.floor((W + cfg.gap) / cell));
    const rows = Math.max(1, Math.floor((H + cfg.gap) / cell));
    const gridW = cell * cols - cfg.gap;
    const gridH = cell * rows - cfg.gap;
    const startX = (W - gridW) / 2 + cfg.dotSize / 2;
    const startY = (H - gridH) / 2 + cfg.dotSize / 2;

    dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xo: 0,
          yo: 0,
          busy: false,
          jPhase: (Math.random() - 0.5) * 1.5,
          jAmp: 0.75 + Math.random() * 0.45,
        });
      }
    }
  }

  build();

  let roTimer = null;
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => {
      clearTimeout(roTimer);
      roTimer = setTimeout(build, 150);
    }).observe(wrap);
  } else {
    window.addEventListener("resize", () => {
      clearTimeout(roTimer);
      roTimer = setTimeout(build, 150);
    });
  }

  function push(dot, px, py, vx, vy) {
    dot.busy = true;
    const pushX = dot.cx - px + vx * 0.005;
    const pushY = dot.cy - py + vy * 0.005;

    const settle = () => {
      gsap.to(dot, {
        xo: 0,
        yo: 0,
        duration: cfg.returnDuration,
        ease: "elastic.out(1,0.75)",
        onComplete: () => {
          dot.busy = false;
        },
      });
    };

    if (window.InertiaPlugin) {
      gsap.killTweensOf(dot);
      gsap.to(dot, {
        inertia: { xOffset: pushX, yOffset: pushY, resistance: cfg.resistance },
        onComplete: settle,
      });
    } else {
      gsap.killTweensOf(dot);
      gsap.to(dot, {
        xo: pushX,
        yo: pushY,
        duration: 0.18,
        ease: "power2.out",
        onComplete: settle,
      });
    }
  }

  function shock(dot, cx, cy) {
    dot.busy = true;
    const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
    const f = Math.max(0, 1 - dist / cfg.shockRadius);
    const pushX = (dot.cx - cx) * cfg.shockStrength * f;
    const pushY = (dot.cy - cy) * cfg.shockStrength * f;

    const settle = () => {
      gsap.to(dot, {
        xo: 0,
        yo: 0,
        duration: cfg.returnDuration,
        ease: "elastic.out(1,0.75)",
        onComplete: () => {
          dot.busy = false;
        },
      });
    };

    if (window.InertiaPlugin) {
      gsap.killTweensOf(dot);
      gsap.to(dot, {
        inertia: { xOffset: pushX, yOffset: pushY, resistance: cfg.resistance },
        onComplete: settle,
      });
    } else {
      gsap.killTweensOf(dot);
      gsap.to(dot, {
        xo: pushX,
        yo: pushY,
        duration: 0.18,
        ease: "power2.out",
        onComplete: settle,
      });
    }
  }

  const pointer = { x: -99999, y: -99999 };
  const pointerClient = { x: -99999, y: -99999 };
  let lastT = 0;
  let lastX = 0;
  let lastY = 0;
  let throttleUntil = 0;
  let idleAmt = 0;
  let inHeroPrev = false;
  let leftHeroAt = 0;
  const WAVE_DELAY = 1750;

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x <= W && y <= H;
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      const now = performance.now();
      if (now < throttleUntil) return;
      throttleUntil = now + cfg.throttleMs;
      pointerClient.x = e.clientX;
      pointerClient.y = e.clientY;

      const dt = lastT ? now - lastT : 16;
      let vx = ((e.clientX - lastX) / dt) * 1000;
      let vy = ((e.clientY - lastY) / dt) * 1000;
      const sp = Math.hypot(vx, vy);
      if (sp > cfg.maxSpeed) {
        const s = cfg.maxSpeed / sp;
        vx *= s;
        vy *= s;
      }
      lastT = now;
      lastX = e.clientX;
      lastY = e.clientY;

      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      if (!inBounds(px, py)) {
        pointer.x = -99999;
        pointer.y = -99999;
        return;
      }
      pointer.x = px;
      pointer.y = py;

      if (reduced || sp <= cfg.speedTrigger) return;

      for (const dot of dots) {
        const dist = Math.hypot(dot.cx - px, dot.cy - py);
        if (dist < cfg.proximity && !dot.busy) {
          push(dot, px, py, vx, vy);
        }
      }
    },
    { passive: true }
  );

  window.addEventListener("click", (e) => {
    if (reduced) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    if (!inBounds(cx, cy)) return;
    for (const dot of dots) {
      const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
      if (dist < cfg.shockRadius && !dot.busy) {
        shock(dot, cx, cy);
      }
    }
  });

  function draw() {
    const now = performance.now();
    const tSec = now / 1000;

    if (!reduced) {
      const rect = canvas.getBoundingClientRect();
      const inHero =
        pointerClient.x >= rect.left &&
        pointerClient.x <= rect.right &&
        pointerClient.y >= rect.top &&
        pointerClient.y <= rect.bottom;
      if (!inHero && inHeroPrev) leftHeroAt = now;
      inHeroPrev = inHero;
      const target =
        !inHero && now - leftHeroAt > WAVE_DELAY ? 1 : 0;
      idleAmt += (target - idleAmt) * 0.03;
      if (idleAmt < 0.001 && target === 0) idleAmt = 0;
    }

    ctx.clearRect(0, 0, W, H);
    const baseRgb = hexToRgb(cfg.baseColor);
    const actRgb = hexToRgb(cfg.activeColor);
    const proxSq = cfg.proximity * cfg.proximity;

    for (const dot of dots) {
      let ox = dot.cx + dot.xo;
      let oy = dot.cy + dot.yo;
      const dx = dot.cx - pointer.x;
      const dy = dot.cy - pointer.y;
      const dsq = dx * dx + dy * dy;
      let glowT = dsq <= proxSq ? 1 - Math.sqrt(dsq) / cfg.proximity : 0;

      if (idleAmt > 0) {
        const ph =
          (dot.cx * 0.9 + dot.cy) * 0.012 -
          tSec * 2.2 +
          dot.jPhase +
          Math.sin(tSec * 0.9 + dot.cx * 0.004 + dot.cy * 0.005) * 0.45;
        const w = Math.max(0, Math.sin(ph));
        const k = Math.min(1, w * w * idleAmt * dot.jAmp);
        glowT = Math.max(glowT, k * 0.7);
        oy -= w * 2.5 * idleAmt * dot.jAmp;
      }

      const r = Math.round(baseRgb.r + (actRgb.r - baseRgb.r) * glowT);
      const g = Math.round(baseRgb.g + (actRgb.g - baseRgb.g) * glowT);
      const b = Math.round(baseRgb.b + (actRgb.b - baseRgb.b) * glowT);

      ctx.globalAlpha = 0.8 + 0.2 * glowT;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(ox, oy, (cfg.dotSize / 2) * (1 + glowT * 0.55), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  ready = true;
  requestAnimationFrame(loop);
})();
