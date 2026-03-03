// Página de bienvenida pública — redirige a login doctor
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <ShieldCheck className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
        Introcan Safety® 2
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        El catéter IV cerrado con protección automática contra pinchazos.
        Acceso exclusivo para profesionales de la salud.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg" className="rounded-full px-8 gap-2">
          <Link to="/app/doctor/inicio">
            Acceso Profesional
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="rounded-full px-8 text-muted-foreground">
          <Link to="/login-admin">Administración</Link>
        </Button>
      </div>
      <p className="mt-12 text-xs text-muted-foreground">
        © {new Date().getFullYear()} B. Braun Melsungen AG · Hospital Care
      </p>
    </div>
  );
}
