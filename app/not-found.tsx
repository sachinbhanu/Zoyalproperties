import Link from "next/link";
import { NotFoundScene } from "@/components/three/lazy";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="force-dark relative flex min-h-screen items-center justify-center overflow-hidden bg-[rgb(4_7_18)] px-6 text-center text-fg">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="absolute inset-0" aria-hidden>
        <NotFoundScene />
      </div>
      <div className="relative z-10 max-w-xl">
        <p className="text-gradient font-display text-[9rem] font-bold leading-none sm:text-[13rem]">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">This address doesn&apos;t exist — yet.</h1>
        <p className="mt-4 text-muted">The page you&apos;re looking for has moved, sold out or never got built. Let&apos;s get you back to the skyline.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/" size="lg">
            Back home
          </Button>
          <Button href="/properties" variant="ghost" size="lg">
            Browse properties
          </Button>
        </div>
        <p className="mt-8 text-xs text-muted">
          Or <Link href="/contact" className="underline hover:text-cyan">tell us what you were looking for</Link>.
        </p>
      </div>
    </section>
  );
}
