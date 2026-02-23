// Layout principal para vistas del doctor
// Top Nav en desktop + BottomNav en mobile
import { Outlet } from "react-router-dom";
import { TopNavDoctor } from "@/components/nav/TopNavDoctor";
import { BottomNavDoctor } from "@/components/nav/BottomNavDoctor";
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";

export function LayoutDoctor() {
  usePageVisitTracker();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNavDoctor />
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <BottomNavDoctor />
    </div>
  );
}
