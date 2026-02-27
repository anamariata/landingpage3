// Página de producto — información técnica del Introcan Safety
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import heroImage from "@/assets/introcan-hero.jpg";
import beneficio1 from "@/assets/beneficio1.jpg";

const benefits = [
  {
    image: beneficio1,
    title: "Escudo de Seguridad Pasiva",
    description: "Se activa automáticamente al retirar la aguja, eliminando el riesgo de pinchazos accidentales.",
  },
  {
    image: beneficio1,
    title: "Septo Multi-Acceso",
    description: "Minimiza la necesidad de compresión venosa, reduciendo la exposición a sangre.",
  },
  {
    image: beneficio1,
    title: "Bisel de Corte Universal",
    description: "Geometría optimizada para inserción suave con menos trauma tisular.",
  },
];

const specs = [
  { gauge: "18G", length: "64 mm", flow: "85 ml/min", material: "PUR", diameter: "1.3 mm" },
  { gauge: "20G", length: "64 mm", flow: "51 ml/min", material: "PUR", diameter: "1.1 mm" },
  { gauge: "22G", length: "64 mm", flow: "24 ml/min", material: "PUR", diameter: "0.9 mm" },
];

export default function DoctorProducto() {
  const [content, setContent] = useState({
    title: "Introcan Safety® 2",
    subtitle: "El catéter IV cerrado con protección automática contra pinchazos. Diseñado para proteger al clínico y al paciente sin comprometer la flexibilidad clínica.",
    hero_image_url: null as string | null,
    benefits: [] as { title: string, description: string, image?: string }[],
    specs: [] as { gauge: string, length: string, diameter: string, flow: string, material: string }[],
    specsTitle: "Especificaciones Técnicas",
  });

  useEffect(() => {
    // Cargar contenido general e beneficios
    supabase
      .from("landing_content")
      .select("*")
      .eq("section_key", "producto")
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          let loadedBenefits = [];
          try {
            if (data.cta_text && data.cta_text.startsWith('[')) {
              loadedBenefits = JSON.parse(data.cta_text);
            }
          } catch (e) { console.error("Error parsing benefits", e); }

          setContent(prev => ({
            ...prev,
            title: data.title || prev.title,
            subtitle: data.subtitle || prev.subtitle,
            hero_image_url: data.hero_image_url,
            benefits: loadedBenefits,
          }));
        }
      });

    // Cargar especificaciones
    supabase
      .from("landing_content")
      .select("*")
      .eq("section_key", "especificaciones")
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          let loadedSpecs = [];
          try {
            if (data.cta_text && data.cta_text.startsWith('[')) {
              loadedSpecs = JSON.parse(data.cta_text);
            }
          } catch (e) { console.error("Error parsing specs", e); }

          setContent(prev => ({
            ...prev,
            specsTitle: data.title || prev.specsTitle,
            specs: loadedSpecs,
          }));
        }
      });
  }, []);

  const displayImage = content.hero_image_url || heroImage;
  const displayBenefits = content.benefits.length > 0 ? content.benefits : benefits;
  const displaySpecs = content.specs.length > 0 ? content.specs : specs;

  return (
    <div className="space-y-10">
      {/* Encabezado del producto */}
      <section className="flex flex-col gap-6 md:flex-row md:items-center">
        <img
          src={displayImage}
          alt={content.title}
          className="h-48 w-full rounded-xl object-contain md:w-48"
          loading="lazy"
        />
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">{content.title}</h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {content.subtitle}
          </p>
          <Button variant="outline" className="mt-4 rounded-full gap-2">
            <Download className="h-4 w-4" />
            Descargar Ficha Técnica
          </Button>
        </div>
      </section>

      {/* 
        Sección de Beneficios Clave
        Los beneficios se renderizan de forma dinámica desde Supabase.
        Cada beneficio (b) intentará cargar su propia `image`. Si el administrador
        no ha subido ninguna o es un dato antiguo, se usará `beneficio1` por defecto.
      */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground">Beneficios Clave</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {displayBenefits.map((b) => (
            <Card key={b.title} className="border-0 shadow-sm overflow-hidden hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-0 flex flex-col">
                <div className="flex h-40 w-full items-center justify-center bg-primary/10">
                  {/* Aquí se inyecta la imagen dinámica del JSON o el fallback */}
                  <img src={b.image || beneficio1} alt={b.title} className="h-32 w-32 object-contain mix-blend-multiply" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-bold text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tabla técnica */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground">{content.specsTitle}</h2>
        <Card className="overflow-hidden border-0 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                <TableHead className="text-primary-foreground font-semibold">Calibre</TableHead>
                <TableHead className="text-primary-foreground font-semibold">Longitud</TableHead>
                <TableHead className="text-primary-foreground font-semibold">Diámetro</TableHead>
                <TableHead className="text-primary-foreground font-semibold">Flujo</TableHead>
                <TableHead className="text-primary-foreground font-semibold">Material</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displaySpecs.map((s, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold">{s.gauge}</TableCell>
                  <TableCell>{s.length}</TableCell>
                  <TableCell>{s.diameter}</TableCell>
                  <TableCell>{s.flow}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {s.material}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
