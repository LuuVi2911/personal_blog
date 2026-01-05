import type React from "react";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { LayoutWrapper } from "@/components/layout-wrapper";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luu Vi - Software Developer",
  description:
    "I'm Luu Vi, student of Software Engineering at Tampere University. My work revolves around Software Development.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${jetbrainsMono.className} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
