"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  ArrowUp,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur mt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left column - Brand and description */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">{"> L.vi_"}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full Stack Developer building beautiful web experiences. Sharing
              knowledge and journey through code.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://github.com/LuuVi2911"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://linkedin.com/in/luuvi2911"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="mailto:lhnvi705@gmail.com"
                className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Mail className="w-5 h-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Middle column - Explore */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Explore</h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/projects"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Me
              </Link>
            </nav>
          </div>

          {/* Right column - Connect */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Connect</h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/resume"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Resume
              </Link>
              <Link
                href="mailto:lhnvi705@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Email Me
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Luu Vi. All rights reserved.</p>
          <div className="flex gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-foreground transition-colors"
              render={<Link href="/privacy" />}
              nativeButton={false}
            >
              Privacy Policy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-foreground transition-colors"
              render={<Link href="/terms" />}
              nativeButton={false}
            >
              Terms of Service
            </Button>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        nativeButton={true}
      >
        <ArrowUp className="w-5 h-5" />
        <span className="sr-only">Back to top</span>
      </Button>
    </footer>
  );
}
