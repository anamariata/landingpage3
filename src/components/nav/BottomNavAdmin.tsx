// Barra de navegación inferior para admin (mobile)
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, PenSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/admin/leads", icon: Users, label: "Leads" },
  { to: "/app/admin/landing-editor", icon: PenSquare, label: "Editor" },
  { to: "/app/admin/usuarios", icon: User, label: "Perfil" },
];

export function BottomNavAdmin() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex h-16 items-center justify-around">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
