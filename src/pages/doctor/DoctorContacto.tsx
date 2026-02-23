// Página de contacto — formulario de lead
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send } from "lucide-react";

const specialties = [
  "Anestesiología",
  "Cirugía General",
  "Cuidados Intensivos",
  "Emergencias",
  "Enfermería",
  "Medicina Interna",
  "Oncología",
  "Pediatría",
  "Otra",
];

const products = [
  "Introcan Safety® 2",
  "Introcan Safety® Deep Access",
  "Ambos productos",
];

export default function DoctorContacto() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    product_of_interest: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!form.name.trim() || !form.specialty || !form.email.trim() || !form.phone.trim() || !form.product_of_interest) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    const { error: dbError } = await supabase.from("leads").insert({
      name: form.name.trim(),
      specialty: form.specialty,
      email: form.email.trim(),
      phone: form.phone.trim(),
      product_of_interest: form.product_of_interest,
      submitted_by_user_id: user?.id ?? null,
    });

    setLoading(false);

    if (dbError) {
      setError("Algo salió mal. Inténtalo de nuevo.");
      return;
    }

    navigate("/app/doctor/gracias", { replace: true });
  };

  return (
    <div className="mx-auto max-w-lg">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Solicitar Información</CardTitle>
          <CardDescription>
            Completa tus datos y un representante de B. Braun se comunicará contigo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Dr. Juan Pérez"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidad</Label>
              <Select value={form.specialty} onValueChange={(v) => update("specialty", v)}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Selecciona tu especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan.perez@hospital.pe"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                maxLength={255}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Número de teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+51 999 999 999"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                maxLength={20}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Producto de interés</Label>
              <Select value={form.product_of_interest} onValueChange={(v) => update("product_of_interest", v)}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full rounded-full"
              size="lg"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Enviar Solicitud
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
