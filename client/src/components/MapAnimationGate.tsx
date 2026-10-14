"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./MapRoutes.module.css";

export default function MapAnimationGate({ children }: { children: ReactNode }) {
  const gate = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = gate.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => { element.dataset.running = String(inView && !document.hidden && !preference.matches); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", update);
    };
  }, []);
  return <div ref={gate} className={styles.gate} data-running="false">{children}</div>;
}
