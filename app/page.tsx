"use client";

import { useEffect, useRef, useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "chess",
    title: "Chess Engine",
    subtitle: "NegaMax · Alpha-Beta · Genetic Tuning",
    description: "Python chess AI built from scratch — iterative-deepening NegaMax with alpha-beta pruning, a genetic algorithm for piece-value table tuning, and a full Pygame interface for human vs AI play.",
    tags: ["Python", "AI", "Game Theory", "Genetic Algorithms"],
    github: "https://github.com/Nimaho71/chess-engine",
    live: null as string | null,
    accent: "#3dfaff",
  },
  {
    id: "fluid",
    title: "SPH Fluid Simulation",
    subtitle: "Smoothed Particle Hydrodynamics · Numba JIT",
    description: "1,800-line real-time 2D fluid sandbox. Numba-JIT parallel kernels for density, pressure, viscosity, and surface tension with interactive obstacles and a metaball renderer.",
    tags: ["Python", "NumPy", "Numba", "Physics"],
    github: "https://github.com/Nimaho71/Python-Fluid-Simulation",
    live: null as string | null,
    accent: "#ff3d6b",
  },
  {
    id: "anim",
    title: "Parallax Gallery",
    subtitle: "Web Animations API · Mouse Tracking",
    description: "Drag-scroll parallax image track with the Web Animations API. Mouse-driven easing, scramble-text hero, cursor blob, and fluid momentum scrolling.",
    tags: ["JavaScript", "CSS", "Web Animations API"],
    github: "https://github.com/Nimaho71/nature-gallery",
    live: null as string | null,
    accent: "#b8f400",
  },
];

const CTF = [
  {
    platform: "Hack The Box",
    label: "HTB",
    items: ["Network recon with Nmap", "Python exploit scripting", "Malware analysis"],
    color: "#9fef00",
  },
  {
    platform: "TryHackMe",
    label: "THM",
    items: ["PHP reverse shell upload bypass", "Extension filter evasion", "Web app exploitation"],
    color: "#ff4040",
  },
  {
    platform: "PicoCTF",
    label: "PICO",
    items: ["BitLocker forensics (.dd imaging)", "Hash extraction & cracking (rockyou)", "Digital forensics"],
    color: "#3dfaff",
  },
];

// ─── Reveal hook ──────────────────────────────────────────────────────────────

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

// ─── Constellation canvas ─────────────────────────────────────────────────────

