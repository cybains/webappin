"use client";

import React, { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "You Start by Seeing the Landscape Clearly",
    short:
      "Step back from the noise and see Europe as a set of systems, not just borders.",
  },
  {
    id: 2,
    title: "You Explore Where Your Capabilities Fit Best",
    short:
      "Match your skills and direction with places and sectors that can actually use them.",
  },
  {
    id: 3,
    title: "You Identify the Frictions Before They Surprise You",
    short:
      "Surface constraints early so your expectations match the real terrain.",
  },
  {
    id: 4,
    title: "You Navigate Mobility With Confidence",
    short:
      "Turn borders into logistics, not barriers, across jobs, cities, and projects.",
  },
  {
    id: 5,
    title: "You Shape a Path That Actually Holds Up",
    short:
      "Co-create a strategy that makes economic sense and personal sense.",
  },
];

function AnimatedNetworkCanvas({ activeStep }: { activeStep: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const POINT_COUNT = 40;
    const points = Array.from({ length: POINT_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "rgba(4, 7, 15, 0.9)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < POINT_COUNT; i++) {
        for (let j = i + 1; j < POINT_COUNT; j++) {
          const p1 = points[i];
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = 1 - dist / 140;
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      points.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const baseRadius = 2;
        const pulse =
          index % STEPS.length === (activeStep - 1) % STEPS.length ? 1.2 : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, baseRadius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(226, 232, 240, 0.7)";
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [activeStep]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const handleStepChange = (next: number) => {
    const clamped = ((next - 1 + STEPS.length) % STEPS.length) + 1;
    setActiveStep(clamped);
    if (!hasInteracted) setHasInteracted(true);
  };

  const goPrev = () => handleStepChange(activeStep - 1);
  const goNext = () => handleStepChange(activeStep + 1);

  return (
    <section
      id="how-it-works"
      className="relative w-full overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/80 py-10 px-6 md:px-10"
    >
      <AnimatedNetworkCanvas activeStep={activeStep} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

      <div className="relative space-y-8">
        <div className="space-y-2 max-w-3xl">
          <p className="sufoniq-meta-label text-sky-300">How It Works</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
            You steer. We sharpen the map.
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            A clearer strategy starts with how you see Europe — and how we help you read it.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            {hasInteracted && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-slate-600/80 bg-slate-950/90 text-slate-200 text-xs hover:border-sky-400/70 hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:ring-offset-0 transition-colors z-20"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-slate-600/80 bg-slate-950/90 text-slate-200 text-xs hover:border-sky-400/70 hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:ring-offset-0 transition-colors z-20"
                >
                  →
                </button>
              </>
            )}

            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              {STEPS.map((step) => {
                const isActive = activeStep === step.id;

                const base =
                  "group relative rounded-3xl border border-slate-800/70 bg-slate-950/70 px-4 py-3 text-left transition-all duration-300 ease-out flex-1";

                const inactiveDesktop = hasInteracted
                  ? " md:flex-[0.9] md:opacity-60 md:scale-[0.985] hover:border-slate-500/80 hover:bg-slate-900/70 border-slate-700/60 bg-slate-900/50"
                  : " border-slate-700/60 bg-slate-900/50 hover:border-slate-500/80 hover:bg-slate-900/70";

                const activeDesktop = hasInteracted
                  ? " md:flex-[1.25] md:translate-x-2 md:z-10 border-sky-400/70 bg-slate-900/80"
                  : " border-sky-400/70 bg-slate-900/80";

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepChange(step.id)}
                    className={base + (isActive ? activeDesktop : inactiveDesktop)}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span className="mt-[1px] h-1.5 w-6 rounded-full bg-sky-400/80" />
                      <span className="text-xs md:text-sm font-medium text-slate-50">
                        {step.title}
                      </span>
                    </div>
                    <p className="text-[11px] md:text-xs text-slate-300">{step.short}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-4 md:p-5 text-sm md:text-base text-slate-200 leading-relaxed">
            {activeStep === 1 && (
              <>
                <p className="mb-2">
                  You step back from the noise and look at Europe the way an economist would: not as a map of
                  countries, but as a set of shifting systems.
                </p>
                <p className="mb-2">
                  We help you interpret what actually matters — where momentum is building, where it’s cooling, and
                  where your ambitions intersect with reality.
                </p>
                <p className="text-slate-300">This is where your direction begins: with clarity, not guesswork.</p>
              </>
            )}
            {activeStep === 2 && (
              <>
                <p className="mb-2">
                  You’re not choosing random destinations or sectors. You’re matching your skills, interests, and
                  trajectory with places and industries that are genuinely receptive to them.
                </p>
                <p className="mb-2">
                  We help you read the subtle signals: the pull of talent, the rise of certain clusters, the places
                  where people like you tend to thrive.
                </p>
                <p className="text-slate-300">You bring the capability. We help you place it where it compounds.</p>
              </>
            )}
            {activeStep === 3 && (
              <>
                <p className="mb-2">
                  Every plan has pressure points — economic, regulatory, or practical. You get ahead of them.
                </p>
                <p className="mb-2">
                  We help you understand what might slow you down, redirect you, or demand trade-offs — so your
                  expectations match the real terrain.
                </p>
                <p className="text-slate-300">Good strategy isn’t about avoiding friction. It’s about anticipating it.</p>
              </>
            )}
            {activeStep === 4 && (
              <>
                <p className="mb-2">
                  Whether you’re changing jobs, crossing borders, considering a new city, or building something of
                  your own — mobility is the engine behind your next step.
                </p>
                <p className="mb-2">
                  We bring the frameworks, pathways, and practical understanding. You decide how far you want to go.
                </p>
                <p className="text-slate-300">Borders become logistics, not barriers.</p>
              </>
            )}
            {activeStep === 5 && (
              <>
                <p className="mb-2">
                  With the landscape, your strengths, the constraints, and the mobility routes in view, your path
                  becomes visible — usually clearer than you expected.
                </p>
                <p className="mb-2">
                  We work with you to refine it: the direction, the rationale, the timeline, and the next concrete
                  actions.
                </p>
                <p className="text-slate-300">
                  The result isn’t a plan we hand you. It’s a strategy we build together — one that makes economic
                  sense and personal sense.
                </p>
              </>
            )}
          </div>

          <p className="text-xs md:text-sm text-slate-400 pt-1">
            It’s still your journey. We just make sure the logic is on your side.
          </p>
        </div>
      </div>
    </section>
  );
}
