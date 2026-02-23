// Página de métricas del admin — gráficos de visitas y leads
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/system/EmptyState";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = [
  "hsl(160, 100%, 25%)",
  "hsl(160, 100%, 33%)",
  "hsl(160, 60%, 45%)",
  "hsl(160, 40%, 55%)",
  "hsl(160, 30%, 65%)",
  "hsl(210, 17%, 70%)",
];

export default function AdminMetricas() {
  const [weeklyVisits, setWeeklyVisits] = useState<{ day: string; visits: number }[]>([]);
  const [specialtyBreakdown, setSpecialtyBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      // Visitas últimos 7 días
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: visits } = await supabase
        .from("page_visits")
        .select("visited_at")
        .gte("visited_at", sevenDaysAgo.toISOString());

      // Agrupar por día
      const dayMap: Record<string, number> = {};
      const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        dayMap[key] = 0;
      }
      visits?.forEach((v) => {
        const key = v.visited_at.split("T")[0];
        if (key in dayMap) dayMap[key]++;
      });
      setWeeklyVisits(
        Object.entries(dayMap).map(([date, count]) => ({
          day: days[new Date(date).getDay()],
          visits: count,
        }))
      );

      // Leads por especialidad
      const { data: leads } = await supabase.from("leads").select("specialty");
      const specMap: Record<string, number> = {};
      leads?.forEach((l) => {
        specMap[l.specialty] = (specMap[l.specialty] || 0) + 1;
      });
      setSpecialtyBreakdown(
        Object.entries(specMap).map(([name, value]) => ({ name, value }))
      );

      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-64 rounded-lg bg-muted" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">Métricas</h1>
        <p className="text-muted-foreground">Evolución semanal y distribución de leads.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visitas semanales */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Visitas — Últimos 7 días</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyVisits.every((v) => v.visits === 0) ? (
              <EmptyState title="Sin visitas" description="No hay visitas registradas esta semana." />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyVisits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="visits" fill="hsl(160, 100%, 25%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Especialidades */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Leads por Especialidad</CardTitle>
          </CardHeader>
          <CardContent>
            {specialtyBreakdown.length === 0 ? (
              <EmptyState title="Sin leads" description="Aún no hay leads registrados." />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={specialtyBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {specialtyBreakdown.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
