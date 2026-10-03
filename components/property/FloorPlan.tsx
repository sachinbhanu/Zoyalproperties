"use client";

import { motion } from "framer-motion";
import type { Property } from "@/data/properties";

interface Room {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: "cyan" | "violet" | "gold";
}

const W = 640;
const H = 420;

function layoutFor(p: Property): Room[] {
  if (p.type === "Plot") {
    return [
      { label: `Plot · ${p.area.toLocaleString("en-IN")} sq ft`, x: 40, y: 40, w: 560, h: 340, tone: "cyan" },
      { label: "Buildable envelope", x: 100, y: 100, w: 440, h: 220, tone: "violet" },
    ];
  }
  if (p.type === "Commercial") {
    return [
      { label: "Open workspace", x: 20, y: 20, w: 400, h: 260, tone: "cyan" },
      { label: "Cabins", x: 420, y: 20, w: 200, h: 130, tone: "violet" },
      { label: "Conference", x: 420, y: 150, w: 200, h: 130, tone: "gold" },
      { label: "Pantry", x: 20, y: 280, w: 190, h: 120 },
      { label: "Reception", x: 210, y: 280, w: 210, h: 120, tone: "violet" },
      { label: "Washrooms", x: 420, y: 280, w: 200, h: 120 },
    ];
  }
  const beds = Math.max(1, p.bhk);
  const rooms: Room[] = [
    { label: "Living & Dining", x: 20, y: 20, w: 300, h: 230, tone: "cyan" },
    { label: "Kitchen", x: 20, y: 250, w: 140, h: 150 },
    { label: "Utility", x: 160, y: 250, w: 70, h: 150 },
    { label: "Balcony", x: 230, y: 250, w: 90, h: 150, tone: "gold" },
  ];
  const colX = 320;
  const colW = 300;
  const bedH = Math.min(150, (H - 40) / Math.min(beds, 3));
  const cols = beds > 3 ? 2 : 1;
  const bw = colW / cols;
  for (let i = 0; i < beds; i++) {
    const col = beds > 3 ? i % 2 : 0;
    const row = beds > 3 ? Math.floor(i / 2) : i;
    const rowsTotal = beds > 3 ? Math.ceil(beds / 2) : beds;
    const rh = (H - 40) / rowsTotal;
    rooms.push({
      label: i === 0 ? "Master bedroom" : `Bedroom ${i + 1}`,
      x: colX + col * bw,
      y: 20 + row * rh,
      w: bw,
      h: Math.min(rh, bedH + 40),
      tone: i === 0 ? "violet" : undefined,
    });
  }
  return rooms;
}

const tone = (t?: Room["tone"]) =>
  t === "cyan" ? "rgb(var(--cyan) / 0.14)" : t === "violet" ? "rgb(var(--violet) / 0.16)" : t === "gold" ? "rgb(var(--gold) / 0.16)" : "rgb(var(--line) / 0.06)";

export function FloorPlan({ property: p }: { property: Property }) {
  const rooms = layoutFor(p);
  return (
    <figure>
      <div className="glass glow-border overflow-hidden rounded-3xl p-4 sm:p-8">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Schematic floor plan of a ${p.bhk > 0 ? `${p.bhk} BHK ` : ""}${p.type.toLowerCase()}`}>
          <defs>
            <pattern id="fp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgb(var(--line) / 0.07)" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#fp-grid)" />
          {rooms.map((r, i) => (
            <motion.g key={r.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}>
              <motion.rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx="4"
                fill={tone(r.tone)}
                stroke="rgb(var(--fg) / 0.7)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 1 }}
              />
              <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="500" fill="rgb(var(--fg))">
                {r.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted">Schematic floor plan for illustration — not to scale. Final layouts are subject to approval.</figcaption>
    </figure>
  );
}
