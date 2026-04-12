import Link from "next/link";
import { SiGithub, SiInstagram, SiYoutube } from "react-icons/si";
import { cn } from "@/lib/utils";

const SOCIALS = [
  {
    href: "https://www.instagram.com/rutwij.nerkar",
    label: "Instagram",
    Icon: SiInstagram,
  },
  {
    href: "https://github.com/rutwiz",
    label: "GitHub",
    Icon: SiGithub,
  },
  {
    href: "https://www.youtube.com/@rutwizz",
    label: "YouTube",
    Icon: SiYoutube,
  },
] as const;

const SocialIcons = () => {
  const linkClass = cn(
    "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 text-muted transition-colors",
    "hover:border-accent-mist/50 hover:text-fg",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {SOCIALS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label={label}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </Link>
      ))}
    </div>
  );
};

export default SocialIcons;
