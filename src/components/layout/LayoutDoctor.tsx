// Layout principal para vistas del doctor
// Top Nav en desktop + BottomNav en mobile
// Scroll-to-top en cada cambio de ruta
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { TopNavDoctor } from "@/components/nav/TopNavDoctor";
import { BottomNavDoctor } from "@/components/nav/BottomNavDoctor";
import { usePageVisitTracker } from "@/hooks/usePageVisitTracker";

// Páginas del doctor (se renderizan como secciones apiladas)
import DoctorInicio from "@/pages/doctor/DoctorInicio";
import DoctorProducto from "@/pages/doctor/DoctorProducto";
import DoctorGuias from "@/pages/doctor/DoctorGuias";
import DoctorFAQ from "@/pages/doctor/DoctorFAQ";
import DoctorContacto from "@/pages/doctor/DoctorContacto";

const sections = [
  { id: "inicio", Component: DoctorInicio },
  { id: "producto", Component: DoctorProducto },
  { id: "guias", Component: DoctorGuias },
  { id: "faq", Component: DoctorFAQ },
  { id: "contacto", Component: DoctorContacto },
];

export function LayoutDoctor() {
  usePageVisitTracker();
  const { pathname } = useLocation();

  // refs para cada sección
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    // extraer la parte después de /app/doctor/ (p. ej. "producto")
    const parts = pathname.split("/app/doctor/");
    const key = parts[1] || "inicio";

    const target = refs.current[key] || refs.current["inicio"];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // fallback: scroll top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <TopNavDoctor />
      <main className="pb-20 md:pt-24 md:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Secciones apiladas — cada una ocupa al menos la altura de la ventana */}
          <div className="flex flex-col">
            {sections.map(({ id, Component }) => (
              <section
                key={id}
                ref={(el) => (refs.current[id] = el)}
                id={id}
                className="min-h-screen py-8 scroll-mt-20"
              >
                <Component />
              </section>
            ))}
          </div>
        </div>
      </main>

      <BottomNavDoctor />
    </div>
  );
}
