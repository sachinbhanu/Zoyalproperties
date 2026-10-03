"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { calculateEmi } from "@/lib/emi";
import { formatINR, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

function AnimatedNumber({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(prev.current, value, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    prev.current = value;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {label}
        </label>
        <span className="font-display text-lg font-semibold text-fg">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input w-full"
        style={{ ["--pct" as string]: `${pct}%` }}
      />
    </div>
  );
}

const W = 520;
const H = 190;

export function EmiCalculator({ defaultPrice = 15000000, compact = false }: { defaultPrice?: number; compact?: boolean }) {
  const [price, setPrice] = useState(defaultPrice);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const loan = price * (1 - down / 100);
  const result = useMemo(() => calculateEmi(loan, rate, years), [loan, rate, years]);
  const interestShare = result.totalPayment > 0 ? result.totalInterest / result.totalPayment : 0;

  // Donut
  const R = 62;
  const C = 2 * Math.PI * R;

  // Balance curve
  const points = useMemo(() => {
    const pts = [{ x: 0, y: loan }, ...result.schedule.map((s) => ({ x: s.year, y: s.balance }))];
    return pts.map((p) => [(p.x / years) * W, H - 14 - (loan > 0 ? (p.y / loan) * (H - 34) : 0)] as const);
  }, [result.schedule, loan, years]);
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H - 14} L0,${H - 14} Z`;
  const gradId = useId();

  return (
    <div className={cn("grid gap-8", compact ? "" : "lg:grid-cols-[1fr_1.1fr] lg:gap-12")}>
      <div className="space-y-7">
        <Slider label="Property price" value={price} min={2000000} max={300000000} step={500000} onChange={setPrice} display={formatPrice(price)} />
        <Slider label="Down payment" value={down} min={10} max={80} step={1} onChange={setDown} display={`${down}% · ${formatPrice(price * (down / 100))}`} />
        <Slider label="Interest rate (p.a.)" value={rate} min={6} max={14} step={0.1} onChange={setRate} display={`${rate.toFixed(1)}%`} />
        <Slider label="Loan tenure" value={years} min={5} max={30} step={1} onChange={setYears} display={`${years} years`} />
      </div>

      <div className="glass glow-border rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative h-44 w-44 shrink-0">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" role="img" aria-label={`Principal ${Math.round((1 - interestShare) * 100)} percent, interest ${Math.round(interestShare * 100)} percent`}>
              <circle cx="80" cy="80" r={R} fill="none" stroke="rgb(var(--line) / 0.12)" strokeWidth="16" />
              <motion.circle
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke="rgb(var(--cyan))"
                strokeWidth="16"
                strokeLinecap="round"
                initial={false}
                animate={{ strokeDasharray: `${Math.max(0, C * (1 - interestShare) - 5)} ${C}`, strokeDashoffset: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.circle
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke="rgb(var(--gold))"
                strokeWidth="16"
                strokeLinecap="round"
                initial={false}
                animate={{ strokeDasharray: `${Math.max(0, C * interestShare - 5)} ${C}`, strokeDashoffset: -(C * (1 - interestShare)) }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Interest</span>
              <span className="font-display text-3xl font-semibold text-gold">{Math.round(interestShare * 100)}%</span>
            </div>
          </div>

          <div className="w-full space-y-1 text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Monthly EMI</p>
            <p className="text-gradient font-display text-4xl font-semibold sm:text-5xl" aria-live="polite">
              <AnimatedNumber value={result.emi} format={formatINR} />
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="flex items-center gap-1.5 text-muted">
                  <span className="h-2 w-2 rounded-full bg-cyan" /> Loan amount
                </dt>
                <dd className="font-medium text-fg">
                  <AnimatedNumber value={loan} format={formatPrice} />
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-muted">
                  <span className="h-2 w-2 rounded-full bg-gold" /> Total interest
                </dt>
                <dd className="font-medium text-fg">
                  <AnimatedNumber value={result.totalInterest} format={formatPrice} />
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">Total payable</dt>
                <dd className="font-medium text-fg">
                  <AnimatedNumber value={result.totalPayment} format={formatPrice} />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Outstanding balance over {years} years</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Loan balance declining over tenure">
            <defs>
              <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--cyan))" stopOpacity="0.45" />
                <stop offset="100%" stopColor="rgb(var(--violet))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1="0" x2={W} y1={14 + (H - 34) * g} y2={14 + (H - 34) * g} stroke="rgb(var(--line) / 0.1)" strokeDasharray="4 6" />
            ))}
            <motion.path d={area} fill={`url(#${gradId})`} initial={false} animate={{ d: area }} transition={{ duration: 0.6 }} />
            <motion.path d={line} fill="none" stroke="rgb(var(--cyan))" strokeWidth="2.5" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeOut" }} />
            <line x1="0" x2={W} y1={H - 14} y2={H - 14} stroke="rgb(var(--line) / 0.3)" />
            {[0, 0.5, 1].map((t) => (
              <text key={t} x={t === 0 ? 0 : t === 1 ? W : W * t} y={H} textAnchor={t === 0 ? "start" : t === 1 ? "end" : "middle"} fontSize="11" fill="rgb(var(--muted))">
                {t === 0 ? "Year 0" : `Year ${Math.round(years * t)}`}
              </text>
            ))}
          </svg>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted">Indicative figures on a reducing-balance basis. Actual rates and eligibility are decided by your lender.</p>
      </div>
    </div>
  );
}
