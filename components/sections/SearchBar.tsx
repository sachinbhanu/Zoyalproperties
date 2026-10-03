"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { BHK_OPTIONS, BUDGETS, CITIES, PROPERTY_TYPES, properties } from "@/data/properties";
import { filterProperties, filtersToQuery, EMPTY_FILTERS, type Filters } from "@/lib/filters";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function SearchBar() {
  const router = useRouter();
  const [f, setF] = useState<Filters>(EMPTY_FILTERS);
  const count = useMemo(() => filterProperties(properties, f).length, [f]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/properties${filtersToQuery(f)}`);
  };

  return (
    <section aria-label="Property search" className="relative z-20 -mt-16 sm:-mt-20">
      <div className="container-x">
        <Reveal>
          <form onSubmit={submit} className="glass glow-border rounded-[2rem] p-5 shadow-[0_30px_80px_-30px_rgb(var(--violet)/0.55)] sm:p-7">
            <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto]">
              <Select label="City" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} options={[{ value: "", label: "All cities" }, ...CITIES.map((c) => ({ value: c, label: c }))]} />
              <Select label="Property type" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} options={[{ value: "", label: "All types" }, ...PROPERTY_TYPES.map((c) => ({ value: c, label: c }))]} />
              <Select label="Budget" value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })} options={BUDGETS.map((b) => ({ value: b.id, label: b.label }))} />
              <Select label="BHK" value={f.bhk} onChange={(e) => setF({ ...f, bhk: e.target.value })} options={[{ value: "", label: "Any" }, ...BHK_OPTIONS.map((n) => ({ value: String(n), label: n === 5 ? "5+ BHK" : `${n} BHK` }))]} />
              <Button type="submit" size="lg" className="w-full lg:w-auto">
                <Search className="h-4 w-4" /> Search · {count}
              </Button>
            </div>
            <p className="mt-3 pl-1 text-xs text-muted" role="status" aria-live="polite">
              {count === 0 ? "No exact matches — try widening your filters." : `${count} ${count === 1 ? "property matches" : "properties match"} your search right now.`}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
