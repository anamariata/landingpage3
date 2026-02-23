// Pantalla de confirmación tras enviar formulario de contacto
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function DoctorGracias() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mb-3 text-3xl font-extrabold text-foreground">¡Solicitud Enviada!</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Hemos recibido tu información. Un representante de B. Braun se pondrá en contacto contigo
        en las próximas 24-48 horas hábiles.
      </p>
      <Button asChild variant="outline" className="rounded-full gap-2">
        <Link to="/app/doctor/inicio">
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
      </Button>
    </div>
  );
}
