"use client";

import { Building2, Users, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: number;
};


const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};


const FeatureCard = ({ icon, title, desc, index }: FeatureProps) => (
  <div className="feat-card" style={{ animationDelay: `${0.05 + index * 0.08}s` }}>
    <div className="feat-icon">{icon}</div>
    <div>
      <p className="feat-title">{title}</p>
      <p className="feat-desc">{desc}</p>
    </div>
    <style>{`
      .feat-card {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.4rem 1.25rem;
        border-radius: 14px;
        background: #ffffff;
        border: 1px solid #eaecf0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
        transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
        animation: riseIn 0.5s ease both;
        cursor: default;
      }
      .feat-card:hover {
        box-shadow: 0 8px 24px rgba(37,99,235,0.1), 0 2px 6px rgba(0,0,0,0.06);
        border-color: rgba(37,99,235,0.25);
        transform: translateY(-3px);
      }
      .feat-icon {
        flex-shrink: 0;
        width: 40px; height: 40px;
        border-radius: 10px;
        background: #eff6ff;
        border: 1px solid #dbeafe;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2563eb;
      }
      .feat-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #0f172a;
        margin: 0 0 0.2rem;
        letter-spacing: -0.01em;
      }
      .feat-desc {
        font-size: 0.8rem;
        color: #64748b;
        margin: 0;
        line-height: 1.55;
      }
    `}</style>
  </div>
);


