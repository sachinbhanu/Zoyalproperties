/** Formats an INR amount as Lakh / Crore, e.g. 12500000 -> "₹1.25 Cr" */
export function formatPrice(value: number): string {
  if (value >= 1e7) {
    const cr = value / 1e7;
    return `₹${trim(cr)} Cr`;
  }
  if (value >= 1e5) {
    const l = value / 1e5;
    return `₹${trim(l)} Lakh`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

function trim(n: number) {
  return Number(n.toFixed(2)).toString();
}

/** Full INR with Indian digit grouping: 12,50,000 */
export function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function formatArea(sqft: number) {
  return `${sqft.toLocaleString("en-IN")} sq ft`;
}

export function formatPossession(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}
