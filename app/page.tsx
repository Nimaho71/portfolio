"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─── Data ──────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "chess",
    title: "Chess Engine",
    subtitle: "NegaMax · Alpha-Beta · Genetic Tuning",
    description:
      "Python chess AI built from scratch. Implements iterative-deepening NegaMax with alpha-beta pruning, a genetic algorithm for piece-position table tuning, and a full Pygame interface for human vs AI play.",
    tags: ["Python", "AI", "Game Theory", "Genetic Algorithms"],
    github: "https://github.com/Nimaho71/chess-engine",
    live: null,
    accent: "#3dfaff",
  },
  {
    id: "fluid",
    title: "SPH Fluid Simulation",
    subtitle: "Smoothed Particle Hydrodynamics · Numba JIT",
    description:
      "1,800-line real-time 2D fluid sandbox using Smoothed Particle Hydrodynamics. Numba-JIT parallel physics kernels for density, pressure, viscosity, and surface tension. Interactive obstacles and a metaball renderer.",
    tags: ["Python", "NumPy", "Numba", "Physics", "GPGPU"],
    github: "https://github.com/Nimaho71/Python-Fluid-Simulation",
    live: null,
    accent: "#ff3d6b",
  },
  {
    id: "anim",
    title: "Parallax Gallery",
    subtitle: "CSS · Web Animations API",
    description:
      "Smooth parallax image track built with the native Web Animations API and mouse-tracking. Features a scramble-text hero, cursor blob, and fluid drag-scroll with easing.",
    tags: ["JavaScript", "CSS", "Web Animations API"],
    github: "https://github.com/Nimaho71/nature-gallery",
    live: "https://nature-gallery-nimaho71.vercel.app",
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

// ─── Three.js particle hero ─────────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 3;

    // Particles
    const COUNT = 2200;
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = 0;
      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: 0x3dfaff,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Mouse influence
    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // Resize
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // Animation loop
    let frame = 0;
    const animate = () => {
      const id = requestAnimationFrame(animate);
      frame++;

      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3, iy = i * 3 + 1;

        // Mouse repulsion
        const dx = pos[ix] - mouse.x * 3;
        const dy = pos[iy] - mouse.y * 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.2) {
          const force = (1.2 - dist) * 0.003;
          velocities[ix] += (dx / dist) * force;
          velocities[iy] += (dy / dist) * force;
        }

        // Drift + damping
        velocities[ix] *= 0.98;
        velocities[iy] *= 0.98;
        pos[ix] += velocities[ix];
        pos[iy] += velocities[iy];

        // Boundary wrap
        if (pos[ix] > 5)  pos[ix] = -5;
        if (pos[ix] < -5) pos[ix] = 5;
        if (pos[iy] > 3)  pos[iy] = -3;
        if (pos[iy] < -3) pos[iy] = 3;
      }
      geo.attributes.position.needsUpdate = true;

      points.rotation.y = Math.sin(frame * 0.0003) * 0.05;
      renderer.render(scene, camera);
      return id;
    };
    const animId = animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Custom cursor ───────────────────────────────────────────────────────────

