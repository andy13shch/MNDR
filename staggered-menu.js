(function () {
  const gsap = window.gsap;
  if (!gsap) return;

  const wrap = document.querySelector(".staggered-menu-wrapper");
  if (!wrap) return;

  const panel = document.getElementById("staggered-menu-panel");
  const preContainer = wrap.querySelector(".sm-prelayers");
  const plusH = wrap.querySelector(".sm-icon-line");
  const plusV = wrap.querySelector(".sm-icon-line-v");
  const icon = wrap.querySelector(".sm-icon");
  const textInner = wrap.querySelector(".sm-toggle-textInner");
  const toggleBtn = wrap.querySelector(".sm-toggle");

  const position = "right";
  const offscreen = position === "left" ? -100 : 100;
  const preLayers = Array.from(preContainer.querySelectorAll(".sm-prelayer"));

  const menuButtonColor = "var(--text)";
  const openMenuButtonColor = "var(--text)";
  const changeMenuColorOnOpen = true;

  let open = false;
  let busy = false;
  let openTl = null;
  let closeTween = null;
  let spinTween = null;
  let textCycle = null;
  let colorTween = null;

  gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
  gsap.set(preContainer, { xPercent: 0, opacity: 1 });
  gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
  gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
  gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
  gsap.set(textInner, { yPercent: 0 });
  toggleBtn.style.color = menuButtonColor;

  function buildOpenTimeline() {
    if (openTl) openTl.kill();
    if (closeTween) {
      closeTween.kill();
      closeTween = null;
    }

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const panelStart = offscreen;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    preLayers.forEach((el, i) => {
      tl.fromTo(
        el,
        { xPercent: offscreen },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = preLayers.length ? (preLayers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (preLayers.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: "power2.out" }, socialsStart);
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04
        );
      }
    }

    openTl = tl;
    return tl;
  }

  function playOpen() {
    if (busy) return;
    busy = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busy = false;
      });
      tl.play(0);
    } else {
      busy = false;
    }
  }

  function playClose() {
    if (openTl) {
      openTl.kill();
      openTl = null;
    }
    const all = [...preLayers, panel];
    if (closeTween) closeTween.kill();
    closeTween = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = Array.from(
          panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
        );
        if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busy = false;
      },
    });
  }

  function animateIcon(opening) {
    if (spinTween) spinTween.kill();
    spinTween = gsap.to(icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? "power4.out" : "power3.inOut",
      overwrite: "auto",
    });
  }

  function animateColor(opening) {
    if (colorTween) colorTween.kill();
    const targetColor = opening ? openMenuButtonColor : menuButtonColor;
    toggleBtn.style.color = targetColor;
  }

  function animateText(opening) {
    if (textCycle) textCycle.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    textInner.innerHTML = seq
      .map((l) => '<span class="sm-toggle-line">' + l + "</span>")
      .join("");
    gsap.set(textInner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycle = gsap.to(textInner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }

  function setOpenState(target) {
    open = target;
    wrap.toggleAttribute("data-open", target);
    toggleBtn.setAttribute("aria-expanded", String(target));
    toggleBtn.setAttribute("aria-label", target ? "Close menu" : "Open menu");
    panel.setAttribute("aria-hidden", String(!target));
  }

  function toggleMenu() {
    const target = !open;
    setOpenState(target);
    if (target) {
      playOpen();
    } else {
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }

  function closeMenu() {
    if (!open) return;
    setOpenState(false);
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
  }

  toggleBtn.addEventListener("click", toggleMenu);

  const closeOnClickAway = true;
  if (closeOnClickAway) {
    document.addEventListener("mousedown", (e) => {
      if (
        panel.contains(e.target) ||
        toggleBtn.contains(e.target)
      ) {
        return;
      }
      closeMenu();
    });
  }

  const items = panel.querySelectorAll(".sm-panel-item");
  items.forEach((a) => {
    a.addEventListener("click", () => {
      closeMenu();
    });
  });
})();
