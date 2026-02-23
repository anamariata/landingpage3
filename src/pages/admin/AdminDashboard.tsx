// Dashboard del admin — vista general con KPIs
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Eye, TrendingUp, FileText } from "lucide-react";
import { EmptyState } from "@/components/system/EmptyState";

interface Stats {
  totalLeads: number;
  totalVisits: number;
  todayVisits: number;
  todayLeads: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const today = new Date().toISOString().split("T")[0];

      const [leadsRes, visitsRes, todayVisitsRes, todayLeadsRes] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("page_visits").select("id", { count: "exact", head: true }),
        supabase.from("page_visits").select("id", { count: "exact", head: true }).gte("visited_at", today),
        supabase.from("leads").select("id", { count: "exact", head: true }).gte("submitted_at", today),
      ]);

      setStats({
        totalLeads: leadsRes.count ?? 0,
        totalVisits: visitsRes.count ?? 0,
        todayVisits: todayVisitsRes.count ?? 0,
        todayLeads: todayLeadsRes.count ?? 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = stats
    ? [
        { icon: Users, label: "Leads Totales", value: stats.totalLeads, color: "text-primary" },
        { icon: Eye, label: "Visitas Totales", value: stats.totalVisits, color: "text-primary" },
        { icon: TrendingUp, label: "Visitas Hoy", value: stats.todayVisits, color: "text-primary" },
        { icon: FileText, label: "Leads Hoy", value: stats.todayLeads, color: "text-primary" },
      ]
    : [];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm animate-pulse">
            <CardContent className="p-6"><div className="h-16 rounded bg-muted" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return <EmptyState title="Sin datos" description="No hay información disponible." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Vista general del sistema.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
