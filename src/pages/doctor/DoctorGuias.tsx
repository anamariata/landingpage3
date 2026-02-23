// Página de guías — instrucciones de uso y pasos
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle } from "lucide-react";
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
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 text-3xl font-extrabold text-foreground">Guías de Uso</h1>
        <p className="text-muted-foreground">
          Instrucciones paso a paso para la correcta inserción del Introcan Safety® 2.
        </p>
      </section>

      {/* Visualización con ultrasonido */}
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="grid md:grid-cols-2">
          <img
            src={ultrasoundImage}
            alt="Catéter bajo guía ecográfica"
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
          {steps.map((step, i) => (
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
