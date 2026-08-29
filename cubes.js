function initCubes(host, options = {}) {
  if (host.dataset.cubesInit) return null;
  host.dataset.cubesInit = "true";

  const {
    gridSize = 9,
    maxAngle = 45,
    radius = 4,
    easing = "power3.out",
    duration = { enter: 0.3, leave: 0.6 },
    cellGap,
    shadow = false,
    autoAnimate = true,
    rippleOnClick = true,
    rippleSpeed = 2,
    eventTarget = host,
  } = options;

  const colGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : cellGap?.col !== undefined
        ? `${cellGap.col}px`
        : "5%";
  const rowGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : cellGap?.row !== undefined
        ? `${cellGap.row}px`
        : "5%";

  const enterDur = duration.enter;
  const leaveDur = duration.leave;

  host.classList.add("cubes");
  host.style.setProperty(
    "--cube-face-shadow",
    shadow === true ? "0 0 6px rgba(0,0,0,.5)" : shadow || "none"
  );

  const scene = document.createElement("div");
  scene.className = "cubes__scene";
  scene.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  scene.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  scene.style.columnGap = colGap;
  scene.style.rowGap = rowGap;

  const sides = ["top", "bottom", "left", "right", "front", "back"];
  const items = [];
  const frag = document.createDocumentFragment();
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cube = document.createElement("div");
      cube.className = "cubes__cube";
      cube.dataset.row = r;
      cube.dataset.col = c;
      const faces = [];
      sides.forEach((side) => {
        const face = document.createElement("div");
        face.className = `cubes__face cubes__face--${side}`;
        cube.append(face);
        faces.push(face);
      });
      frag.append(cube);
      items.push({ el: cube, faces, r, c, angle: 0 });
    }
  }
  scene.append(frag);
  host.append(scene);

  const first = items[0].el.getBoundingClientRect();
  const nextX = items[1].el.getBoundingClientRect();
  const nextY = items[gridSize].el.getBoundingClientRect();
  const metrics = {
    oxPage: first.left + window.pageXOffset,
    oyPage: first.top + window.pageYOffset,
    hw: first.width / 2,
    hh: first.height / 2,
    px: Math.max(nextX.left - first.left, 1),
    py: Math.max(nextY.top - first.top, 1),
  };
  metrics.rowScale = metrics.py / metrics.px;

  const gridPoint = (e) => ({
    col: (e.pageX - metrics.oxPage - metrics.hw) / metrics.px,
    row: (e.pageY - metrics.oyPage - metrics.hh) / metrics.py,
  });

  let cachedFaceColor = null;
  const resolveFaceColor = () => {
    if (!cachedFaceColor) {
      const probe = scene.querySelector(".cubes__face");
      cachedFaceColor =
        (probe && getComputedStyle(probe).backgroundColor) || "#888888";
    }
    return cachedFaceColor;
  };

  const resolveRippleColor = () =>
    getComputedStyle(host).getPropertyValue("--cubes-ripple").trim() ||
    "#ffffff";

  const activeItems = new Set();
  const ANGLE_EPSILON = 0.15;

  const tiltAt = (rowCenter, colCenter) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const dx = item.c - colCenter;
      const dy = item.r - rowCenter;
      const dist = Math.hypot(dx * metrics.rowScale, dy);
      if (dist <= radius) {
        const mag = (1 - dist / radius) * maxAngle;
        const nx = dist > 0.001 ? (dx / dist) * mag : 0;
        const ny = dist > 0.001 ? (dy / dist) * mag : 0;
        const changed =
          !activeItems.has(item) ||
          Math.abs((item.tx || 0) - nx) + Math.abs((item.ty || 0) - ny) >
            ANGLE_EPSILON;
        if (changed) {
          activeItems.add(item);
          item.tx = nx;
          item.ty = ny;
          gsap.to(item.el, {
            duration: enterDur,
            ease: easing,
            overwrite: true,
            rotateX: ny,
            rotateY: -nx,
          });
        }
      } else if (activeItems.delete(item)) {
        item.tx = 0;
        item.ty = 0;
        gsap.to(item.el, {
          duration: leaveDur,
          ease: "power3.out",
          overwrite: true,
          rotateX: 0,
          rotateY: 0,
        });
      }
    }
  };

  const resetAll = () => {
    activeItems.forEach((item) => {
      item.angle = 0;
      gsap.to(item.el, {
        duration: leaveDur,
        rotateX: 0,
        rotateY: 0,
        ease: "power3.out",
      });
    });
    activeItems.clear();
  };

  let rafId = null;
  let idleTimer = null;
  let userActive = false;

  const markActive = () => {
    userActive = true;
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      userActive = false;
    }, 3000);
  };

  const inBounds = (e, rect) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
  };

  const onPointerMove = (e) => {
    const rect = scene.getBoundingClientRect();
    if (!inBounds(e, rect)) return;
    markActive();
    const p = gridPoint(e);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => tiltAt(p.row, p.col));
  };

  const onClick = (e) => {
    if (!rippleOnClick) return;
    const p = gridPoint(e);
    const colHit = Math.round(p.col);
    const rowHit = Math.round(p.row);

    const baseRingDelay = 0.15;
    const baseAnimDur = 0.3;
    const baseHold = 0.6;
    const spreadDelay = baseRingDelay / rippleSpeed;
    const animDuration = baseAnimDur / rippleSpeed;
    const holdTime = baseHold / rippleSpeed;

    const rings = {};
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const ring = Math.round(
        Math.hypot(
          item.c - colHit,
          (item.r - rowHit) * metrics.rowScale
        )
      );
      if (!rings[ring]) rings[ring] = [];
      for (let f = 0; f < item.faces.length; f++) {
        rings[ring].push(item.faces[f]);
      }
    }

    Object.keys(rings)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((ring) => {
        const delay = ring * spreadDelay;
        const faces = rings[ring];
        gsap.to(faces, {
          backgroundColor: resolveRippleColor(),
          duration: animDuration,
          delay,
          ease: "power3.out",
        });
        gsap.to(faces, {
          backgroundColor: resolveFaceColor(),
          duration: animDuration,
          delay: delay + animDuration + holdTime,
          ease: "power3.out",
        });
      });
  };

  window.addEventListener("pointermove", onPointerMove);
  eventTarget.addEventListener("pointerleave", resetAll);
  eventTarget.addEventListener("click", onClick);

  let simStopped = false;
  if (autoAnimate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const simPos = {
      x: Math.random() * gridSize,
      y: Math.random() * gridSize,
    };
    const simTarget = {
      x: Math.random() * gridSize,
      y: Math.random() * gridSize,
    };
    const speed = 0.02;
    const loop = () => {
      if (simStopped) return;
      if (!userActive) {
        simPos.x += (simTarget.x - simPos.x) * speed;
        simPos.y += (simTarget.y - simPos.y) * speed;
        tiltAt(simPos.y, simPos.x);
        if (Math.hypot(simPos.x - simTarget.x, simPos.y - simTarget.y) < 0.1) {
          simTarget.x = Math.random() * gridSize;
          simTarget.y = Math.random() * gridSize;
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  return {
    gridSize,
    destroy() {
      simStopped = true;
      window.removeEventListener("pointermove", onPointerMove);
      eventTarget.removeEventListener("pointerleave", resetAll);
      eventTarget.removeEventListener("click", onClick);
      if (rafId) cancelAnimationFrame(rafId);
      if (idleTimer) clearTimeout(idleTimer);
      activeItems.clear();
      host.innerHTML = "";
      delete host.dataset.cubesInit;
    },
  };
}

function idealGridSize(width) {
  if (width < 640) return 10;
  return Math.min(24, Math.max(14, Math.round(width / 110)));
}

const cubesHost = document.getElementById("cubes");
if (cubesHost && typeof gsap !== "undefined") {
  let instance = null;
  let resizeTimer = null;

  const build = () => {
    const gs = idealGridSize(window.innerWidth);
    if (instance && instance.gridSize === gs) return;
    if (instance) instance.destroy();
    instance = initCubes(cubesHost, {
      gridSize: gs,
      maxAngle: 40,
      radius: 5,
      cellGap: 34,
      autoAnimate: true,
      rippleOnClick: true,
      rippleSpeed: 2.25,
      eventTarget: cubesHost.closest(".hero") || cubesHost,
    });
  };

  build();

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
}
