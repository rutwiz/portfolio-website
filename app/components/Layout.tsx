import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import AnimatedBlobs from "./AnimatedBlobs";

type LayoutProps = {
  children: React.ReactNode;
  /** Landing uses softer ambient motion; inner pages slightly richer. */
  variant?: "default" | "landing";
};

const Layout: React.FC<LayoutProps> = ({
  children,
  variant = "default",
}) => {
  const blobIntensity = variant === "landing" ? "quiet" : "normal";

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <div className="fixed inset-0 z-0 bg-canvas" aria-hidden />
      <div className="fixed inset-0 z-[1]">
        <AnimatedBlobs intensity={blobIntensity} />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[2] grain mix-blend-overlay"
        aria-hidden
      />
      <div className="relative z-20 flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="fixed left-3 top-3 z-[60] -translate-y-20 rounded-lg border border-border bg-elevated px-4 py-2 text-sm text-fg opacity-0 transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-mist focus:ring-offset-2 focus:ring-offset-canvas"
        >
          Skip to content
        </a>
        {variant !== "landing" ? <NavBar /> : null}
        <main
          id="main-content"
          className="flex flex-1 flex-col outline-none"
          tabIndex={-1}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