function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (dotRef.current)  { dotRef.current.style.left  = `${x}px`; dotRef.current.style.top  = `${y}px`; }
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      if (ringRef.current) { ringRef.current.style.left = `${rx}px`; ringRef.current.style.top = `${ry}px`; }
    };
    let raf: number;
    const loop = () => { raf = requestAnimationFrame(loop); };
    loop();
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2rem", height: "60px",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        background: scrolled ? "rgba(7,9,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.3s ease",
        fontFamily: "var(--font-display)",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", color: "var(--text)" }}>
        NH
      </span>
      <div style={{ display: "flex", gap: "2rem", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {["Projects", "Security", "Contact"].map((s) => (
          <a
            key={s}
            href={`#${s.toLowerCase()}`}
            style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            {s}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section
      style={{
        position: "relative", height: "100vh", display: "flex",
        flexDirection: "column", justifyContent: "center", paddingLeft: "clamp(2rem, 8vw, 8rem)",
        overflow: "hidden",
      }}
    >
      <ParticleCanvas />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(61,250,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(61,250,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* Gradient fade bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(transparent, var(--bg))",
        zIndex: 2, pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 10 }}>
        <div
          className="label"
          style={{ marginBottom: "1.5rem", opacity: visible ? 0.7 : 0, transition: "opacity 0.5s 0.2s" }}
        >
          Software Engineer · Gothenburg, SE
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          NILS
          <br />
          <span style={{ color: "var(--accent)", WebkitTextStroke: "1px var(--accent)", WebkitTextFillColor: "transparent" }}>
            HOGBERG
          </span>
        </h1>

        <p
          style={{
            marginTop: "2rem",
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "var(--muted)",
            maxWidth: "440px",
            lineHeight: 1.6,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s",
          }}
        >
          Building things at the intersection of systems, security, and intelligence.
        </p>

        <div
          style={{
            marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s",
          }}
        >
          {["Cybersecurity", "Systems Programming", "AI / ML"].map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div
          style={{
            marginTop: "3rem", display: "flex", gap: "1.5rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s",
          }}
        >
          <a href="#projects" style={btnStyle("#3dfaff")}>View Projects</a>
          <a href="https://github.com/Nimaho71" target="_blank" rel="noopener" style={btnStyle("transparent", true)}>
            GitHub ↗
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2.5rem", right: "2.5rem", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        opacity: 0.4, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em",
        textTransform: "uppercase", color: "var(--muted)",
      }}>
        <div style={{
          width: 1, height: 48,
          background: "linear-gradient(var(--accent), transparent)",
          animation: "fadeUp 1.5s ease infinite alternate",
        }} />
        scroll
      </div>
    </section>
  );
}

function btnStyle(bg: string, ghost?: boolean): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "10px 22px",
    fontFamily: "var(--font-display)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textDecoration: "none",
    color: ghost ? "var(--muted)" : "var(--bg)",
    background: ghost ? "transparent" : bg,
    border: `1px solid ${ghost ? "var(--border)" : bg}`,
    borderRadius: 2,
    cursor: "none",
    transition: "all 0.2s ease",
  };
}

// ─── Projects ────────────────────────────────────────────────────────────────

function Projects() {
  return (
    <section id="projects" style={{ padding: "8rem clamp(2rem, 8vw, 8rem)", maxWidth: "1200px" }}>
      <div className="label" style={{ marginBottom: "3rem" }}>// Projects</div>

      <div style={{ display: "grid", gap: "1.5px", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }: { project: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "2.5rem",
        background: hovered ? "var(--surface)" : "var(--bg-2)",
        border: `1px solid ${hovered ? p.accent + "30" : "var(--border)"}`,
        transition: "all 0.3s ease",
        cursor: "none",
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Accent line top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: hovered ? p.accent : "transparent",
        transition: "background 0.3s ease",
      }} />

      <div className="label" style={{ color: p.accent, marginBottom: "1rem" }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      <h3 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em",
        color: "var(--text)", marginBottom: "0.4rem",
      }}>
        {p.title}
      </h3>

      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: p.accent, opacity: 0.6, marginBottom: "1.2rem",
      }}>
        {p.subtitle}
      </div>

      <p style={{
        fontFamily: "var(--font-body)", fontStyle: "italic",
        fontSize: "0.95rem", lineHeight: 1.7, color: "var(--muted)",
        marginBottom: "1.5rem",
      }}>
        {p.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "2rem" }}>
        {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <a href={p.github} target="_blank" rel="noopener"
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", textDecoration: "none", letterSpacing: "0.08em" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = p.accent)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          GitHub ↗
        </a>
        {p.live && (
          <a href={p.live} target="_blank" rel="noopener"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", textDecoration: "none", letterSpacing: "0.08em" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = p.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Live ↗
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Security / CTF ──────────────────────────────────────────────────────────

function Security() {
  return (
    <section id="security" style={{ padding: "8rem clamp(2rem, 8vw, 8rem)", maxWidth: "1200px" }}>
      <div className="label" style={{ marginBottom: "0.75rem" }}>// Security & CTF</div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)",
        fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)",
        marginBottom: "1rem",
      }}>
        Capture The Flag
      </h2>
      <p style={{
        fontFamily: "var(--font-body)", fontStyle: "italic",
        color: "var(--muted)", fontSize: "1.05rem", maxWidth: "560px",
        lineHeight: 1.7, marginBottom: "4rem",
      }}>
        Practical offensive security experience across web exploitation, network forensics, and binary challenges.
      </p>

      <div style={{ display: "grid", gap: "1.5px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {CTF.map((c) => (
          <div key={c.platform} style={{
            padding: "2rem",
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, marginBottom: "1.2rem",
              background: c.color + "15",
              border: `1px solid ${c.color}40`,
              borderRadius: 4,
              fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
              color: c.color, letterSpacing: "0.08em",
            }}>
              {c.label}
            </div>
            <h4 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem",
              color: "var(--text)", marginBottom: "1rem",
            }}>
              {c.platform}
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {c.items.map((item) => (
                <li key={item} style={{
                  fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)",
                  lineHeight: 1.5, display: "flex", gap: "8px",
                }}>
                  <span style={{ color: c.color, flexShrink: 0 }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" style={{
      padding: "8rem clamp(2rem, 8vw, 8rem)",
      borderTop: "1px solid var(--border)",
    }}>
      <div className="label" style={{ marginBottom: "0.75rem" }}>// Contact</div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)",
        fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: "2rem",
      }}>
        Let&rsquo;s work together.
      </h2>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[
          { label: "GitHub", href: "https://github.com/Nimaho71" },
          { label: "Email", href: "mailto:nils@nilshogberg.dev" },
        ].map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener" style={btnStyle("var(--accent)")}>
            {label} ↗
          </a>
        ))}
      </div>

      <p style={{
        marginTop: "6rem",
        fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)",
        letterSpacing: "0.08em",
      }}>
        © 2025 Nils Hogberg · Built with Next.js · Hosted on Vercel
      </p>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
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
