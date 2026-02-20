import { Shield, Droplets, Crosshair, Eye, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import heroImage from "@/assets/introcan-hero.jpg";
import ultrasoundImage from "@/assets/ultrasound-deep-access.jpg";

const safetyFeatures = [
  {
    icon: Shield,
    title: "Escudo de Seguridad Pasiva",
    description:
      "Se activa automáticamente al retirar la aguja, eliminando el riesgo de pinchazos accidentales sin depender de la acción del usuario.",
  },
  {
    icon: Droplets,
    title: "Septo Multi-Acceso",
    description:
      "Minimiza la necesidad de compresión venosa, reduciendo la exposición a sangre y el tiempo de limpieza posterior al procedimiento.",
  },
  {
    icon: Crosshair,
    title: "Bisel de Corte Universal",
    description:
      "Geometría optimizada que permite una inserción suave con menos trauma tisular, facilitando el acceso en un amplio rango de ángulos.",
  },
];

const technicalData = [
  { gauge: "18G", length: "64 mm", flow: "85 ml/min", material: "PUR", diameter: "1.3 mm" },
  { gauge: "20G", length: "64 mm", flow: "51 ml/min", material: "PUR", diameter: "1.1 mm" },
  { gauge: "22G", length: "64 mm", flow: "24 ml/min", material: "PUR", diameter: "0.9 mm" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight text-foreground">
            B. Braun
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            Introcan Safety® 2
          </span>
        </div>
      </nav>

      {/* ─── A. HERO SECTION ─── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-background pt-16">
        <div className="container mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-block w-fit rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              Nuevo Estándar en Acceso Vascular
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Protección Pasiva,{" "}
              <span className="text-primary-bright">Precisión Activa.</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
              El nuevo estándar en acceso vascular con tecnología de control de
              sangre multi-acceso. Diseñado para proteger al clínico y al
              paciente sin comprometer la flexibilidad clínica.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full bg-primary px-8 text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-bright hover:shadow-xl"
              >
                Solicitar Demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-primary/30 px-8 text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/5"
              >
                Ver Especificaciones
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={heroImage}
              alt="Introcan Safety 2 - Catéter IV cerrado con escudo de seguridad pasiva"
              className="w-full max-w-lg rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </div>
        <a
          href="#safety-shield"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground transition-colors hover:text-primary"
          aria-label="Scroll down"
        >
          <ArrowDown className="h-6 w-6" />
        </a>
      </section>

      {/* ─── B. THE SAFETY SHIELD ─── */}
      <section
        id="safety-shield"
        className="bg-secondary py-20 md:py-28"
      >
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              Diferenciador Técnico
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              The Safety Shield
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Tres innovaciones integradas que redefinen la seguridad en el
              acceso vascular periférico.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {safetyFeatures.map((feature) => (
              <Card
                key={feature.title}
                className="group border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <CardContent className="p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── C. DEEP ACCESS (Ultrasonido) ─── */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img
              src={ultrasoundImage}
              alt="Visualización del catéter Introcan Safety bajo ultrasonido"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              Deep Access
            </span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Visualización clara bajo ultrasonido
            </h2>
            <p className="mb-6 text-muted-foreground leading-relaxed">
              El catéter Introcan Safety® Deep Access está diseñado con un
              tubo capilar extendido que garantiza una proporción adecuada de
              catéter dentro de la vena, previniendo el desplazamiento en
              accesos venosos profundos.
            </p>
            <ul className="space-y-4">
              {[
                {
                  icon: Eye,
                  text: "Visible bajo guía ecográfica para una colocación precisa",
                },
                {
                  icon: Shield,
                  text: "Longitud extendida que previene el desplazamiento del catéter",
                },
                {
                  icon: Crosshair,
                  text: "Ideal para pacientes con acceso venoso periférico difícil",
                },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── D. TABLA TÉCNICA ─── */}
      <section className="bg-secondary py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-primary">
              Especificaciones
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Datos Técnicos
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Introcan Safety® Deep Access — Catéteres de longitud extendida en
              poliuretano (PUR) para acceso vascular difícil.
            </p>
          </div>

          <Card className="overflow-hidden border-0 shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">
                    Calibre (G)
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Longitud (mm)
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Diámetro (mm)
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Flujo (ml/min)
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Material
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technicalData.map((row) => (
                  <TableRow
                    key={row.gauge}
                    className="transition-colors hover:bg-primary/5"
                  >
                    <TableCell className="font-semibold text-foreground">
                      {row.gauge}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.length}</TableCell>
                    <TableCell className="text-muted-foreground">{row.diameter}</TableCell>
                    <TableCell className="text-muted-foreground">{row.flow}</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {row.material}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border bg-background py-10">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} B. Braun Melsungen AG · Hospital Care ·{" "}
            <a
              href="https://www.bbraun.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              www.bbraun.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
