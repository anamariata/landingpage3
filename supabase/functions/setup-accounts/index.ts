// Función para crear las cuentas iniciales del sistema
// POST /setup-accounts — crea doctor genérico + admin con sus roles
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results: string[] = [];

    // Crear cuenta genérica del doctor
    const { data: doctorData, error: doctorErr } = await supabaseAdmin.auth.admin.createUser({
      email: "doctor@bbraun.pe",
      password: "bbraun2024",
      email_confirm: true,
    });

    if (doctorErr && !doctorErr.message.includes("already been registered")) {
      throw doctorErr;
    }

    if (doctorData?.user) {
      await supabaseAdmin.from("user_roles").upsert({
        user_id: doctorData.user.id,
        role: "doctor" as const,
      }, { onConflict: "user_id,role" });
      results.push(`Doctor creado: ${doctorData.user.id}`);
    } else {
      // Si ya existe, buscar el user y asegurar el rol
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const doc = users?.users?.find((u) => u.email === "doctor@bbraun.pe");
      if (doc) {
        await supabaseAdmin.from("user_roles").upsert({
          user_id: doc.id,
          role: "doctor" as const,
        }, { onConflict: "user_id,role" });
        results.push(`Doctor ya existía, rol asegurado: ${doc.id}`);
      }
    }

    // Crear cuenta admin
    const { data: adminData, error: adminErr } = await supabaseAdmin.auth.admin.createUser({
      email: "admin@bbraun.pe",
      password: "admin2024",
      email_confirm: true,
    });

    if (adminErr && !adminErr.message.includes("already been registered")) {
      throw adminErr;
    }

    if (adminData?.user) {
      await supabaseAdmin.from("user_roles").upsert({
        user_id: adminData.user.id,
        role: "admin" as const,
      }, { onConflict: "user_id,role" });
      results.push(`Admin creado: ${adminData.user.id}`);
    } else {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const adm = users?.users?.find((u) => u.email === "admin@bbraun.pe");
      if (adm) {
        await supabaseAdmin.from("user_roles").upsert({
          user_id: adm.id,
          role: "admin" as const,
        }, { onConflict: "user_id,role" });
        results.push(`Admin ya existía, rol asegurado: ${adm.id}`);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
