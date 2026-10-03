"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { enquirySchema, type EnquiryValues } from "@/lib/schemas";
import { BUDGETS } from "@/data/properties";
import { buildEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { cn } from "@/lib/utils";

function Field({ label, error, children, htmlFor }: { label: string; error?: string; children: React.ReactNode; htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block pl-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${htmlFor}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pl-1 pt-1.5 text-xs text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EnquiryForm({ propertyTitle, className }: { propertyTitle?: string; className?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      budget: "",
      requirement: propertyTitle ? `I'd like more details about ${propertyTitle}.` : "",
      property: propertyTitle,
    },
  });

  const onSubmit = async (values: EnquiryValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setServerError("Something went wrong. Please try again or use WhatsApp.");
    }
  };

  const sendViaWhatsApp = async () => {
    const ok = await trigger();
    if (!ok) return;
    const v = getValues();
    const msg = buildEnquiryMessage({ name: v.name, budget: v.budget, requirement: v.requirement, property: v.property });
    window.open(buildWhatsAppLink({ message: msg }), "_blank", "noopener,noreferrer");
  };

  const ariaFor = (name: keyof EnquiryValues) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `enq-${name}-error` : undefined,
  });

  return (
    <div className={cn("glass glow-border relative overflow-hidden rounded-3xl p-6 sm:p-8", className)}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
            role="status"
          >
            <div className="relative flex h-24 w-24 items-center justify-center">
              <motion.span className="absolute inset-0 rounded-full bg-cyan/20" initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ duration: 0.8 }} />
              <motion.span className="absolute inset-0 rounded-full border border-cyan/60" initial={{ scale: 0.6, opacity: 1 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 1.4, repeat: 2 }} />
              <svg viewBox="0 0 52 52" className="relative h-14 w-14" fill="none" stroke="rgb(var(--cyan))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <motion.path d="M12 27l9 9 19-20" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }} />
              </svg>
            </div>
            <h3 className="mt-6 font-display text-3xl font-semibold">Thank you — we&apos;re on it!</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">Your enquiry has been received. A property advisor will call you within 2 working hours.</p>
            <Button
              variant="ghost"
              className="mt-6"
              onClick={() => {
                reset();
                setSubmitted(false);
              }}
            >
              Send another enquiry
            </Button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} className="space-y-5" aria-label="Enquiry form">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="enq-name" error={errors.name?.message}>
                <input id="enq-name" autoComplete="name" placeholder="Aarav Sharma" className="input-base" {...ariaFor("name")} {...register("name")} />
              </Field>
              <Field label="Mobile number" htmlFor="enq-phone" error={errors.phone?.message}>
                <input id="enq-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="98765 43210" className="input-base" {...ariaFor("phone")} {...register("phone")} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" htmlFor="enq-email" error={errors.email?.message}>
                <input id="enq-email" type="email" autoComplete="email" placeholder="you@example.com" className="input-base" {...ariaFor("email")} {...register("email")} />
              </Field>
              <Field label="Budget" htmlFor="enq-budget" error={errors.budget?.message}>
                <select id="enq-budget" className="input-base" {...ariaFor("budget")} {...register("budget")}>
                  <option value="">Select budget</option>
                  {BUDGETS.filter((b) => b.id !== "any").map((b) => (
                    <option key={b.id} value={b.label}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Your requirement" htmlFor="enq-requirement" error={errors.requirement?.message}>
              <textarea id="enq-requirement" rows={4} placeholder="e.g. 3 BHK near Golf Course Road, possession within 12 months" className="input-base resize-none" {...ariaFor("requirement")} {...register("requirement")} />
            </Field>
            <input type="hidden" {...register("property")} />

            {serverError && (
              <p role="alert" className="text-sm text-rose-400">
                {serverError}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1" magnetic={false}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isSubmitting ? "Sending…" : "Send enquiry"}
              </Button>
              <Button type="button" variant="whatsapp" size="lg" onClick={sendViaWhatsApp} className="flex-1" magnetic={false}>
                <WhatsAppIcon className="h-5 w-5" /> Send via WhatsApp
              </Button>
            </div>
            <p className="text-[11px] text-muted">By submitting you agree to be contacted about this enquiry. Demo form — nothing is stored.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
