window.DotFont = (function () {
  const DIGITS = {
    0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
    1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
    2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    3: ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
    4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
    5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
    6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
    7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
    8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
    9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
    ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  };

  const renders = [];

  function render(canvas, text, opts = {}) {
    const pitch = opts.pitch || 6;
    const themeText =
      getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
    const color = opts.color || themeText || "#f4f4f5";
    const chars = [...String(text)];
    const cols = Math.max(1, chars.length * 6 - 1);

    const W = (cols + 2) * pitch;
    const H = 9 * pitch;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = color;

    let colCursor = 1;
    chars.forEach((ch) => {
      const glyph = DIGITS[ch];
      if (!glyph) {
        colCursor += 3;
        return;
      }
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 5; c++) {
          if (glyph[r][c] === "1") {
            ctx.beginPath();
            ctx.arc(
              (colCursor + c + 1) * pitch,
              (r + 1) * pitch,
              pitch * 0.32,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
      }
      colCursor += 6;
    });

    const existing = renders.find((r) => r.canvas === canvas);
    if (existing) {
      existing.text = text;
      existing.opts = opts;
    } else {
      renders.push({ canvas, text, opts });
    }
  }

  function clearRegistry() {
    renders.length = 0;
  }

  function refresh() {
    renders.forEach((r) => {
      if (r.canvas && r.canvas.isConnected) render(r.canvas, r.text, r.opts);
    });
  }

  return { render, clearRegistry, refresh };
})();
