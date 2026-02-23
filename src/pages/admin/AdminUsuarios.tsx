// Gestión de usuarios admin (básico)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export default function AdminUsuarios() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">Perfil</h1>
        <p className="text-muted-foreground">Información de tu cuenta de administrador.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            Datos del Administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Correo electrónico</p>
            <p className="font-medium text-foreground">{user?.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ID de usuario</p>
            <p className="font-mono text-xs text-muted-foreground">{user?.id ?? "—"}</p>
          </div>
          <Button variant="outline" className="gap-2 rounded-full" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
