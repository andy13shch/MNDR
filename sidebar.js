(function () {
  const nav = document.getElementById("lineSidebar");
  if (!nav) return;

  const list = nav.querySelector(".line-sidebar__list");
  const items = Array.from(nav.querySelectorAll(".line-sidebar__item"));
  const targets = new Array(items.length).fill(0);
  const current = new Array(items.length).fill(0);
  const PROXIMITY = 90;
  let active = 0;
  let raf = null;
  let last = performance.now();

  function startLoop() {
    if (raf != null) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const k = 1 - Math.exp(-dt / 0.1);

    let moving = false;
    for (let i = 0; i < items.length; i++) {
      const t = Math.max(targets[i] || 0, active === i ? 1 : 0);
      const c = current[i] || 0;
      let n = c + (t - c) * k;
      if (Math.abs(t - n) < 0.0015) n = t;
      else moving = true;
      current[i] = n;
      items[i].style.setProperty("--effect", n.toFixed(4));
    }

    raf = moving ? requestAnimationFrame(frame) : null;
  }

  list.addEventListener(
    "pointermove",
    (e) => {
      const rect = list.getBoundingClientRect();
      const y = e.clientY - rect.top;
      for (let i = 0; i < items.length; i++) {
        const center = items[i].offsetTop + items[i].offsetHeight / 2;
        const p = Math.max(0, 1 - Math.abs(y - center) / PROXIMITY);
        targets[i] = p * p * (3 - 2 * p);
      }
      startLoop();
    },
    { passive: true }
  );

  list.addEventListener("pointerleave", () => {
    targets.fill(0);
    startLoop();
  });

  function setActive(i) {
    if (active === i) return;
    active = i;
    items.forEach((el, idx) => {
      el.classList.toggle("is-active", idx === i);
      if (idx === i) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });
    startLoop();
  }

  items.forEach((item, i) => {
    item.addEventListener("click", () => {
      setActive(i);
      const target = document.getElementById(item.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const sections = items.map((item) =>
    document.getElementById(item.dataset.target)
  );

  function spy() {
    const probe = window.scrollY + window.innerHeight * 0.35;
    let best = 0;
    sections.forEach((sec, i) => {
      if (sec && sec.offsetTop <= probe) best = i;
    });
    setActive(best);
  }

  window.addEventListener("scroll", spy, { passive: true });
  spy();
})();
