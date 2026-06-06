"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "chess",
    title: "Chess Engine",
    subtitle: "NegaMax · Alpha-Beta · Genetic Tuning",
    description:
      "Chess AI built from scratch. Iterative-deepening NegaMax with alpha-beta pruning, a genetic algorithm for piece-position table tuning, and a full Pygame interface for human vs AI play.",
    tags: ["Python", "AI", "Game Theory", "Genetic Algorithms", "Pygame"],
    github: "https://github.com/Nimaho71/chess-engine",
    live: null as string | null,
    accent: "#3dfaff",
  },
  {
    id: "fluid",
    title: "SPH Fluid Simulation",
    subtitle: "Smoothed Particle Hydrodynamics · Numba JIT",
    description:
      "1,800-line real-time 2D fluid sandbox. Parallel Numba-JIT kernels for density, pressure, viscosity, and surface tension. Interactive obstacles, metaball renderer, and UI sliders for live parameter tuning.",
    tags: ["Python", "NumPy", "Numba", "Physics", "GPGPU"],
    github: "https://github.com/Nimaho71/Python-Fluid-Simulation",
    live: null as string | null,
    accent: "#ff3d6b",
  },
  {
    id: "anim",
    title: "Parallax Gallery",
    subtitle: "Web Animations API · Mouse Tracking",
    description:
      "Drag-scroll parallax image track with the Web Animations API. Mouse-driven momentum easing, scramble-text hero, and a custom cursor blob — all in vanilla JS.",
    tags: ["JavaScript", "CSS", "Web Animations API", "Vanilla JS"],
    github: "https://github.com/Nimaho71/nature-gallery",
    live: null as string | null,
    accent: "#b8f400",
  },
];

const CTF = [
  {
    platform: "Hack The Box",
    label: "HTB",
    items: ["Network recon with Nmap", "Python exploit scripting", "Malware binary analysis"],
    color: "#9fef00",
  },
  {
    platform: "TryHackMe",
    label: "THM",
    items: ["PHP reverse shell upload bypass", "Extension filter evasion", "Web application exploitation"],
    color: "#ff4040",
  },
  {
    platform: "PicoCTF",
    label: "PICO",
    items: ["BitLocker forensics (.dd imaging)", "Hash extraction & cracking (rockyou)", "Digital forensics"],
    color: "#3dfaff",
  },
];

const SKILLS = [
  { label: "Python",      category: "lang" },
  { label: "JavaScript",  category: "lang" },
  { label: "TypeScript",  category: "lang" },
  { label: "Linux",       category: "security" },
  { label: "Nmap",        category: "security" },
  { label: "CTF",         category: "security" },
  { label: "Exploit Dev", category: "security" },
  { label: "Forensics",   category: "security" },
  { label: "NumPy",       category: "lib" },
  { label: "Numba",       category: "lib" },
  { label: "Three.js",    category: "lib" },
  { label: "React",       category: "lib" },
  { label: "Next.js",     category: "tool" },
  { label: "Git",         category: "tool" },
  { label: "Vercel",      category: "tool" },
  { label: "Pygame",      category: "tool" },
];

// ─── Reveal hook ─────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, vis };
}

// ─── Constellation canvas ──────────────────────────────────────────────────

