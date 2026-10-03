import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email address"),
  budget: z.string().min(1, "Select a budget"),
  requirement: z.string().trim().min(10, "Tell us a little more (min 10 characters)").max(600),
  property: z.string().optional(),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});
export type NewsletterValues = z.infer<typeof newsletterSchema>;
