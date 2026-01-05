"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Snowfall from "react-snowfall";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background font-mono flex flex-col relative">
      <Snowfall
        color="#9CC7E8"
        snowflakeCount={110}
        speed={[1.5, 2.5]}
        wind={[-0.5, 2]}
        radius={[1, 3]}
        opacity={[1, 2]}
        style={{
          filter: "blur(1px)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1000,
        }}
      />
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
