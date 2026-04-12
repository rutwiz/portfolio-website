import Link from "next/link";

const NavBar = () => {
  const linkClass =
    "rounded-md px-2 py-1 text-sm text-muted transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

  return (
    <header className="border-b border-border/60 bg-canvas/40 backdrop-blur-md">
      <nav className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link
          href="/"
          className="font-logo text-lg uppercase leading-none tracking-[0.06em] text-fg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:text-xl"
        >
          The Rutwij
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-3">
          <Link href="/" className={linkClass}>
            Home
          </Link>
          <Link href="/about" className={linkClass}>
            About
          </Link>
          <Link href="/tracker" className={linkClass}>
            Tracker
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