function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();

    const N = window.innerWidth < 768 ? 45 : window.innerWidth < 1440 ? 68 : 92, LINK = 145;
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

        // Mouse push
        const mx = p.x - mouse.x, my = p.y - mouse.y;
        const md = Math.hypot(mx, my);
        if (md < 110 && md > 0) {
          const force = ((110 - md) / 110) * 0.65;
          p.vx += (mx / md) * force;
          p.vy += (my / md) * force;
        }

        // Sine drift — particles never die
        p.vx += Math.sin(f * 0.007 + i * 0.6) * 0.006;
        p.vy += Math.cos(f * 0.005 + i * 0.8) * 0.006;

        // Speed clamp + minimum
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 2)   { p.vx *= 2 / spd; p.vy *= 2 / spd; }
        if (spd < 0.1) { p.vx += (Math.random() - 0.5) * 0.1; p.vy += (Math.random() - 0.5) * 0.1; }

        p.x += p.vx; p.y += p.vy;

        // Bounce
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }

        // Draw edges
        for (let j = i + 1; j < N; j++) {
          const q = dots[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(61,250,255,${(1 - d / LINK) * 0.28})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // Draw dot
        ctx.fillStyle = `rgba(61,250,255,${0.5 + Math.sin(f * 0.04 + i) * 0.25})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    tick();
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMouse); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

// ─── Cursor (dot only — ring removed) ────────────────────────────────────────

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

// ─── Nav ─────────────────────────────────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: hov ? "var(--accent)" : "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}>
      {children}
    </a>
  );
}

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
        <div style={{ display: "flex", gap: "2rem" }}>
          {["Projects", "Security", "Contact"].map(s => <NavLink key={s} href={`#${s.toLowerCase()}`}>{s}</NavLink>)}
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
  const base = {
    display: "inline-flex" as const, alignItems: "center" as const,
    padding: "10px 24px", fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600,
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    textDecoration: "none", borderRadius: 2, cursor: "none",
    transition: "color 0.2s, background 0.2s, border-color 0.2s",
  };
  const style = variant === "primary"
    ? { ...base, color: hov ? "var(--accent)" : "var(--bg)", background: hov ? "transparent" : "var(--accent)", border: "1px solid var(--accent)" }
    : { ...base, color: hov ? "var(--accent)" : "var(--muted)", background: hov ? "rgba(61,250,255,0.06)" : "transparent", border: `1px solid ${hov ? "var(--accent)" : "var(--border)"}` };
  return (
    <a href={href} target={target} rel={target ? "noopener noreferrer" : undefined}
      style={style} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </a>
  );
}

// ─── Hero (parallax + scroll fade) ───────────────────────────────────────────

function Hero() {
  const [vis, setVis] = useState(false);
  const wrapRef  = useRef<HTMLDivElement>(null); // text — scroll parallax target
  const cvRef    = useRef<HTMLDivElement>(null); // canvas — slower parallax

  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);

  // Parallax & fade — direct DOM writes, no CSS transition on parent
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translateY(${y * 0.32}px)`;
        wrapRef.current.style.opacity = String(Math.max(0, 1 - y / 480));
      }
      if (cvRef.current) cvRef.current.style.transform = `translateY(${y * 0.1}px)`;
    };
    fn(); // initial call
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const t = (delay: number) =>
    `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;

  return (
    <section style={{ position: "relative", height: "100svh", minHeight: "560px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(2rem,6vw,8rem)", overflow: "hidden" }}>
      {/* Canvas layer */}
      <div ref={cvRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Constellation />
      </div>

      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(61,250,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(61,250,255,0.025) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />

      {/* Bottom fade to bg */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(transparent,var(--bg))", zIndex: 2, pointerEvents: "none" }} />

      {/* Text content — parallax wrapper (no inline transition; each child handles its own entrance) */}
      <div ref={wrapRef} style={{ position: "relative", zIndex: 10 }}>
        <div className="label" style={{ marginBottom: "1.5rem", opacity: vis ? 0.7 : 0, transition: "opacity 0.6s ease 0.1s" }}>
          Software Engineer · Gothenburg, SE
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem,10vw,9rem)", fontWeight: 800, lineHeight: 0.92, letterSpacing: "-0.03em", color: "var(--text)", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(36px)", transition: t(200) }}>
          NILS<br />
          <span style={{ color: "var(--accent)", WebkitTextStroke: "2px var(--accent)", WebkitTextFillColor: "transparent" }}>HOGBERG</span>
        </h1>
        <p style={{ marginTop: "2rem", fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "clamp(1rem,2vw,1.25rem)", color: "var(--muted)", maxWidth: "420px", lineHeight: 1.65, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: t(380) }}>
          Building things at the intersection of systems, security, and intelligence.
        </p>
        <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: t(520) }}>
          {["Cybersecurity", "Systems Programming", "AI / ML"].map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
        <div style={{ marginTop: "3rem", display: "flex", gap: "1.2rem", flexWrap: "wrap", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: t(660) }}>
          <Btn href="#projects" variant="primary">View Projects</Btn>
          <Btn href="https://github.com/Nimaho71" target="_blank" variant="ghost">GitHub ↗</Btn>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: "2.5rem", right: "2.5rem", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: vis ? 0.35 : 0, transition: "opacity 1s ease 1.2s", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)" }}>
        <div style={{ width: 1, height: 40, background: "linear-gradient(var(--accent),transparent)" }} />
        scroll
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

// ─── Projects ────────────────────────────────────────────────────────────────

function ProjectCard({ project: p, index: i }: { project: typeof PROJECTS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  const { ref, vis } = useReveal();
  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", padding: "2.5rem",
        background: hov ? "var(--surface)" : "var(--bg-2)",
        border: `1px solid ${hov ? p.accent + "40" : "var(--border)"}`,
        cursor: "none",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)",
        transition: `opacity 0.7s ease ${i * 120}ms, transform 0.7s ease ${i * 120}ms, background 0.3s, border-color 0.3s`,
      }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: hov ? p.accent : "transparent", transition: "background 0.3s" }} />
      <div className="label" style={{ color: p.accent, marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "0.4rem" }}>{p.title}</h3>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: p.accent, opacity: 0.65, marginBottom: "1.2rem" }}>{p.subtitle}</div>
      <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "0.95rem", lineHeight: 1.7, color: "var(--muted)", marginBottom: "1.5rem" }}>{p.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "2rem" }}>
        {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <InlineLink href={p.github} accent={p.accent}>GitHub ↗</InlineLink>
        {p.live && <InlineLink href={p.live} accent={p.accent}>Live ↗</InlineLink>}
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

// ─── Security ────────────────────────────────────────────────────────────────

function CTFCard({ ctf: c, index: i }: { ctf: typeof CTF[0]; index: number }) {
  const [hov, setHov] = useState(false);
  const { ref, vis } = useReveal();
  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "2rem",
        background: hov ? "var(--surface)" : "var(--bg-2)",
        border: `1px solid ${hov ? c.color + "40" : "var(--border)"}`,
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)",
        transition: `opacity 0.7s ease ${i * 100}ms, transform 0.7s ease ${i * 100}ms, background 0.3s, border-color 0.3s`,
      }}>
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
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "2rem" }}>Let&rsquo;s work together.</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Btn href="https://github.com/Nimaho71" target="_blank" variant="primary">GitHub ↗</Btn>
          <Btn href="mailto:nils.oi.hogberg@gmail.com" variant="ghost">Email ↗</Btn>
        </div>
        <p style={{ marginTop: "6rem", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", opacity: 0.5 }}>
          © 2026 Nils Hogberg · Built with Next.js · Hosted on Vercel
        </p>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Security />
        <Contact />
      </main>
    </>
  );
}
