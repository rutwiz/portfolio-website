import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-body text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-mist text-canvas hover:bg-accent-mist/90 shadow-[0_0_24px_-4px_rgba(163,184,224,0.45)]",
        secondary:
          "border border-border bg-surface/80 text-fg hover:bg-elevated hover:border-muted",
        ghost: "text-muted hover:text-fg hover:bg-surface/60",
      },
      size: {
        default: "h-11 px-8",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    href?: undefined;
  };

export type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  href: string;
  className?: string;
  children: React.ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

function ButtonLink({ href, className, variant, size, children }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  );
}

export { Button, ButtonLink, buttonVariants };
