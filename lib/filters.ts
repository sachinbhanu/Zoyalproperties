import { BUDGETS, type Property } from "@/data/properties";

export interface Filters {
  city: string;
  type: string;
  bhk: string;
  status: string;
  budget: string;
  sort: string;
}

export const EMPTY_FILTERS: Filters = { city: "", type: "", bhk: "", status: "", budget: "any", sort: "featured" };

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured first" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "area-desc", label: "Area: largest first" },
  { id: "possession", label: "Possession: earliest" },
] as const;

export function filterProperties(list: Property[], f: Filters): Property[] {
  const budget = BUDGETS.find((b) => b.id === f.budget) ?? BUDGETS[0];
  const out = list.filter((p) => {
    if (f.city && p.city !== f.city) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.status && p.status !== f.status) return false;
    if (f.bhk) {
      const n = Number(f.bhk);
      // "5" means 5+
      if (n >= 5 ? p.bhk < 5 : p.bhk !== n) return false;
    }
    if (p.price < budget.min || p.price >= budget.max) return false;
    return true;
  });

  const sorted = [...out];
  switch (f.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "area-desc":
      sorted.sort((a, b) => b.area - a.area);
      break;
    case "possession":
      sorted.sort((a, b) => a.possession.localeCompare(b.possession));
      break;
    default:
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return sorted;
}

export function filtersFromParams(get: (key: string) => string | null): Filters {
  return {
    city: get("city") ?? "",
    type: get("type") ?? "",
    bhk: get("bhk") ?? "",
    status: get("status") ?? "",
    budget: get("budget") ?? "any",
    sort: get("sort") ?? "featured",
  };
}

export function filtersToQuery(f: Partial<Filters>): string {
  const params = new URLSearchParams();
  (Object.keys(f) as (keyof Filters)[]).forEach((k) => {
    const v = f[k];
    if (v && v !== "any" && !(k === "sort" && v === "featured")) params.set(k, v);
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}
