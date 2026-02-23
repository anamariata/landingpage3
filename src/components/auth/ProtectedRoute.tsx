// Componente para proteger rutas según rol
// Redirige a login si no está autenticado o no tiene el rol correcto
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { LoadingScreen } from "@/components/system/LoadingScreen";
import type { AppRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: AppRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    const loginPath = requiredRole === "admin" ? "/login-admin" : "/login-doctor";
    return <Navigate to={loginPath} replace />;
  }

  if (role !== requiredRole) {
    const loginPath = requiredRole === "admin" ? "/login-admin" : "/login-doctor";
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
}
