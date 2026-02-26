// Página de guías — instrucciones de uso y pasos
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ultrasoundImage from "@/assets/ultrasound-deep-access.jpg";

const steps = [
  "Seleccione el calibre adecuado según el tipo de terapia y vena.",
  "Aplique torniquete y localice la vena. Para acceso difícil, use guía ecográfica.",
  "Inserte el catéter con un ángulo de 10-30° con el bisel hacia arriba.",
  "Observe el reflujo de sangre en la cámara trasera para confirmar acceso venoso.",
  "Avance el catéter sobre la aguja con un movimiento suave y continuo.",
  "Retire la aguja. El escudo de seguridad se activa automáticamente.",
  "Conecte la línea de infusión y asegure el catéter con un apósito transparente.",
];

export default function DoctorGuias() {
  const [content, setContent] = useState({
    title: "Guías de Uso",
    subtitle: "Instrucciones paso a paso para la correcta inserción del Introcan Safety® 2.",
    hero_image_url: null as string | null,
    steps: [] as string[],
  });

  useEffect(() => {
    supabase
      .from("landing_content")
      .select("*")
      .eq("section_key", "guias")
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          let loadedSteps = [];
          try {
            if (data.cta_text && data.cta_text.startsWith('[')) {
              loadedSteps = JSON.parse(data.cta_text);
            }
          } catch (e) { console.error("Error parsing steps", e); }

          setContent({
            title: data.title || content.title,
            subtitle: data.subtitle || content.subtitle,
            hero_image_url: data.hero_image_url,
            steps: loadedSteps.length > 0 ? loadedSteps : steps,
          });
        } else {
          setContent(prev => ({ ...prev, steps: steps }));
        }
      });
  }, []);

  const displayImage = content.hero_image_url || ultrasoundImage;
  const displaySteps = content.steps.length > 0 ? content.steps : steps;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 text-3xl font-extrabold text-foreground">{content.title}</h1>
        <p className="text-muted-foreground">
          {content.subtitle}
        </p>
      </section>

      {/* Visualización con ultrasonido */}
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="grid md:grid-cols-2">
          <img
            src={displayImage}
            alt={content.title}
            className="h-64 w-full object-cover"
            loading="lazy"
          />
          <CardContent className="flex flex-col justify-center p-6">
            <h2 className="mb-3 text-xl font-bold text-foreground">
              Cateterización guiada por ultrasonido
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              El Introcan Safety® Deep Access permite una visualización clara bajo guía ecográfica,
              ideal para pacientes con acceso venoso periférico difícil.
            </p>
          </CardContent>
        </div>
      </Card>

      {/* Paso a paso */}
      <section>
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <BookOpen className="h-6 w-6 text-primary" />
          Paso a Paso
        </h2>
        <div className="space-y-3">
          {displaySteps.map((step, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