function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();

    const N = window.innerWidth < 768 ? 45 : window.innerWidth < 1440 ? 68 : 92;
    const LINK = 145;
    type Dot = { x: number; y: number; vx: number; vy: number; r: number };
    const dots: Dot[] = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 1.1 + 0.45,
    }));

    const mouse = { x: -999, y: -999 };
    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };

    let f = 0, raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      f++;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < N; i++) {
        const p = dots[i];
        const mx = p.x - mouse.x, my = p.y - mouse.y;
        const md = Math.hypot(mx, my);
        if (md < 110 && md > 0) {
          const force = ((110 - md) / 110) * 0.65;
          p.vx += (mx / md) * force; p.vy += (my / md) * force;
        }
        p.vx += Math.sin(f * 0.007 + i * 0.6) * 0.006;
        p.vy += Math.cos(f * 0.005 + i * 0.8) * 0.006;
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 2)   { p.vx *= 2 / spd; p.vy *= 2 / spd; }
        if (spd < 0.1) { p.vx += (Math.random() - 0.5) * 0.1; p.vy += (Math.random() - 0.5) * 0.1; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }
        for (let j = i + 1; j < N; j++) {
          const q = dots[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(61,250,255,${(1 - d / LINK) * 0.28})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(61,250,255,${0.5 + Math.sin(f * 0.04 + i) * 0.25})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    };
    tick();
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMouse); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
    const fn = (e: MouseEvent) => {
      if (ref.current) { ref.current.style.left = `${e.clientX}px`; ref.current.style.top = `${e.clientY}px`; }
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  if (isTouch) return null;
  return <div ref={ref} className="cursor" />;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onResize = () => setNarrow(window.innerWidth < 580);
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 1.5rem", height: "56px",
      background: scrolled ? "rgba(7,9,15,0.92)" : "transparent",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.4s ease", fontFamily: "var(--font-display)",
    }}>
      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text)" }}>NH</span>
      {!narrow && (
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {["Projects", "Security", "Contact"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} className="nav-link"
              style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
              {s}
            </a>
          ))}
          <a href="#contact"
            style={{
              fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "6px 16px", border: "1px solid var(--accent)",
              color: "var(--accent)", textDecoration: "none", borderRadius: 2,
              transition: "all 0.2s", cursor: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--bg)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; }}>
            Hire me
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

