"use client";

import React, { useEffect, useId, useRef, useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "Define the Workforce Need",
    short:
      "Start with the roles, headcount, location and timing your business needs.",
    bring: "The roles, headcount, work location and target timing.",
    clarify: "The skills, working conditions and requirements that sourcing needs to reflect.",
    result: "A hiring brief that gives the next steps a clear starting point.",
  },
  {
    id: 2,
    title: "Read the Talent Landscape",
    short:
      "Assess sourcing options against the requirements of the role.",
    bring: "Your role requirements and any sourcing options you already have in mind.",
    clarify: "Relevant labour-market signals, candidate availability and assumptions that need testing.",
    result: "Sourcing options your team can evaluate against the actual requirement.",
  },
  {
    id: 3,
    title: "Check the Pressure Points",
    short:
      "Surface eligibility, documentation and timing questions early.",
    bring: "Known requirements, deadlines and any questions already holding up the plan.",
    clarify: "Eligibility questions, documentation needs and dependencies requiring verification.",
    result: "A clear view of what needs checking before you commit to the route.",
  },
  {
    id: 4,
    title: "Map the Hiring Route",
    short:
      "Connect sourcing, screening and mobility through clear responsibilities.",
    bring: "Your hiring process and the people responsible for each handoff.",
    clarify: "How sourcing, screening and mobility steps connect across your team and relevant partners.",
    result: "A route with responsibilities and dependencies made explicit.",
  },
  {
    id: 5,
    title: "Agree the Next Steps",
    short:
      "Define the scope, verification points and actions your team can take.",
    bring: "Your priorities, open questions and the decisions your team needs to make.",
    clarify: "The service scope, documented assumptions and next concrete actions.",
    result: "An agreed scope, clear responsibilities and actions to move the hiring plan forward. You retain the hiring decision.",
  },
];

