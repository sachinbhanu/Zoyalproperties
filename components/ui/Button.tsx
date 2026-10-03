"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";

type Variant = "primary" | "ghost" | "whatsapp" | "dark";
type Size = "md" | "lg" | "sm";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-wide transition-[transform,box-shadow,background-color,border-color] duration-300 will-change-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-gradient text-[rgb(4_7_18)] shadow-[0_0_30px_-6px_rgb(var(--cyan)/0.7)] hover:shadow-[0_0_46px_-4px_rgb(var(--violet)/0.8)]",
  ghost: "glass text-fg hover:border-cyan/60 hover:bg-cyan/10",
  dark: "bg-fg text-bg hover:bg-fg/90",
  whatsapp:
    "bg-[#25D366] text-[#04230f] shadow-[0_0_30px_-6px_rgba(37,211,102,0.8)] hover:shadow-[0_0_46px_-4px_rgba(37,211,102,0.9)]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type LinkButtonProps = CommonProps & { href: string; external?: boolean; target?: string; rel?: string; onClick?: () => void; "aria-label"?: string };
type NativeButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = "primary", size = "md", arrow, magnetic = true, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {arrow && <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
    </>
  );

  let node: ReactNode;
  if ("href" in props && props.href !== undefined) {
    const { href, external, target, rel, onClick } = props as LinkButtonProps;
    const isExternal = external || /^https?:\/\//.test(href);
    node = isExternal ? (
      <a
        href={href}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
        className={classes}
        onClick={onClick}
        aria-label={(props as LinkButtonProps)["aria-label"]}
      >
        {inner}
      </a>
    ) : (
      <Link href={href} className={classes} onClick={onClick} aria-label={(props as LinkButtonProps)["aria-label"]}>
        {inner}
      </Link>
    );
  } else {
    const rest = { ...(props as NativeButtonProps) } as Record<string, unknown>;
    delete rest.variant;
    delete rest.size;
    delete rest.arrow;
    delete rest.magnetic;
    delete rest.className;
    delete rest.children;
    node = (
      <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
        {inner}
      </button>
    );
  }

  return magnetic ? <Magnetic>{node}</Magnetic> : node;
}
