window.DitherArt = (function () {
  const CFG = {
    cellSize: 6,
    contrast: 1.4,
    brightness: 0,
    density: 80,
    animStyle: "shimmer",
    animSpeed: 1,
    animIntensity: 0.6,
    card: "#121215",
    invert: false,
  };

  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];

  const instances = [];
  let raf = null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;

  function hexToRgb(hex) {
    const m = hex.replace("#", "");
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16),
    };
  }

  function corsSource(img) {
    const url = img.currentSrc || img.src;
    if (!url) return null;
    let parsed;
    try {
      parsed = new URL(url, location.href);
    } catch {
      return null;
    }
    if (parsed.origin === location.origin) return url;
    return (
      "https://images.weserv.nl/?url=" +
      encodeURIComponent(url.replace(/^https?:\/\//, "")) +
      "&w=1200&output=jpg&q=85"
    );
  }

  function coverDraw(img, sctx, cw, ch) {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = cw / scale;
    const sh = ch / scale;
    sctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, cw, ch);
  }

  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    const card = cs.getPropertyValue("--card").trim();
    if (card) CFG.card = card;
    CFG.invert = document.documentElement.classList.contains("light");
  }
  readTheme();

  function register(media, img) {
    if (img.dataset.veilApplied) return;
    img.dataset.veilApplied = "1";

    const src = corsSource(img);
    if (!src) return;

    const canvas = document.createElement("canvas");
    canvas.className = "tile-veil";
    const instance = {
      media,
      canvas,
      ctx: canvas.getContext("2d"),
      grid: null,
      gw: 0,
      gh: 0,
      cw: 0,
      ch: 0,
      dpr: 1,
      visible: false,
      ready: false,
    };

    function build(sourceImg) {
      const rect = media.getBoundingClientRect();
      const cw = Math.max(2, Math.round(rect.width));
      const ch = Math.max(2, Math.round(rect.height));
      if (cw < 10 || ch < 10 || !sourceImg.naturalWidth) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      instance.cw = cw;
      instance.ch = ch;
      instance.dpr = dpr;

      const sample = document.createElement("canvas");
      sample.width = cw;
      sample.height = ch;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      coverDraw(sourceImg, sctx, cw, ch);

      let data;
      try {
        data = sctx.getImageData(0, 0, cw, ch).data;
      } catch {
        return;
      }

      const cell = CFG.cellSize;
      const gw = Math.ceil(cw / cell);
      const gh = Math.ceil(ch / cell);
      const grid = new Float32Array(gw * gh);

      for (let gy = 0; gy < gh; gy++) {
        for (let gx = 0; gx < gw; gx++) {
          const idx = gy * gw + gx;
          let sum = 0;
          let n = 0;
          const x0 = gx * cell;
          const y0 = gy * cell;
          const x1 = Math.min(x0 + cell, cw);
          const y1 = Math.min(y0 + cell, ch);
          for (let y = y0; y < y1; y++) {
            for (let x = x0; x < x1; x++) {
              const i = (y * cw + x) * 4;
              sum +=
                0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
              n++;
            }
          }
          let v = (sum / n / 255 - 0.5 + CFG.brightness) * CFG.contrast + 0.5;
          grid[idx] = Math.min(1, Math.max(0, v));
        }
      }

      instance.grid = grid;
      instance.gw = gw;
      instance.gh = gh;

      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      instance.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      instance.ready = true;
    }

    const loader = new Image();
    loader.crossOrigin = "anonymous";
    loader.onload = () => build(loader);
    loader.src = src;

    media.append(canvas);

    if ("ResizeObserver" in window) {
      let t = null;
      new ResizeObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => {
          if (loader.naturalWidth) build(loader);
        }, 200);
      }).observe(media);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            instance.visible = en.isIntersecting;
          });
          startLoop();
        },
        { threshold: 0.05 }
      ).observe(media);
    } else {
      instance.visible = true;
    }

    instances.push(instance);
    startLoop();
  }

  function renderInstance(inst, tSec) {
    const x = inst.ctx;
    x.setTransform(inst.dpr, 0, 0, inst.dpr, 0, 0);
    x.globalCompositeOperation = "source-over";
    x.globalAlpha = 1;
    x.clearRect(0, 0, inst.cw, inst.ch);

    const cardRgb = hexToRgb(CFG.card);
    const cell = CFG.cellSize;
    const grid = inst.grid;
    const maxR = cell * 0.5 * (CFG.density / 100);
    const shimmerAmp = 0.15 * CFG.animIntensity;
    const t = tSec * CFG.animSpeed;
    const invert = CFG.invert;

    if (invert) {
      // Light theme: photo is the field, card-coloured dots are punched on top.
      x.clearRect(0, 0, inst.cw, inst.ch);
    } else {
      // Dark theme: card-coloured field with transparent dots revealing photo.
      x.fillStyle = `rgb(${cardRgb.r},${cardRgb.g},${cardRgb.b})`;
      x.fillRect(0, 0, inst.cw, inst.ch);
    }

    x.fillStyle = `rgb(${cardRgb.r},${cardRgb.g},${cardRgb.b})`;
    if (!invert) x.globalCompositeOperation = "destination-out";

    for (let gy = 0; gy < inst.gh; gy++) {
      for (let gx = 0; gx < inst.gw; gx++) {
        const idx = gy * inst.gw + gx;
        const raw = grid[idx];
        const v = invert ? 1 - raw : raw;
        if (v <= 0.02) continue;

        let threshold = (BAYER[gy % 4][gx % 4] + 0.5) / 16;

        if (CFG.animStyle === "shimmer") {
          const s =
            0.5 +
            0.5 *
              Math.sin(
                t * 1.6 + (gx + gy) * 0.35 + Math.sin(gx * 0.12 + gy * 0.2) * 0.8
              );
          threshold += (s - 0.5) * 2 * shimmerAmp;
        } else if (CFG.animStyle === "pulse") {
          threshold += (0.5 + 0.5 * Math.sin(t * Math.PI * 2)) * 0.15 * CFG.animIntensity - 0.075 * CFG.animIntensity;
        }

        if (v <= threshold) continue;

        const r = maxR * (0.4 + 0.6 * v);
        x.beginPath();
        x.arc(gx * cell + cell / 2, gy * cell + cell / 2, r, 0, Math.PI * 2);
        x.fill();
      }
    }

    x.globalCompositeOperation = "source-over";
    x.globalAlpha = 1;
  }

  function frame(now) {
    let anyVisible = false;
    for (const inst of instances) {
      if (!inst.ready || !inst.grid) continue;
      if (!inst.visible) continue;
      anyVisible = true;
      renderInstance(inst, reduced ? 0 : now / 1000);
    }
    raf = anyVisible ? requestAnimationFrame(frame) : null;
  }

  function startLoop() {
    if (raf != null) return;
    raf = requestAnimationFrame(frame);
  }

  function recolor() {
    readTheme();
    for (const inst of instances) {
      if (inst.ready && inst.grid && inst.visible)
        renderInstance(inst, performance.now() / 1000);
    }
  }
  document.addEventListener("themechange", recolor);

  function apply(root) {
    root.querySelectorAll(".tile-media img").forEach((img) => {
      const media = img.closest(".tile-media");
      if (!media || img.dataset.veilApplied) return;
      register(media, img);
    });
  }

  return { apply };
})();