function AnimatedNetworkCanvas({ activeStep }: { activeStep: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number | undefined;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isInViewport = false;
    let lastFrame = 0;
    const shouldAnimate = () => isInViewport && !document.hidden && !motionPreference.matches;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const POINT_COUNT = 40;
    const points = Array.from({ length: POINT_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    const draw = (timestamp = 0) => {
      if (timestamp && timestamp - lastFrame < 1000 / 30 && shouldAnimate()) {
        animationFrameId = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = timestamp;
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
        if (shouldAnimate()) {
          p.x += p.vx * 2;
          p.y += p.vy * 2;
        }

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

      if (shouldAnimate()) animationFrameId = window.requestAnimationFrame(draw);
    };

    const handleMotionChange = () => {
      if (animationFrameId !== undefined) window.cancelAnimationFrame(animationFrameId);
      animationFrameId = undefined;
      lastFrame = 0;
      draw();
    };
    const handleResize = () => {
      resize();
      if (!shouldAnimate()) draw();
    };
    const observer = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting;
      handleMotionChange();
    });
    observer.observe(canvas);
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleMotionChange);
    motionPreference.addEventListener("change", handleMotionChange);
    draw();

    return () => {
      if (animationFrameId !== undefined) window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleMotionChange);
      observer.disconnect();
      motionPreference.removeEventListener("change", handleMotionChange);
    };
  }, [activeStep]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [mobileOpenStep, setMobileOpenStep] = useState<number | null>(1);
  const instanceId = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleStepChange = (next: number) => {
    const clamped = ((next - 1 + STEPS.length) % STEPS.length) + 1;
    setActiveStep(clamped);
    if (!hasInteracted) setHasInteracted(true);
  };

  const goPrev = () => handleStepChange(activeStep - 1);
  const goNext = () => handleStepChange(activeStep + 1);
  const handleTabKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % STEPS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + STEPS.length) % STEPS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = STEPS.length - 1;
    else return;
    event.preventDefault();
    handleStepChange(STEPS[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section
      id="how-it-works"
      className="relative w-full overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/80 py-10 px-6 md:px-10"
    >
      <AnimatedNetworkCanvas activeStep={activeStep} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

      <div className="relative space-y-8">
        <div className="space-y-2 max-w-3xl">
          <p className="sufoniq-meta-label !text-sky-300">Planning your hiring route</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
            You steer. We sharpen the map.
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            You bring the workforce requirement. These five planning steps help us assess the market, test assumptions and agree a hiring route before delivery begins.
          </p>
          <p className="text-xs md:text-sm text-sky-200/80">
            Explore each step to see what we clarify together.
          </p>
          <p className="hidden md:block text-xs text-slate-400">Use the left and right arrow keys when a step is focused.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-3 md:hidden">
            {STEPS.map((step) => {
              const isOpen = mobileOpenStep === step.id;
              return (
                <div key={step.id} className={`overflow-hidden rounded-3xl border ${isOpen ? "border-sky-400/80 bg-slate-900/80 ring-1 ring-sky-400/20" : "border-slate-700/60 bg-slate-900/50"}`}>
                  <h3>
                    <button
                      type="button"
                      id={`${instanceId}-mobile-step-${step.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`${instanceId}-mobile-panel-${step.id}`}
                      onClick={() => {
                        setMobileOpenStep(isOpen ? null : step.id);
                        if (!isOpen) handleStepChange(step.id);
                      }}
                      className="flex min-h-12 w-full items-start gap-3 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-300"
                    >
                      <span className={`shrink-0 text-sm font-semibold tabular-nums ${isOpen ? "text-sky-300" : "text-slate-400"}`} aria-hidden="true">{String(step.id).padStart(2, "0")}</span>
                      <span className="flex-1"><span className="block text-sm font-medium text-slate-50">{step.title}</span><span className="mt-1 block text-xs font-normal leading-relaxed text-slate-300">{step.short}</span></span>
                      <span className="shrink-0 text-lg leading-5 text-sky-300" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                    </button>
                  </h3>
                  <div id={`${instanceId}-mobile-panel-${step.id}`} role="region" aria-labelledby={`${instanceId}-mobile-step-${step.id}`} hidden={!isOpen} className="border-t border-slate-700/60 px-4 py-4 text-sm leading-relaxed text-slate-200">
                    <StepDetails step={step} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="relative hidden md:block">
            {hasInteracted && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous step"
                  className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-slate-600/80 bg-slate-950/90 text-slate-200 text-xs hover:border-sky-400/70 hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:ring-offset-0 transition-colors z-20"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next step"
                  className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-slate-600/80 bg-slate-950/90 text-slate-200 text-xs hover:border-sky-400/70 hover:text-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:ring-offset-0 transition-colors z-20"
                >
                  →
                </button>
              </>
            )}

            <div className="flex flex-col md:flex-row gap-3 md:gap-4" role="tablist" aria-label="Explore the hiring process">
              {STEPS.map((step, index) => {
                const isActive = activeStep === step.id;

                const base =
                  "group relative rounded-3xl border px-4 py-3 text-left transition-colors duration-300 ease-out flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none";

                const inactiveDesktop = " border-slate-700/60 bg-slate-900/50 hover:border-slate-500/80 hover:bg-slate-900/70";

                const activeDesktop = " border-sky-400/80 bg-slate-900/80 ring-1 ring-sky-400/20";

                return (
                  <button
                    key={step.id}
                    type="button"
                    ref={(element) => { tabs.current[index] = element; }}
                    id={`${instanceId}-step-${step.id}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${instanceId}-panel-${step.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onKeyDown={(event) => handleTabKey(event, index)}
                    onClick={() => handleStepChange(step.id)}
                    className={base + (isActive ? activeDesktop : inactiveDesktop)}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span className={`shrink-0 text-xs font-semibold tabular-nums ${isActive ? "text-sky-300" : "text-slate-400"}`} aria-hidden="true">{String(step.id).padStart(2, "0")}</span>
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

          <div className="hidden md:block">
          {STEPS.map((step) => (
            <div
              key={step.id}
              id={`${instanceId}-panel-${step.id}`}
              role="tabpanel"
              aria-labelledby={`${instanceId}-step-${step.id}`}
              hidden={activeStep !== step.id}
              tabIndex={0}
              className="mt-2 rounded-3xl border border-slate-700/80 bg-slate-950/80 p-4 md:p-5 text-sm md:text-base text-slate-200 leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <h3 className="mb-4 text-sm font-semibold text-sky-200">{String(step.id).padStart(2, "0")} / {step.title}</h3>
              <StepDetails step={step} />
            </div>
          ))}
          </div>

          <p className="text-xs md:text-sm text-slate-400 pt-1">
            It’s still your decision. We help make the logic clear.
          </p>
        </div>
      </div>
    </section>
  );
}

function StepDetails({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <>
      <p className="mb-2"><strong className="font-medium text-slate-50">You bring:</strong> {step.bring}</p>
      <p className="mb-2"><strong className="font-medium text-slate-50">We clarify:</strong> {step.clarify}</p>
      <p className="text-slate-300"><strong className="font-medium text-slate-50">Together:</strong> {step.result}</p>
    </>
  );
}
