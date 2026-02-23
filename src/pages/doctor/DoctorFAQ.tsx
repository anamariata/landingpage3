// Página de preguntas frecuentes
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Qué hace diferente al Introcan Safety® 2 de otros catéteres IV?",
    a: "Integra un escudo de seguridad pasiva que se activa automáticamente al retirar la aguja, un septo multi-acceso que reduce la exposición a sangre, y un bisel de corte universal para inserción suave.",
  },
  {
    q: "¿Es compatible con equipos de ultrasonido?",
    a: "Sí. La versión Deep Access está diseñada para ser visible bajo guía ecográfica, facilitando la cateterización en venas profundas.",
  },
  {
    q: "¿En qué calibres está disponible?",
    a: "Está disponible en 18G, 20G y 22G, todos con longitud de 64mm y material PUR (poliuretano).",
  },
  {
    q: "¿Se requiere entrenamiento especial?",
    a: "No. Su diseño intuitivo permite la transición desde cualquier catéter convencional. La sección de Guías ofrece instrucciones detalladas.",
  },
  {
    q: "¿Cómo solicito muestras o más información?",
    a: "Completa el formulario en la sección Contacto con tus datos y un representante se comunicará contigo.",
  },
  {
    q: "¿El escudo de seguridad interfiere con el procedimiento?",
    a: "No. El mecanismo es completamente pasivo y se activa solo al finalizar la inserción, sin requerir pasos adicionales.",
  },
];

export default function DoctorFAQ() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="mb-2 text-3xl font-extrabold text-foreground">Preguntas Frecuentes</h1>
        <p className="text-muted-foreground">
          Respuestas a las dudas más comunes sobre el Introcan Safety® 2.
        </p>
      </section>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="rounded-lg border-0 bg-card px-4 shadow-sm"
          >
            <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