const AboutSection = () => {
  return (
    <section id="about" className="ab-root">

      {/* Subtle dot pattern */}
      <div className="ab-dots" aria-hidden />

      {/* Top accent line */}
      <div className="ab-topline" aria-hidden />

      <div className="ab-inner">

        {/* ── HEADER ── */}
        <div className="ab-header">
          <span className="ab-eyebrow">About the Platform</span>
          <h2 className="ab-title">
            Rethinking how boarding houses{" "}
            <span className="ab-title-accent">are managed</span>
          </h2>
          <p className="ab-sub">
            E-Boarding brings together tenants, rooms, and operations in one
            clean, modern platform built for the way property managers actually work.
          </p>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="ab-main">

          {/* LEFT: TEXT + STATS */}
          <div className="ab-left">
            <div className="ab-tag">Smarter Management</div>
            <h3 className="ab-left-h">
              Everything you need, nothing you don't
            </h3>
            <p className="ab-left-p">
              Built for landlords and administrators who need efficiency without
              complexity. Track occupancy, manage users, and handle daily
              operations all in one unified interface.
            </p>
            <p className="ab-left-p">
              Whether you run a single boarding house or a growing property
              portfolio, E-Boarding adapts to your scale and pace.
            </p>

            <a href="#" className="ab-cta">
              See how it works <ArrowRight size={15} />
            </a>

            {/* STATS */}
            <div className="ab-stats">
              {[
                { value: 99,  suffix: "%", label: "System Uptime" },
                { value: 3,   suffix: "×", label: "Faster Operations" },
                { value: 500, suffix: "+", label: "Properties Managed" },
              ].map((s) => (
                <div className="ab-stat" key={s.label}>
                  <span className="ab-stat-val">
                    <Counter target={s.value} suffix={s.suffix} />
                  </span>
                  <span className="ab-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: FEATURE CARDS */}
          <div className="ab-cards">
            {[
              { icon: <Users size={18} />,      title: "User Management",  desc: "Manage tenants and staff with role-based access controls" },
              { icon: <Building2 size={18} />,   title: "Room Tracking",    desc: "Monitor availability and occupancy across all units, live" },
              { icon: <ShieldCheck size={18} />, title: "Secure System",    desc: "Encrypted sessions, permissions, and audit-ready logs" },
              { icon: <Sparkles size={18} />,    title: "Modern Interface", desc: "A clean, intuitive UI designed for daily operational ease" },
            ].map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>

        </div>

        {/* ── MISSION / VISION ── */}
        <div className="ab-mv">

          <div className="ab-mv-card">
            <div className="ab-mv-bar" />
            <span className="ab-mv-chip">Mission</span>
            <h4 className="ab-mv-h">What drives us</h4>
            <p className="ab-mv-p">
              To simplify and modernize boarding house management through
              intuitive, efficient digital tools — empowering every landlord and
              tenant with the clarity they deserve.
            </p>
          </div>

          <div className="ab-mv-card">
            <div className="ab-mv-bar ab-mv-bar-v" />
            <span className="ab-mv-chip ab-mv-chip-v">Vision</span>
            <h4 className="ab-mv-h">Where we're headed</h4>
            <p className="ab-mv-p">
              To become the leading platform for property management in the
              region — giving owners smart tools and seamless experiences that
              scale with their ambitions.
            </p>
          </div>

        </div>

      </div>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&family=Mulish:wght@300;400;500;600&display=swap');

        .ab-root {
          position: relative;
          padding: 5.5rem 1.5rem;
          background: #ffffff;
          overflow: hidden;
          font-family: 'Mulish', sans-serif;
          color: #334155;
        }

        /* DOT PATTERN */
        .ab-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.4;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
        }

        /* TOP ACCENT */
        .ab-topline {
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #2563eb 40%, #60a5fa 60%, transparent);
          border-radius: 0 0 4px 4px;
        }

        /* INNER */
        .ab-inner {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 4rem;
          z-index: 1;
        }

        /* HEADER */
        .ab-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto;
          animation: riseIn 0.6s ease both;
        }
        .ab-eyebrow {
          display: inline-block;
          font-family: 'Mulish', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
          margin-bottom: 1.25rem;
        }
        .ab-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(1.75rem, 4vw, 2.7rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.18;
          letter-spacing: -0.025em;
          margin: 0 0 1rem;
        }
        .ab-title-accent {
          color: #2563eb;
          position: relative;
          display: inline-block;
        }
        .ab-title-accent::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #2563eb, #93c5fd);
          border-radius: 2px;
          opacity: 0.45;
        }
        .ab-sub {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
          font-weight: 400;
        }

        /* MAIN */
        .ab-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3.5rem;
          align-items: center;
          animation: riseIn 0.6s ease 0.1s both;
        }
        @media (max-width: 768px) {
          .ab-main { grid-template-columns: 1fr; gap: 2rem; }
        }

        /* LEFT */
        .ab-tag {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 0.75rem;
        }
        .ab-left-h {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(1.1rem, 2.5vw, 1.45rem);
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
          letter-spacing: -0.02em;
          margin: 0 0 1rem;
        }
        .ab-left-p {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.75;
          margin: 0 0 0.85rem;
        }
        .ab-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2563eb;
          text-decoration: none;
          margin-top: 0.25rem;
          transition: gap 0.2s;
        }
        .ab-cta:hover { gap: 10px; }

        /* STATS */
        .ab-stats {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
          padding-top: 1.75rem;
          border-top: 1px solid #f1f5f9;
        }
        .ab-stat { display: flex; flex-direction: column; gap: 2px; }
        .ab-stat-val {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .ab-stat-lbl {
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* CARDS */
        .ab-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        /* MISSION / VISION */
        .ab-mv {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          animation: riseIn 0.6s ease 0.2s both;
        }
        @media (max-width: 640px) {
          .ab-mv { grid-template-columns: 1fr; }
        }
        .ab-mv-card {
          position: relative;
          padding: 2rem;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .ab-mv-card:hover {
          box-shadow: 0 10px 32px rgba(0,0,0,0.07);
          transform: translateY(-3px);
        }
        .ab-mv-bar {
          position: absolute;
          top: 0; left: 0;
          width: 56px; height: 3px;
          background: #2563eb;
          border-radius: 0 0 4px 0;
        }
        .ab-mv-bar-v { background: #0ea5e9; }
        .ab-mv-chip {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          padding: 0.22rem 0.65rem;
          border-radius: 5px;
          margin-bottom: 0.85rem;
        }
        .ab-mv-chip-v {
          color: #0ea5e9;
          background: #f0f9ff;
          border-color: #bae6fd;
        }
        .ab-mv-h {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.6rem;
          letter-spacing: -0.015em;
        }
        .ab-mv-p {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        /* ANIMATION */
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;