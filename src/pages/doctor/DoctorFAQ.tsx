// Página de preguntas frecuentes
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [content, setContent] = useState({
    title: "Preguntas Frecuentes",
    subtitle: "Respuestas a las dudas más comunes sobre el Introcan Safety® 2.",
    faqs: [] as { q: string, a: string }[],
  });

  useEffect(() => {
    supabase
      .from("landing_content")
      .select("*")
      .eq("section_key", "faq")
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          let loadedFaqs = [];
          try {
            if (data.cta_text && data.cta_text.startsWith('[')) {
              loadedFaqs = JSON.parse(data.cta_text);
            }
          } catch (e) { console.error("Error parsing FAQs", e); }

          setContent({
            title: data.title || content.title,
            subtitle: data.subtitle || content.subtitle,
            faqs: loadedFaqs.length > 0 ? loadedFaqs : faqs,
          });
        } else {
          setContent(prev => ({ ...prev, faqs: faqs }));
        }
      });
  }, []);

  const displayFaqs = content.faqs.length > 0 ? content.faqs : faqs;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="mb-2 text-3xl font-extrabold text-foreground">{content.title}</h1>
        <p className="text-muted-foreground">
          {content.subtitle}
        </p>
      </section>

      <Accordion type="single" collapsible className="space-y-2">
        {displayFaqs.map((faq, i) => (
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
