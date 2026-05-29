"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-sm font-mono text-primary tracking-widest uppercase">
            Physics · Data Science · Atmospheric Research
          </span>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground">
            Leonard Gu
          </h1>

          <p className="max-w-xl text-muted-foreground text-lg leading-relaxed">
            Senior at NYU studying Physics and Data Science. Researcher at the
            Courant Institute. Building ML pipelines at the intersection of
            the atmosphere and big data.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <Button asChild variant="default" size="lg">
              <Link href="/#projects">View Projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#about">About Me</Link>
            </Button>
          </div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          className="absolute bottom-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <ArrowDown className="text-muted-foreground w-5 h-5 animate-bounce" />
        </motion.div>
      </section>
{/* ── About ───────────────────────────────────────────────── */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">

          {/* left -- bio */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-3xl font-bold tracking-tight">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              I'm a rising senior at NYU studying Physics with minors in Data Science
              and Mathematics. My work sits at the boundary of atmospheric
              science and machine learning from developing climate indices
              at the Courant Institute to building severe weather classifiers
              from 45 years of ERA5 data.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Outside of research I'm a hobbyist planespotter, astrophotographer,
              and pianist. I presented my atmospheric research at the American
              Meteorological Society's 106th Annual Meeting in January 2026.
            </p>
          </motion.div>

          {/* right -- interests + skills */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            {/* interests */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-mono text-primary tracking-widest uppercase">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Atmospheric Science", "Machine Learning", "Catastrophe Risk",
                  "Astrophotography", "Aviation", "Piano & Violin",
                ].map((item) => (
                  <span
                    key={item}
                    className="text-sm px-3 py-1 rounded-sm border border-border text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* skills */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-mono text-primary tracking-widest uppercase">
                Tools & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python", "XGBoost", "scikit-learn", "PyTorch",
                  "ERA5 / MetPy", "HPC / PBS", "Flask", "Next.js",
                  "pandas", "xarray", "LaTeX",
                ].map((item) => (
                  <span
                    key={item}
                    className="text-sm px-3 py-1 rounded-sm border border-border
                               font-mono text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </section>
    </main>
  );
}