"use client";

import React, { useEffect, useId, useMemo, useState } from "react";

export type LocalEuropeNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type LocalEuropeLink = {
  id: string;
  from: string;
  to: string;
  strength?: number;
};

export interface LocalEuropeMapProps {
  className?: string;
  nodes?: LocalEuropeNode[];
  links?: LocalEuropeLink[];
  showGrid?: boolean;
}

const DEFAULT_NODES: LocalEuropeNode[] = [
  { id: "vienna", label: "Vienna", x: 35, y: 45 },
  { id: "berlin", label: "Berlin", x: 45, y: 30 },
  { id: "amsterdam", label: "Amsterdam", x: 35, y: 25 },
  { id: "lisbon", label: "Lisbon", x: 8, y: 60 },
  { id: "vilnius", label: "Vilnius", x: 60, y: 28 },
];

const DEFAULT_LINKS: LocalEuropeLink[] = [
  { id: "lisbon→vienna", from: "lisbon", to: "vienna", strength: 0.5 },
  { id: "amsterdam→berlin", from: "amsterdam", to: "berlin", strength: 0.7 },
  { id: "vienna→vilnius", from: "vienna", to: "vilnius", strength: 0.6 },
];

function arcPath(from: LocalEuropeNode, to: LocalEuropeNode, curvature = 0.3) {
  const x1 = from.x;
  const y1 = from.y;
  const x2 = to.x;
  const y2 = to.y;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  const nx = -dy;
  const ny = dx;
  const len = Math.hypot(nx, ny) || 1;
  const ox = (nx / len) * curvature * Math.hypot(dx, dy);
  const oy = (ny / len) * curvature * Math.hypot(dx, dy);

  const cx = mx + ox;
  const cy = my + oy;

  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;
}

export default function LocalEuropeMap({
  className,
  nodes = DEFAULT_NODES,
  links = DEFAULT_LINKS,
  showGrid = false,
}: LocalEuropeMapProps) {
  const [hoverNode, setHoverNode] = useState<LocalEuropeNode | null>(null);
  const [hoverLink, setHoverLink] = useState<(LocalEuropeLink & { d: string; width: number; opacity: number }) | null>(null);
  const maskId = useId();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.assert(Array.isArray(nodes) && nodes.length >= 3, "LocalEuropeMap: expected 3+ nodes");
      console.assert(
        links.every((l) => nodes.some((n) => n.id === l.from) && nodes.some((n) => n.id === l.to)),
        "LocalEuropeMap: link endpoints must exist in nodes",
      );
    }
  }, [nodes, links]);

  const nodeById = useMemo(() => {
    const map = new Map<string, LocalEuropeNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const computedLinks = useMemo(() => {
    return links
      .map((l) => {
        const from = nodeById.get(l.from);
        const to = nodeById.get(l.to);
        if (!from || !to) return null;
        return {
          ...l,
          d: arcPath(from, to),
          width: 0.6 + (l.strength ?? 0.5) * 1.4,
          opacity: 0.25 + (l.strength ?? 0.5) * 0.55,
        };
      })
      .filter(Boolean) as (LocalEuropeLink & { d: string; width: number; opacity: number })[];
  }, [links, nodeById]);

  return (
    <div className={["relative w-full overflow-hidden", className].filter(Boolean).join(" ")}>
      <svg viewBox="0 0 100 70" className="block h-64 w-full md:h-80">
        {showGrid && (
          <g className="opacity-20">
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 10}
                y1={0}
                x2={i * 10}
                y2={70}
                className="stroke-[0.1] stroke-muted-foreground"
              />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={i * 10}
                x2={100}
                y2={i * 10}
                className="stroke-[0.1] stroke-muted-foreground"
              />
            ))}
          </g>
        )}

        <rect x="0" y="0" width="100" height="70" className="fill-muted" rx="2" />

        <defs>
          <radialGradient id={maskId} cx="50%" cy="50%" r="70%">
            <stop offset="60%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <mask id={`${maskId}-mask`}>
            <rect x="0" y="0" width="100" height="70" fill={`url(#${maskId})`} />
          </mask>
        </defs>

        <g mask={`url(#${maskId}-mask)`}>
          {computedLinks.map((l) => (
            <path
              key={l.id}
              d={l.d}
              className="flow-path fill-none stroke-primary"
              strokeOpacity={hoverLink?.id === l.id ? 1 : l.opacity}
              strokeWidth={hoverLink?.id === l.id ? l.width + 0.6 : l.width}
              onMouseEnter={() => setHoverLink(l)}
              onMouseLeave={() => setHoverLink(null)}
            />
          ))}
          <style>{`
            .flow-path {
              stroke-dasharray: 4 6;
              animation: local-map-move 3s linear infinite;
            }
            @keyframes local-map-move {
              to { stroke-dashoffset: -10; }
            }
          `}</style>
        </g>

        {nodes.map((n) => (
          <g
            key={n.id}
            tabIndex={0}
            onFocus={() => setHoverNode(n)}
            onBlur={() => setHoverNode(null)}
            onMouseEnter={() => setHoverNode(n)}
            onMouseLeave={() => setHoverNode(null)}
            aria-label={n.label}
          >
            <circle cx={n.x} cy={n.y} r={2.1} className="fill-primary" />
            <circle cx={n.x} cy={n.y} r={4} className="fill-primary/10" />
            <text x={n.x + 2.5} y={n.y + 0.8} className="text-[2.2px] fill-foreground opacity-80">
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      {(hoverNode || hoverLink) && (
        <div className="pointer-events-none absolute inset-x-0 top-2 mx-auto w-max rounded-full border bg-background/90 px-3 py-1 text-xs shadow-sm">
          {hoverNode && <span><strong>{hoverNode.label}</strong></span>}
          {hoverLink && (
            <span>
              <strong className="mr-1">{hoverLink.id}</strong>
              <span className="opacity-70">(flow)</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
