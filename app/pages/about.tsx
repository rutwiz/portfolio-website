"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Section } from "../components/about-scroll/Section";
import aboutData from "../content/about.json";
import careerData from "../content/career.json";
import projectsData from "../content/projects.json";
import hobbiesData from "../content/hobbies.json";

const sectionTitle =
  "font-heading text-3xl tracking-tight text-fg sm:text-4xl";

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const raw = router.query.section;
    const section = typeof raw === "string" ? raw : undefined;
    if (!section) return;

    const el = document.getElementById(section);
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  }, [router.isReady, router.query.section]);

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl px-4 py-14 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
          About
        </p>
        <h1 className="mt-3 font-heading text-4xl tracking-tight text-fg sm:text-5xl">
          Hi, I&apos;m Rutwij
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          This page is a work in progress.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link
            href="#intro"
            className="rounded-full border border-border bg-surface/60 px-4 py-1.5 text-muted transition-colors hover:border-accent-mist/50 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Intro
          </Link>
          <Link
            href="#career"
            className="rounded-full border border-border bg-surface/60 px-4 py-1.5 text-muted transition-colors hover:border-accent-mist/50 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Career
          </Link>
          <Link
            href="#projects"
            className="rounded-full border border-border bg-surface/60 px-4 py-1.5 text-muted transition-colors hover:border-accent-mist/50 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Projects
          </Link>
          <Link
            href="#hobbies"
            className="rounded-full border border-border bg-surface/60 px-4 py-1.5 text-muted transition-colors hover:border-accent-mist/50 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Hobbies
          </Link>
        </div>

        <div className="mt-20 space-y-28 sm:space-y-32">
          <Section id="intro">
            <div className="flex flex-col gap-10 sm:flex-row sm:items-start">
              <div className="relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-full border border-border sm:mx-0">
                <Image
                  src={aboutData.avatar}
                  alt="Rutwij"
                  fill
                  className="object-cover"
                  sizes="144px"
                  priority
                />
              </div>
              <div>
                <h2 className={sectionTitle}>{aboutData.title}</h2>
                <p className="mt-5 font-body leading-relaxed text-muted">
                  {aboutData.biography}
                </p>
              </div>
            </div>
          </Section>

          <Section id="career">
            <h2 className={sectionTitle}>{careerData.title}</h2>
            <div className="mt-10 space-y-12">
              {careerData.timeline.map((item, index) => (
                <div
                  key={index}
                  className="border-t border-border pt-10 first:border-t-0 first:pt-0"
                >
                  <h3 className="font-heading text-xl text-fg">{item.role}</h3>
                  <p className="mt-1 text-lg text-accent-mist">{item.company}</p>
                  <p className="mt-1 text-sm text-muted">{item.period}</p>
                  <p className="mt-3 font-body leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="projects">
            <h2 className={sectionTitle}>{projectsData.title}</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {projectsData.projects.map((project, index) => (
                <article
                  key={index}
                  className="overflow-hidden rounded-xl border border-border bg-surface/40"
                >
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-xl text-fg">{project.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>
                    <Link
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-sm text-accent-gold underline-offset-4 transition-colors hover:text-accent-mist focus-visible:rounded focus-visible:ring-2 focus-visible:ring-accent-mist focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                    >
                      View on GitHub
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </Section>

          <Section id="hobbies">
            <h2 className={sectionTitle}>{hobbiesData.title}</h2>
            <ul className="mt-10 space-y-10">
              {hobbiesData.hobbies.map((hobby, index) => (
                <li
                  key={index}
                  className="rounded-xl border border-border/80 bg-elevated/30 px-5 py-6 sm:px-7"
                >
                  <h3 className="font-heading text-xl text-accent-sage">
                    {hobby.name}
                  </h3>
                  <p className="mt-3 font-body leading-relaxed text-muted">
                    {hobby.description}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </Layout>
  );
}
