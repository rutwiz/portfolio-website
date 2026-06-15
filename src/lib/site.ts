export const site = {
  name: "Rutwij",
  // Short wordmark shown in the nav (monospace).
  wordmark: "rutwij",
  title: "Rutwij — Software, words, frames",
  description:
    "Personal site of Rutwij — software engineer. Blog posts, projects, photography, and video.",
  author: "Rutwij",
  email: "",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/work", label: "Work" },
  { href: "/media", label: "Media" },
  { href: "/about", label: "About" },
] as const;

export const socials = [
  {
    href: "https://github.com/rutwiz",
    label: "GitHub",
    handle: "@rutwiz",
    icon: "github",
  },
  {
    href: "https://www.instagram.com/rutwij.nerkar",
    label: "Instagram",
    handle: "@rutwij.nerkar",
    icon: "instagram",
  },
  {
    href: "https://www.youtube.com/@rutwizz",
    label: "YouTube",
    handle: "@rutwizz",
    icon: "youtube",
  },
] as const;
