// Router principal de la aplicación
// Estructura: Auth → Layout Doctor → Páginas Doctor | Layout Admin → Páginas Admin
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LayoutDoctor } from "@/components/layout/LayoutDoctor";
import { LayoutAdmin } from "@/components/layout/LayoutAdmin";

// Páginas públicas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginDoctor from "./pages/auth/LoginDoctor";
import LoginAdmin from "./pages/auth/LoginAdmin";

// Páginas del doctor (renderizadas por LayoutDoctor como secciones apiladas)

// Páginas del admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMetricas from "./pages/admin/AdminMetricas";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminLandingEditor from "./pages/admin/AdminLandingEditor";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login-doctor" element={<LoginDoctor />} />
            <Route path="/login-admin" element={<LoginAdmin />} />

            {/* Rutas del doctor (públicas) */}
            <Route path="/app/doctor" element={<LayoutDoctor />}>
              <Route path="inicio" element={<></>} />
              <Route path="producto" element={<></>} />
              <Route path="guias" element={<></>} />
              <Route path="faq" element={<></>} />
              <Route path="contacto" element={<></>} />
              <Route path="gracias" element={<></>} />
            </Route>

            {/* Rutas del admin (protegidas) */}
            <Route
              path="/app/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <LayoutAdmin />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="metricas" element={<AdminMetricas />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="landing-editor" element={<AdminLandingEditor />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
