import { NextResponse } from "next/server";
import { enquirySchema, newsletterSchema } from "@/lib/schemas";

/**
 * Stub endpoint — logs the submission. Replace the console.log with your CRM,
 * email provider (Resend, SendGrid…) or a database insert.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const kind = (payload as { kind?: string })?.kind;

  if (kind === "newsletter") {
    const parsed = newsletterSchema.safeParse(payload);
    if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 422 });
    console.log("[newsletter]", parsed.data);
    return NextResponse.json({ ok: true });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 422 });
  }

  console.log("[enquiry]", { receivedAt: new Date().toISOString(), ...parsed.data });
  return NextResponse.json({ ok: true });
}
