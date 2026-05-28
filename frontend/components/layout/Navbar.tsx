"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "About",    href: "/#about"    },
  { label: "Research", href: "/#research" },
  { label: "Projects", href: "/#projects" },
  { label: "Photos",   href: "/#photos"   },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-background/40 border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        {/* name / logo */}
        <Link
          href="/"
          className="font-heading font-bold text-lg tracking-tight text-foreground hover:text-primary transition-colors"
        >
          LG
        </Link>

        {/* nav links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  );
}