function Btn({ href, children, variant = "primary", target }: {
  href: string; children: React.ReactNode; variant?: "primary" | "ghost"; target?: string;
}) {
  const [hov, setHov] = useState(false);
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center",
    padding: "10px 24px", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600,
    letterSpacing: "0.1em", textTransform: "uppercase",
    textDecoration: "none", borderRadius: 2, cursor: "none",
    transition: "color 0.2s, background 0.2s, border-color 0.2s",
  };
  const style: React.CSSProperties = variant === "primary"
    ? { ...base, color: hov ? "var(--accent)" : "var(--bg)", background: hov ? "transparent" : "var(--accent)", border: "1px solid var(--accent)" }
    : { ...base, color: hov ? "var(--accent)" : "var(--muted)", background: hov ? "rgba(61,250,255,0.06)" : "transparent", border: `1px solid ${hov ? "var(--accent)" : "var(--border)"}` };
  return (
    <a href={href} target={target} rel={target ? "noopener noreferrer" : undefined}
      style={style} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </a>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const [vis, setVis] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef   = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translateY(${y * 0.32}px)`;
        wrapRef.current.style.opacity = String(Math.max(0, 1 - y / 480));
      }
      if (cvRef.current) cvRef.current.style.transform = `translateY(${y * 0.1}px)`;
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const t = (d: number) =>
    `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${d}ms`;

  return (
    <section style={{
      position: "relative", height: "100svh", minHeight: "560px",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "0 clamp(2rem,6vw,8rem)", overflow: "hidden",
    }}>
      {/* Canvas — pointer-events: none so mobile scroll works */}
      <div ref={cvRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Constellation />
      </div>

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(61,250,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(61,250,255,0.025) 1px,transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(transparent,var(--bg))", zIndex: 2, pointerEvents: "none" }} />

      {/* Text */}
      <div ref={wrapRef} style={{ position: "relative", zIndex: 10 }}>
        {/* Available badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          marginBottom: "1.5rem",
          opacity: vis ? 1 : 0, transition: "opacity 0.6s ease 0.05s",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "block", boxShadow: "0 0 6px #4ade80" }} />
          <span className="label" style={{ color: "var(--muted)", opacity: 1 }}>
            Available for hire · Gothenburg, SE
          </span>
        </div>

        {/* Name — HOGBERG mobile fix: clamp min reduced */}
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 8.5vw, 9rem)",
          fontWeight: 800, lineHeight: 0.92, letterSpacing: "-0.03em",
          color: "var(--text)",
          opacity: vis ? 1 : 0,
          transform: vis ? "none" : "translateY(36px)",
          transition: t(200),
        }}>
          NILS<br />
          <span style={{ color: "var(--accent)", WebkitTextStroke: "2px var(--accent)", WebkitTextFillColor: "transparent" }}>
            HOGBERG
          </span>
        </h1>

        <p style={{
          marginTop: "2rem", fontFamily: "var(--font-body)", fontStyle: "italic",
          fontSize: "clamp(1rem,2vw,1.25rem)", color: "var(--muted)",
          maxWidth: "420px", lineHeight: 1.65,
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: t(380),
        }}>
          Building things at the intersection of systems, security, and intelligence.
        </p>

        <div style={{
          marginTop: "2.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap",
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: t(520),
        }}>
          {["Cybersecurity", "Systems Programming", "AI / ML"].map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>

        <div style={{
          marginTop: "3rem", display: "flex", gap: "1.2rem", flexWrap: "wrap",
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: t(660),
        }}>
          <Btn href="#projects" variant="primary">View Projects</Btn>
          <Btn href="https://github.com/Nimaho71" target="_blank" variant="ghost">GitHub ↗</Btn>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: "2.5rem", right: "2.5rem", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        opacity: vis ? 0.35 : 0, transition: "opacity 1s ease 1.2s",
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em",
        textTransform: "uppercase", color: "var(--muted)",
      }}>
        <div style={{ width: 1, height: 40, background: "linear-gradient(var(--accent),transparent)" }} />
        scroll
      </div>
    </section>
  );
}

// ─── About / Skills band ──────────────────────────────────────────────────────

function About() {
  const { ref, vis } = useReveal();
  return (
    <section style={{
      padding: "5rem clamp(2rem,8vw,8rem)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      maxWidth: "1200px",
    }}>
      <div ref={ref} style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(300px,100%), 1fr))",
        gap: "3rem",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
        transition: "all 0.7s ease",
      }}>
        {/* Bio */}
        <div>
          <div className="label" style={{ marginBottom: "1rem" }}>// About</div>
          <p style={{
            fontFamily: "var(--font-body)", fontStyle: "italic",
            fontSize: "1.1rem", lineHeight: 1.75, color: "var(--text)",
            marginBottom: "1rem",
          }}>
            Software engineer and security researcher from Gothenburg. I build things
            that are technically interesting — physics simulators, chess AIs, and network
            exploitation tools.
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontStyle: "italic",
            fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)",
          }}>
            Currently targeting cybersecurity and SWE roles. Open to internships,
            junior positions, and CTF team collabs.
          </p>
        </div>

        {/* Skills grid */}
        <div>
          <div className="label" style={{ marginBottom: "1rem" }}>// Stack</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {SKILLS.map(s => (
              <span key={s.label} className="skill-tag"
                style={{ borderColor: s.category === "security" ? "rgba(255,61,107,0.3)" : s.category === "lang" ? "rgba(61,250,255,0.3)" : "rgba(61,250,255,0.18)" }}>
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Inline link helper ───────────────────────────────────────────────────────

function InlineLink({ href, accent, children }: { href: string; accent: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener"
      style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: hov ? accent : "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </a>
  );
}

// ─── Project card (with Hyperplexed mouse-glow effect) ─────────────────────

function ProjectCard({ project: p, index: i }: { project: typeof PROJECTS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  const { ref, vis } = useReveal();
  const glowRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!glowRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Direct DOM write — no React state re-render
    glowRef.current.style.background = `radial-gradient(500px circle at ${x}px ${y}px, ${p.accent}14, transparent 70%)`;
  }, [p.accent]);

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseMove={onMouseMove}
      style={{
        position: "relative", overflow: "hidden",
        background: hov ? "var(--surface)" : "var(--bg-2)",
        border: `1px solid ${hov ? p.accent + "40" : "var(--border)"}`,
        cursor: "none",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)",
        transition: `opacity 0.7s ease ${i * 120}ms, transform 0.7s ease ${i * 120}ms, background 0.3s, border-color 0.3s`,
      }}>

      {/* Glow overlay — updated via ref, no state */}
      <div ref={glowRef} style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        opacity: hov ? 1 : 0, transition: "opacity 0.4s ease",
      }} />

      {/* Accent top line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: hov ? p.accent : "transparent", transition: "background 0.3s", zIndex: 1 }} />

      {/* Content — above glow */}
      <div style={{ position: "relative", zIndex: 1, padding: "2.5rem" }}>
        <div className="label" style={{ color: p.accent, marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "0.4rem" }}>{p.title}</h3>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: p.accent, opacity: 0.7, marginBottom: "1.2rem" }}>{p.subtitle}</div>
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "0.95rem", lineHeight: 1.7, color: "var(--muted)", marginBottom: "1.5rem" }}>{p.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "2rem" }}>
          {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <InlineLink href={p.github} accent={p.accent}>GitHub ↗</InlineLink>
          {p.live && <InlineLink href={p.live} accent={p.accent}>Live Demo ↗</InlineLink>}
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const { ref, vis } = useReveal();
  return (
    <section id="projects" style={{ padding: "8rem clamp(2rem,8vw,8rem)", maxWidth: "1200px" }}>
      <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
        <div className="label" style={{ marginBottom: "0.75rem" }}>// Projects</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "3rem" }}>Things I&rsquo;ve Built</h2>
      </div>
      <div style={{ display: "grid", gap: "1.5px", gridTemplateColumns: "repeat(auto-fit,minmax(min(340px,100%),1fr))" }}>
        {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
      </div>
    </section>
  );
}

// ─── CTF card (with mouse-glow) ───────────────────────────────────────────────

function CTFCard({ ctf: c, index: i }: { ctf: typeof CTF[0]; index: number }) {
  const [hov, setHov] = useState(false);
  const { ref, vis } = useReveal();
  const glowRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!glowRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    glowRef.current.style.background = `radial-gradient(400px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, ${c.color}12, transparent 70%)`;
  }, [c.color]);

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onMouseMove={onMouseMove}
      style={{
        position: "relative", overflow: "hidden",
        background: hov ? "var(--surface)" : "var(--bg-2)",
        border: `1px solid ${hov ? c.color + "40" : "var(--border)"}`,
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)",
        transition: `opacity 0.7s ease ${i * 100}ms, transform 0.7s ease ${i * 100}ms, background 0.3s, border-color 0.3s`,
        cursor: "none",
      }}>

      <div ref={glowRef} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: hov ? 1 : 0, transition: "opacity 0.4s ease" }} />

      <div style={{ position: "relative", zIndex: 1, padding: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, marginBottom: "1.2rem", background: c.color + "15", border: `1px solid ${c.color}40`, borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500, color: c.color, letterSpacing: "0.08em" }}>{c.label}</div>
        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", marginBottom: "1rem" }}>{c.platform}</h4>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
          {c.items.map(item => (
            <li key={item} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", lineHeight: 1.5, display: "flex", gap: "8px" }}>
              <span style={{ color: c.color, flexShrink: 0 }}>›</span>{item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Security() {
  const { ref, vis } = useReveal();
  return (
    <section id="security" style={{ padding: "8rem clamp(2rem,8vw,8rem)", maxWidth: "1200px" }}>
      <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
        <div className="label" style={{ marginBottom: "0.75rem" }}>// Security & CTF</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "1rem" }}>Capture The Flag</h2>
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "var(--muted)", fontSize: "1.05rem", maxWidth: "560px", lineHeight: 1.7, marginBottom: "4rem" }}>
          Practical offensive security experience across web exploitation, network forensics, and binary challenges.
        </p>
      </div>
      <div style={{ display: "grid", gap: "1.5px", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))" }}>
        {CTF.map((c, i) => <CTFCard key={c.platform} ctf={c} index={i} />)}
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  const { ref, vis } = useReveal();
  return (
    <section id="contact" style={{ padding: "8rem clamp(2rem,8vw,8rem)", borderTop: "1px solid var(--border)" }}>
      <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
        <div className="label" style={{ marginBottom: "0.75rem" }}>// Contact</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "0.75rem" }}>
          Let&rsquo;s work together.
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "400px" }}>
          Open to cybersecurity roles, SWE positions, and interesting problems.
        </p>

        {/* Primary CTA: email first */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <Btn href="mailto:nils.oi.hogberg@gmail.com" variant="primary">
            Email me ↗
          </Btn>
          <Btn href="https://www.linkedin.com/in/nils-h%C3%B6gberg-681b05404/" target="_blank" variant="ghost">
            LinkedIn ↗
          </Btn>
          <Btn href="https://github.com/Nimaho71" target="_blank" variant="ghost">
            GitHub ↗
          </Btn>
        </div>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", opacity: 0.45 }}>
          © 2026 Nils Hogberg · Built with Next.js · Deployed on Vercel
        </p>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Security />
        <Contact />
      </main>
    </>
  );
}
