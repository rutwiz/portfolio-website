import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      heroImage: image().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["active", "archived"]).default("active"),
    tech: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    link: z.string().optional(),
    year: z.string().optional(),
    order: z.number().default(0),
  }),
});

const photos = defineCollection({
  loader: file("src/data/photos.json"),
  schema: z.object({
    id: z.string(),
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
    location: z.string().optional(),
    date: z.string().optional(),
  }),
});

const videos = defineCollection({
  loader: file("src/data/videos.json"),
  schema: z.object({
    id: z.string(),
    youtubeId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
  }),
});

export const collections = { blog, projects, photos, videos };
