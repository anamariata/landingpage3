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

// Páginas del doctor
import DoctorInicio from "./pages/doctor/DoctorInicio";
import DoctorProducto from "./pages/doctor/DoctorProducto";
import DoctorGuias from "./pages/doctor/DoctorGuias";
import DoctorFAQ from "./pages/doctor/DoctorFAQ";
import DoctorContacto from "./pages/doctor/DoctorContacto";
import DoctorGracias from "./pages/doctor/DoctorGracias";

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

            {/* Rutas del doctor (protegidas) */}
            <Route
              path="/app/doctor"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <LayoutDoctor />
                </ProtectedRoute>
              }
            >
              <Route path="inicio" element={<DoctorInicio />} />
              <Route path="producto" element={<DoctorProducto />} />
              <Route path="guias" element={<DoctorGuias />} />
              <Route path="faq" element={<DoctorFAQ />} />
              <Route path="contacto" element={<DoctorContacto />} />
              <Route path="gracias" element={<DoctorGracias />} />
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
