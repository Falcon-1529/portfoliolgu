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
            Junior at NYU studying Physics and Data Science. Researcher at the
            Courant Institute. Building ML pipelines at the intersection of
            atmosphere and data.
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

    </main>
  );
}