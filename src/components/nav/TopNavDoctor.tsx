// Top navigation bar for doctor views (horizontal)
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

export function TopNavDoctor() {
  const { signOut } = useAuth();

  return (
    <header className="hidden md:fixed md:top-0 md:left-0 md:block z-30 w-full border-b border-border bg-white supports-[backdrop-filter]:bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span className="text-lg font-bold text-primary">B. Braun</span>

        <nav className="flex items-center gap-1">
          {items.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  );
}
