// Layout principal para vistas del doctor
// Top Nav en desktop + BottomNav en mobile
// Scroll-to-top en cada cambio de ruta
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TopNavDoctor } from "@/components/nav/TopNavDoctor";
import { BottomNavDoctor } from "@/components/nav/BottomNavDoctor";
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";

export function LayoutDoctor() {
  usePageVisitTracker();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <TopNavDoctor />
      <main className="pb-20 md:pt-16 md:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <BottomNavDoctor />
    </div>
  );
}
