import { ButtonLink } from "@/components/ui/button";

/**
 * CSS-only entrance so first paint never depends on Framer hydration.
 * (Framer `initial={{ opacity: 0 }}` + `useReducedMotion()` caused SSR/client
 * mismatches and a blank home until client navigation remounted the tree.)
 */
export function LandingHero() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
      <div className="hero-enter max-w-lg">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
          Portfolio
        </p>
        <h1 className="mt-6 font-logo text-5xl uppercase leading-none tracking-[0.06em] text-fg sm:text-6xl md:text-7xl">
          The Rutwij
        </h1>
        <p className="mx-auto mt-6 text-base leading-relaxed text-muted sm:text-lg">
          Software, philosophy, and side quests—documented in one slow scroll.
        </p>
        <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <ButtonLink href="/about" size="lg" variant="primary">
            About
          </ButtonLink>
          <ButtonLink href="/tracker" size="lg" variant="secondary">
            Tracker
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
