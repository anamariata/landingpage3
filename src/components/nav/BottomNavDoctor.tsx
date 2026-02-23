// Barra de navegación inferior para doctores (mobile)
import { NavLink } from "react-router-dom";
import { Home, Package, BookOpen, HelpCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app/doctor/inicio", icon: Home, label: "Inicio" },
  { to: "/app/doctor/producto", icon: Package, label: "Producto" },
  { to: "/app/doctor/guias", icon: BookOpen, label: "Guías" },
  { to: "/app/doctor/faq", icon: HelpCircle, label: "FAQ" },
  { to: "/app/doctor/contacto", icon: MessageSquare, label: "Contacto" },
];

export function BottomNavDoctor() {
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
