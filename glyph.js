(function () {
  const holder = document.getElementById("glyph");
  if (!holder) return;

  let nameColor = "#f4f4f5";
  let accentColor = "#d71921";
  let ready = false;
  function readGlyphColors() {
    const cs = getComputedStyle(document.documentElement);
    nameColor = cs.getPropertyValue("--text").trim() || nameColor;
    accentColor = cs.getPropertyValue("--accent").trim() || accentColor;
    if (ready) renderFrame(performance.now());
  }
  readGlyphColors();
  document.addEventListener("themechange", readGlyphColors);

  const N = 16;
  const segs = [];
  for (let i = 0; i < N; i++) {
    const s = document.createElement("span");
    holder.append(s);
    segs.push(s);
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  if (reduced) {
    segs.forEach((s) => {
      s.style.opacity = "0.18";
    });
    return;
  }

  let burstUntil = 0;

  document.addEventListener(
    "pointerover",
    (e) => {
      if (e.target.closest && e.target.closest(".project")) {
        burstUntil = performance.now() + 1400;
      }
    },
    { passive: true }
  );

  function renderFrame(now) {
    const t = now / 1000;
    const burst = now < burstUntil;
    const speed = burst ? 14 : 4;
    const chase = ((t * speed) % N + N) % N;

    for (let i = 0; i < N; i++) {
      let v = 0.1;
      let d = Math.abs(i - chase);
      d = Math.min(d, N - d);
      v += Math.exp((-d * d) / 1.6) * (burst ? 0.95 : 0.55);
      if (Math.sin(t * 2 + i * 1.7) > 0.995) v += 0.25;

      const s = segs[i];
      s.style.opacity = v.toFixed(3);
      s.style.background = v > 0.8 ? accentColor : nameColor;
    }
  }

  function loop(now) {
    renderFrame(now);
    requestAnimationFrame(loop);
  }

  ready = true;
  requestAnimationFrame(loop);
})();
