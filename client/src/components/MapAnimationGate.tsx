"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./MapRoutes.module.css";

type PulseRoute = { path: string; width: number; phase: number; color: string };

export default function MapAnimationGate({ children, routes }: { children: ReactNode; routes: PulseRoute[] }) {
  const gate = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = gate.current;
    const surface = canvas.current;
    const ctx = surface?.getContext("2d");
    if (!element || !surface || !ctx) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    // Cache geometry once. No per-frame SVG measurements or React updates.
    const paths = routes.map(route => {
      const measure = document.createElementNS("http://www.w3.org/2000/svg", "path");
      measure.setAttribute("d", route.path);
      return { ...route, shape: new Path2D(route.path), length: measure.getTotalLength() };
    });
    let inView = false;
    let frame: number | undefined;
    let lastFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let elapsed = 0;
    let previous = 0;
    const running = () => inView && !document.hidden && !preference.matches;
    const draw = (timestamp: number) => {
      frame = undefined;
      if (!running()) return;
      frame = requestAnimationFrame(draw);
      if (timestamp - lastFrame < 1000 / 24) return;
      if (previous) elapsed += Math.min(timestamp - previous, 100);
      previous = timestamp;
      lastFrame = timestamp;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, surface.width, surface.height);
      const scale = Math.max(width / 1440, height / 900);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * (width - 1440 * scale) / 2, dpr * (height - 900 * scale) / 2);
      ctx.lineCap = "round";
      ctx.globalAlpha = .75;
      const count = mobile.matches ? Math.min(6, paths.length) : paths.length;
      for (let index = 0; index < count; index++) {
        const route = paths[index];
        ctx.strokeStyle = route.color;
        ctx.lineWidth = route.width;
        ctx.setLineDash([route.length * .28, route.length * 1.72]);
        ctx.lineDashOffset = route.length * (2 - ((elapsed / 1000 + route.phase) % 16) / 8);
        ctx.stroke(route.shape);
      }
    };
    const update = () => {
      element.dataset.running = String(running());
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      previous = 0;
      if (running()) frame = requestAnimationFrame(draw);
      else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, surface.width, surface.height);
      }
    };
    const resize = () => {
      width = element.clientWidth;
      height = element.clientHeight;
      // Decorative layer: bound backing-store memory on high-density screens.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      surface.width = Math.round(width * dpr);
      surface.height = Math.round(height * dpr);
      update();
    };
    resize();
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(element);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", update);
    mobile.addEventListener("change", update);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
    };
  }, [routes]);
  return <div ref={gate} className={styles.gate} data-running="false">{children}<canvas ref={canvas} className={styles.pulseCanvas} aria-hidden="true" /></div>;
}
