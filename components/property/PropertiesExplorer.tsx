"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { LayoutGrid, List, RotateCcw, SearchX } from "lucide-react";
import { BHK_OPTIONS, BUDGETS, CITIES, PROPERTY_TYPES, STATUSES, properties } from "@/data/properties";
import { SORT_OPTIONS, filterProperties, filtersFromParams, filtersToQuery, type Filters } from "@/lib/filters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function CardSkeleton({ list }: { list: boolean }) {
  return list ? (
    <div className="glass flex flex-col overflow-hidden rounded-3xl md:flex-row">
      <Skeleton className="aspect-[16/10] w-full rounded-none md:aspect-auto md:h-56 md:w-[360px]" />
      <div className="flex-1 space-y-3 p-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  ) : (
    <div className="glass overflow-hidden rounded-3xl">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function PropertiesExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const filters = useMemo(() => filtersFromParams((k) => params.get(k)), [params]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  const results = useMemo(() => filterProperties(properties, filters), [filters]);
  const filterKey = JSON.stringify(filters);

  // brief skeleton state whenever the result set changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [filterKey]);

  const update = (patch: Partial<Filters>) => {
    router.replace(`${pathname}${filtersToQuery({ ...filters, ...patch })}`, { scroll: false });
  };
  const reset = () => router.replace(pathname, { scroll: false });
  const activeCount = (["city", "type", "bhk", "status"] as const).filter((k) => filters[k]).length + (filters.budget !== "any" ? 1 : 0);

  return (
    <div>
      {/* Filters */}
      <div className="glass glow-border rounded-3xl p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Select label="City" value={filters.city} onChange={(e) => update({ city: e.target.value })} options={[{ value: "", label: "All cities" }, ...CITIES.map((c) => ({ value: c, label: c }))]} />
          <Select label="Type" value={filters.type} onChange={(e) => update({ type: e.target.value })} options={[{ value: "", label: "All types" }, ...PROPERTY_TYPES.map((c) => ({ value: c, label: c }))]} />
          <Select label="Budget" value={filters.budget} onChange={(e) => update({ budget: e.target.value })} options={BUDGETS.map((b) => ({ value: b.id, label: b.label }))} />
          <Select label="BHK" value={filters.bhk} onChange={(e) => update({ bhk: e.target.value })} options={[{ value: "", label: "Any BHK" }, ...BHK_OPTIONS.map((n) => ({ value: String(n), label: n === 5 ? "5+ BHK" : `${n} BHK` }))]} />
          <Select label="Status" value={filters.status} onChange={(e) => update({ status: e.target.value })} options={[{ value: "", label: "Any status" }, ...STATUSES.map((s) => ({ value: s, label: s }))]} />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line/10 pt-5">
          <p className="text-sm text-muted" role="status" aria-live="polite">
            <span className="font-display text-xl font-semibold text-fg">{results.length}</span> {results.length === 1 ? "property" : "properties"} found
            {activeCount > 0 && (
              <button type="button" onClick={reset} className="ml-4 inline-flex items-center gap-1.5 text-xs text-cyan hover:underline">
                <RotateCcw className="h-3.5 w-3.5" /> Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
              </button>
            )}
          </p>
          <div className="flex items-center gap-3">
            <Select label="Sort" wrapperClassName="w-52" value={filters.sort} onChange={(e) => update({ sort: e.target.value })} options={SORT_OPTIONS.map((s) => ({ value: s.id, label: s.label }))} />
            <div className="mt-5 flex rounded-full border border-line/20 p-1" role="group" aria-label="Layout">
              {(
                [
                  ["grid", LayoutGrid, "Grid view"],
                  ["list", List, "List view"],
                ] as const
              ).map(([id, Icon, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  aria-pressed={view === id}
                  aria-label={label}
                  className={cn("relative flex h-9 w-9 items-center justify-center rounded-full transition", view === id ? "text-[rgb(4_7_18)]" : "text-muted hover:text-fg")}
                >
                  {view === id && <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-brand-gradient" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <Icon className="relative h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-10" aria-busy={loading}>
        {loading ? (
          <div className={cn(view === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-6")}>
            {Array.from({ length: Math.min(6, Math.max(3, results.length)) }).map((_, i) => (
              <CardSkeleton key={i} list={view === "list"} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass mx-auto flex max-w-lg flex-col items-center rounded-3xl p-12 text-center">
            <SearchX className="h-12 w-12 text-cyan" />
            <h3 className="mt-4 font-display text-2xl font-semibold">No properties match</h3>
            <p className="mt-2 text-sm text-muted">Try widening your budget or choosing a different city.</p>
            <Button onClick={reset} className="mt-6" variant="ghost">
              Reset filters
            </Button>
          </motion.div>
        ) : (
          <LayoutGroup>
            <motion.div layout className={cn(view === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-6")}>
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.div
                    layout
                    key={p.id}
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <PropertyCard property={p} variant={view} priority={i < 3} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </div>
    </div>
  );
}

