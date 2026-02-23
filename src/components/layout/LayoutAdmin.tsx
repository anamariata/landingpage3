// Layout principal para vistas del admin
// Sidebar en desktop + BottomNav en mobile
import { Outlet } from "react-router-dom";
import { SidebarAdmin } from "@/components/nav/SidebarAdmin";
import { BottomNavAdmin } from "@/components/nav/BottomNavAdmin";
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";

export function LayoutAdmin() {
  usePageVisitTracker();

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarAdmin />
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <BottomNavAdmin />
    </div>
  );
}
