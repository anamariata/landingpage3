// Hook para rastrear visitas de página
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export function usePageVisitTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    supabase
      .from("page_visits")
      .insert({ path: location.pathname, user_id: user.id })
      .then(); // Dispara y olvida, no bloquea la UI
  }, [location.pathname, user]);
}
