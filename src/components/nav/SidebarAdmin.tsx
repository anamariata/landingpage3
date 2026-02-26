// Sidebar de navegación para admin (desktop)
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  PenSquare,
  UserCog,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import logoClaim from "@/assets/Logo_Claim_A6_RGB.jpg";

const items = [
  { to: "/app/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/admin/metricas", icon: BarChart3, label: "Métricas" },
  { to: "/app/admin/leads", icon: Users, label: "Leads" },
  { to: "/app/admin/landing-editor", icon: PenSquare, label: "Editor Landing" },
  { to: "/app/admin/usuarios", icon: UserCog, label: "Usuarios" },
];

export function SidebarAdmin() {
  const { signOut } = useAuth();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">

        <img src={logoClaim} alt="B. Braun" className="h-8 w-auto" />

        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Admin
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
