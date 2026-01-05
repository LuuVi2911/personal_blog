"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <h3 className="text-2xl font-bold">{"> L.vi_"}</h3>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link
              href="/projects"
              className={
                isActive("/projects")
                  ? "text-primary transition-colors"
                  : "hover:text-primary transition-colors"
              }
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className={
                isActive("/blog")
                  ? "text-primary transition-colors"
                  : "hover:text-primary transition-colors"
              }
            >
              Blog
            </Link>
            <Link
              href="/about"
              className={
                isActive("/about")
                  ? "text-primary transition-colors"
                  : "hover:text-primary transition-colors"
              }
            >
              About Me
            </Link>
            <Link
              href="/contact"
              className={
                isActive("/contact")
                  ? "text-primary transition-colors"
                  : "hover:text-primary transition-colors"
              }
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
