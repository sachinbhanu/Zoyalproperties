"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { newsletterSchema, type NewsletterValues } from "@/lib/schemas";

export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (values: NewsletterValues) => {
    await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "newsletter", ...values }),
    }).catch(() => undefined);
    setDone(true);
    reset();
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Newsletter signup" className="w-full max-w-sm">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="glass relative flex items-center rounded-full p-1.5 pl-5 focus-within:border-cyan/60">
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted/70"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Subscribe"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gradient text-[rgb(4_7_18)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={done ? "ok" : "go"} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
              {done ? <Check className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 pl-2 text-xs text-muted">
        {errors.email?.message ?? (done ? "You're in! Watch your inbox for market insights." : "Monthly market insights. No spam.")}
      </p>
    </form>
  );
}
