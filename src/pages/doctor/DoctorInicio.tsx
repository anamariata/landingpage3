// Página de inicio del doctor — resumen del producto + accesos rápidos
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Package, BookOpen, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import heroImage from "@/assets/introcan-hero.jpg";

const quickLinks = [
  { to: "/app/doctor/producto", icon: Package, label: "Ver Producto", desc: "Información técnica completa" },
  { to: "/app/doctor/guias", icon: BookOpen, label: "Guías de Uso", desc: "Instrucciones paso a paso" },
  { to: "/app/doctor/faq", icon: HelpCircle, label: "Preguntas Frecuentes", desc: "Resuelve tus dudas" },
  { to: "/app/doctor/contacto", icon: MessageSquare, label: "Solicitar Info", desc: "Déjanos tus datos" },
];

export default function DoctorInicio() {
  const [heroContent, setHeroContent] = useState({
    title: "Protección Pasiva, Precisión Activa.",
    subtitle: "El nuevo estándar en acceso vascular con tecnología de control de sangre multi-acceso.",
    cta_text: "Solicitar Información",
    hero_image_url: null as string | null,
  });

  useEffect(() => {
    supabase
      .from("landing_content")
      .select("*")
      .eq("section_key", "hero")
      .maybeSingle()
      .then(({ data }) => {
        if (data) setHeroContent(data);
      });
  }, []);

  const backgroundImage = heroContent.hero_image_url || heroImage;

  return (
    <div className="space-y-8">
      {/* Hero dinámico (editable por admin) */}
      <section className="relative overflow-hidden rounded-2xl bg-primary/5">
        <div className="grid gap-6 p-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl">
              {heroContent.title}
            </h1>
            <p className="mb-6 text-muted-foreground leading-relaxed">
              {heroContent.subtitle}
            </p>
            <div>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/app/doctor/contacto">
                  {heroContent.cta_text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={backgroundImage}
              alt="Introcan Safety 2"
              className="max-h-64 rounded-xl object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Accesos rápidos */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Accesos Rápidos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map(({ to, icon: Icon, label, desc }) => (
            <Link key={to} to={to}>
              <Card className="group cursor-pointer border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{label}</h3>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
