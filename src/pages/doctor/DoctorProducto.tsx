// Página de producto — información técnica del Introcan Safety
import { Shield, Droplets, Crosshair, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import heroImage from "@/assets/introcan-hero.jpg";

const benefits = [
  {
    icon: Shield,
    title: "Escudo de Seguridad Pasiva",
    description: "Se activa automáticamente al retirar la aguja, eliminando el riesgo de pinchazos accidentales.",
  },
  {
    icon: Droplets,
    title: "Septo Multi-Acceso",
    description: "Minimiza la necesidad de compresión venosa, reduciendo la exposición a sangre.",
  },
  {
    icon: Crosshair,
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
  return (
    <div className="space-y-10">
      {/* Encabezado del producto */}
      <section className="flex flex-col gap-6 md:flex-row md:items-center">
        <img
          src={heroImage}
          alt="Introcan Safety 2"
          className="h-48 w-full rounded-xl object-contain md:w-48"
          loading="lazy"
        />
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Introcan Safety® 2</h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            El catéter IV cerrado con protección automática contra pinchazos. Diseñado para proteger
            al clínico y al paciente sin comprometer la flexibilidad clínica.
          </p>
          <Button variant="outline" className="mt-4 rounded-full gap-2">
            <Download className="h-4 w-4" />
            Descargar Ficha Técnica
          </Button>
        </div>
      </section>

      {/* Beneficios */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground">Beneficios Clave</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tabla técnica */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground">Especificaciones Técnicas</h2>
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
              {specs.map((s) => (
                <TableRow key={s.gauge}>
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
