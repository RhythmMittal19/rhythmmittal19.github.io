/* ================================================================
   RHYTHM MITTAL — PORTFOLIO  ·  "Neon Space"

   Deps: GSAP 3.12 + ScrollTrigger, Lenis 1.1

   Features
   ────────
   Smooth scroll · Typewriter hero · Particle network w/ mouse
   Glass-card spotlight glow · 3D tilt · Magnetic buttons
   Aurora parallax · Countdowns · Counter animation
   Custom cursor · Scroll progress · Active nav tracking
   ================================================================ */

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  gsap.registerPlugin(ScrollTrigger);

  /* ─── Lenis ─── */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ─── Refs ─── */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const progressBar = document.getElementById("scrollProgressBar");

  /* ═══════════════════════════════════
     NAVIGATION
     ═══════════════════════════════════ */
  let scrolled = false;

  function updateNav() {
    const y = window.scrollY;
    if (y > 50 && !scrolled) {
      nav.classList.add("scrolled");
      scrolled = true;
    } else if (y <= 50 && scrolled) {
      nav.classList.remove("scrolled");
      scrolled = false;
    }
  }

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  function openMenu() {
    navLinks.classList.add("open");
    navToggle.classList.add("active");
    navToggle.setAttribute("aria-expanded", "true");
    lenis.stop();
  }

  function closeMenu() {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    lenis.start();
  }

  navToggle.addEventListener("click", () =>
    navLinks.classList.contains("open") ? closeMenu() : openMenu(),
  );

  navLinks
    .querySelectorAll(".nav-link")
    .forEach((l) => l.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !e.target.closest(".nav-inner"))
      closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ═══════════════════════════════════
     SCROLL PROGRESS
     ═══════════════════════════════════ */
  function updateProgress() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });

  /* ═══════════════════════════════════
     TEXT SPLIT
     ═══════════════════════════════════ */
  function splitText() {
    document.querySelectorAll("[data-split]").forEach((el) => {
      const text = el.textContent;
      el.innerHTML = "";
      el.setAttribute("aria-label", text);

      text.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.classList.add("char");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.transitionDelay = i * 0.02 + "s";
        span.setAttribute("aria-hidden", "true");
        el.appendChild(span);
      });
    });
  }

  splitText();

  /* ═══════════════════════════════════
     TYPEWRITER
     ═══════════════════════════════════ */
  function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;

    const roles = [
      "Web Developer",
      "JavaScript Enthusiast",
      "Frontend Builder",
      "Future Backend Engineer",
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function tick() {
      const current = roles[roleIdx];

      if (deleting) {
        charIdx--;
        el.textContent = current.substring(0, charIdx);
      } else {
        charIdx++;
        el.textContent = current.substring(0, charIdx);
      }

      let speed = deleting ? 35 : 75;

      if (!deleting && charIdx === current.length) {
        speed = 2200;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 400;
      }

      setTimeout(tick, speed);
    }

    setTimeout(tick, 600);
  }

  /* ═══════════════════════════════════
     HERO ENTRANCE
     ═══════════════════════════════════ */
  function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });

    tl.fromTo(
      ".name-word .char",
      { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, stagger: 0.03 },
    );

    tl.fromTo(
      ".hero-eyebrow",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8 },
      "-=0.6",
    );

    tl.fromTo(
      ".hero-role",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.5",
    );

    tl.fromTo(
      ".hero-desc",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.4",
    );

    tl.fromTo(
      ".hero-actions",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.4",
    );

    tl.fromTo(
      ".hero-scroll",
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.3",
    );

    tl.fromTo(
      ".hero-watermark",
      { opacity: 0, scale: 0.9 },
      { opacity: 0.015, scale: 1, duration: 1.5, ease: "power2.out" },
      "-=1",
    );
  }

  /* ═══════════════════════════════════
     SCROLL ANIMATIONS
     ═══════════════════════════════════ */
  function animateOnScroll() {
    document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
      const siblings = el.parentElement.querySelectorAll(
        '[data-animate="fade-up"]',
      );
      const idx = Array.from(siblings).indexOf(el);

      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: idx * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });
  }

  function animateSectionRules() {
    document.querySelectorAll(".section-rule").forEach((rule) => {
      gsap.fromTo(
        rule,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.inOut",
          scrollTrigger: { trigger: rule, start: "top 85%" },
        },
      );
    });
  }

  /* ═══════════════════════════════════
     ACTIVE NAV
     ═══════════════════════════════════ */
  function initActiveNavLinks() {
    document.querySelectorAll("section[id]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: ({ isActive }) => {
          const link = document.querySelector(
            `.nav-link[href="#${section.id}"]`,
          );
          if (link) {
            if (isActive) {
              document
                .querySelectorAll(".nav-link")
                .forEach((l) => l.classList.remove("active"));
              link.classList.add("active");
            }
          }
        },
      });
    });
  }

  /* ═══════════════════════════════════
     PARALLAX
     ═══════════════════════════════════ */
  function initParallax() {
    const wm = document.querySelector(".hero-watermark");
    if (wm) {
      gsap.to(wm, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }

    document.querySelectorAll(".aurora-orb").forEach((orb, i) => {
      gsap.to(orb, {
        y: -40 * (i + 1),
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    });
  }

  /* ═══════════════════════════════════
     PARTICLE NETWORK
     ═══════════════════════════════════ */
  function initParticles() {
    const canvas = document.getElementById("heroParticles");
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let animId;
    let W, H;
    let mx = -9999,
      my = -9999;
    const CONNECT = 130;
    const MOUSE_R = 110;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function spawn() {
      particles = [];
      const n = Math.min(55, Math.floor((W * H) / 16000));

      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.8 + 0.5,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.25 - 0.05,
          o: Math.random() * 0.35 + 0.1,
          fs: Math.random() * 0.02 + 0.005,
          fo: Math.random() * Math.PI * 2,
        });
      }
    }

    const hero = document.getElementById("hero");
    hero.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", () => {
      mx = -9999;
      my = -9999;
    });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const t = Date.now() * 0.001;

      particles.forEach((p) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_R && d > 0) {
          const f = (MOUSE_R - d) / MOUSE_R;
          p.x -= dx * f * 0.012;
          p.y -= dy * f * 0.012;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT) {
            const a = (1 - dist / CONNECT) * 0.1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${a})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // Mouse lines
      particles.forEach((p) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT * 1.6) {
          const a = (1 - dist / (CONNECT * 1.6)) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(0,212,255,${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Dots
      particles.forEach((p) => {
        const flicker = Math.sin(t * p.fs * 60 + p.fo);
        const alpha = p.o * (0.5 + 0.5 * flicker);

        // Glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(0,212,255,${alpha * 0.6})`);
        g.addColorStop(1, `rgba(0,212,255,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(176,224,255,${alpha * 1.3})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    spawn();
    draw();

    window.addEventListener("resize", () => {
      resize();
      spawn();
    });

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      onLeave: () => cancelAnimationFrame(animId),
      onEnterBack: () => draw(),
    });
  }

  /* ═══════════════════════════════════
     COUNTDOWNS
     ═══════════════════════════════════ */
  function initCountdowns() {
    const cards = document.querySelectorAll(".upcoming-card[data-target]");

    function update(card) {
      const diff = new Date(card.dataset.target).getTime() - Date.now();
      if (diff <= 0) {
        card.classList.add("launched");
        return;
      }

      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);

      const set = (u, v) => {
        const el = card.querySelector(`[data-unit="${u}"]`);
        if (el) el.textContent = String(v).padStart(2, "0");
      };

      set("days", d);
      set("hours", h);
      set("minutes", m);
      set("seconds", s);
    }

    cards.forEach(update);
    setInterval(() => cards.forEach(update), 1000);
  }

  /* ═══════════════════════════════════
     STAT COUNTERS
     ═══════════════════════════════════ */
  function initCounters() {
    document.querySelectorAll("[data-count]").forEach((counter) => {
      const target = +counter.dataset.count;

      ScrollTrigger.create({
        trigger: counter,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            duration: 2,
            ease: "power2.out",
            onUpdate() {
              counter.textContent = Math.round(target * this.progress());
            },
            onComplete: () => (counter.textContent = target),
          });
        },
      });
    });
  }

  /* ═══════════════════════════════════
     CURSOR
     ═══════════════════════════════════ */
  function initCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = document.createElement("div");
    dot.classList.add("custom-cursor");
    document.body.appendChild(dot);

    const style = document.createElement("style");
    style.textContent = `
      .custom-cursor {
        position:fixed; top:0; left:0;
        width:10px; height:10px;
        background: radial-gradient(circle,rgba(0,212,255,.75),rgba(0,112,255,.3));
        border-radius:50%; pointer-events:none; z-index:10000;
        opacity:0; mix-blend-mode:screen;
        transition: opacity .3s, width .35s var(--ease-out), height .35s var(--ease-out);
        transform:translate(-50%,-50%);
        box-shadow:0 0 14px rgba(0,212,255,.35),0 0 4px rgba(0,212,255,.6);
      }
      .custom-cursor.visible { opacity:.65; }
      .custom-cursor.hovering {
        width:36px; height:36px;
        opacity:.12;
        box-shadow:0 0 28px rgba(0,212,255,.25);
      }
    `;
    document.head.appendChild(style);

    let targetX = 0,
      targetY = 0,
      cx = 0,
      cy = 0;

    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.classList.add("visible");
    });
    document.addEventListener("mouseleave", () =>
      dot.classList.remove("visible"),
    );

    gsap.ticker.add(() => {
      cx += (targetX - cx) * 0.12;
      cy += (targetY - cy) * 0.12;
      dot.style.left = cx + "px";
      dot.style.top = cy + "px";
    });

    document
      .querySelectorAll(
        "a, button, .project-card, .bento-skill, .upcoming-card",
      )
      .forEach((el) => {
        el.addEventListener("mouseenter", () => dot.classList.add("hovering"));
        el.addEventListener("mouseleave", () =>
          dot.classList.remove("hovering"),
        );
      });
  }

  /* ═══════════════════════════════════
     PROGRESS BARS
     ═══════════════════════════════════ */
  function initProgressBars() {
    document.querySelectorAll(".upcoming-progress-bar").forEach((bar) => {
      const p = bar.style.getPropertyValue("--progress");
      bar.style.width = "0%";

      ScrollTrigger.create({
        trigger: bar,
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(bar, {
            width: p,
            duration: 1.5,
            ease: "power3.out",
            delay: 0.3,
          }),
      });
    });
  }

  /* ═══════════════════════════════════
     MOUSE GLOW
     ═══════════════════════════════════ */
  function initMouseGlow() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const glow = document.getElementById("mouseGlow");
    if (!glow) return;

    let gx = 0,
      gy = 0,
      tx = 0,
      ty = 0;

    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = "1";
    });
    document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));

    gsap.ticker.add(() => {
      gx += (tx - gx) * 0.05;
      gy += (ty - gy) * 0.05;
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";
    });
  }

  /* ═══════════════════════════════════
     CARD SPOTLIGHT GLOW
     Radial gradient follows cursor
     inside [data-glow] elements
     ═══════════════════════════════════ */
  function initCardGlow() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.querySelectorAll("[data-glow]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty(
          "--glow-x",
          ((e.clientX - r.left) / r.width) * 100 + "%",
        );
        card.style.setProperty(
          "--glow-y",
          ((e.clientY - r.top) / r.height) * 100 + "%",
        );
      });
    });
  }

  /* ═══════════════════════════════════
     3D TILT
     ═══════════════════════════════════ */
  function initTilt() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("mouseenter", () => (el.style.transition = "none"));

      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y - r.height / 2) / r.height) * -7;
        const ry = ((x - r.width / 2) / r.width) * 7;
        el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform .5s cubic-bezier(.25,1,.5,1)";
        el.style.transform =
          "perspective(700px) rotateX(0) rotateY(0) translateY(0)";
      });
    });
  }

  /* ═══════════════════════════════════
     MAGNETIC BUTTONS
     Button element moves slightly
     toward cursor on hover
     ═══════════════════════════════════ */
  function initMagnetic() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transition = "transform .4s var(--ease-out)";
        btn.style.transform = "translate(0,0)";
      });

      btn.addEventListener("mouseenter", () => {
        btn.style.transition = "none";
      });
    });
  }

  /* ═══════════════════════════════════
     INIT
     ═══════════════════════════════════ */
  function init() {
    animateHero();
    initTypewriter();
    animateOnScroll();
    animateSectionRules();
    initActiveNavLinks();
    initParallax();
    initParticles();
    initCountdowns();
    initCounters();
    initCursor();
    initProgressBars();
    initMouseGlow();
    initCardGlow();
    initTilt();
    initMagnetic();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
