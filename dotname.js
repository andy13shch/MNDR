(function () {
  const canvas = document.getElementById("dotname");
  if (!canvas) return;

  const TEXT = "MANDERSHMELLO";

  const FONT = {
    M: ["10001", "11011", "10101", "10001", "10001", "10001", "10001"],
    A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;

  let nameColor = "#f4f4f5";
  let accentColor = "#d71921";
  let ready = false;
  function readNameColors() {
    const cs = getComputedStyle(document.documentElement);
    nameColor = cs.getPropertyValue("--text").trim() || nameColor;
    accentColor = cs.getPropertyValue("--accent").trim() || accentColor;
    if (ready && typeof renderFrame === "function") renderFrame(performance.now());
  }
  readNameColors();
  document.addEventListener("themechange", readNameColors);

  const ctx = canvas.getContext("2d");
  let dots = [];
  let pitch = 8;
  let W = 0;
  let H = 0;
  let dpr = 1;
  let start = performance.now();

  function layout() {
    const parent = canvas.parentElement;
    const avail = Math.max(200, parent.clientWidth - 48);
    const cols = TEXT.length * 6 - 1 + 3;

    pitch = Math.max(6, Math.min(22, Math.floor(avail / cols)));
    W = cols * pitch;
    H = 9 * pitch;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    dots = [];
    [...TEXT].forEach((ch, li) => {
      const glyph = FONT[ch];
      if (!glyph) return;
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 5; c++) {
          if (glyph[r][c] === "1") {
            dots.push({
              col: li * 6 + c,
              row: r,
              delay: (li * 6 + c) * 26 + Math.random() * 260,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    });
  }

  layout();

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      layout();
      start = performance.now();
    }, 150);
  });

  function renderFrame(now) {
    const t = (now - start) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const r = pitch * 0.32;

    for (const dot of dots) {
      let a = 1;
      let s = r;

      if (!reduced) {
        const p = Math.min(
          1,
          Math.max(0, (t * 1000 - dot.delay) / 380)
        );
        const e = 1 - Math.pow(1 - p, 3);
        a = e;
        s = r * e;
        a *= 0.92 + 0.08 * Math.sin(t * 1.6 + dot.phase);
      }

      if (a <= 0.01) continue;

      ctx.globalAlpha = a;
      ctx.fillStyle = nameColor;
      ctx.beginPath();
      ctx.arc((dot.col + 1) * pitch, (dot.row + 1) * pitch, s, 0, Math.PI * 2);
      ctx.fill();
    }

    const blinkOn = reduced || Math.floor(t * 1.6) % 2 === 0;
    if (blinkOn) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = accentColor;
      const bx = (TEXT.length * 6) * pitch + pitch * 0.35;
      const by = 8 * pitch - r;
      ctx.fillRect(bx, by, pitch * 1.4, r * 2);
    }

    ctx.globalAlpha = 1;
  }

  function loop(now) {
    renderFrame(now);
    requestAnimationFrame(loop);
  }

  ready = true;
  requestAnimationFrame(loop);
})();
