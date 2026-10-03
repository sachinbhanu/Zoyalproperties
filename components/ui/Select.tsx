import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  wrapperClassName?: string;
}

export function Select({ label, options, wrapperClassName, className, id, ...props }: Props) {
  const selectId = id ?? `sel-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={cn("relative", wrapperClassName)}>
      <label htmlFor={selectId} className="mb-1.5 block pl-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </label>
      <div className="relative">
        <select id={selectId} className={cn("input-base appearance-none pr-10", className)} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
    </div>
  );
}
