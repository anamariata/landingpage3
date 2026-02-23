// Sidebar de navegación para doctores (desktop)
import { NavLink } from "react-router-dom";
import { Home, Package, BookOpen, HelpCircle, MessageSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/app/doctor/inicio", icon: Home, label: "Inicio" },
  { to: "/app/doctor/producto", icon: Package, label: "Producto" },
  { to: "/app/doctor/guias", icon: BookOpen, label: "Guías" },
  { to: "/app/doctor/faq", icon: HelpCircle, label: "FAQ" },
  { to: "/app/doctor/contacto", icon: MessageSquare, label: "Contacto" },
];

export function SidebarDoctor() {
  const { signOut } = useAuth();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <span className="text-lg font-bold text-foreground">B. Braun</span>
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
