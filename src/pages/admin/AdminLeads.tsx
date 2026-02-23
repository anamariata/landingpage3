// Tabla de leads del admin — con filtros y exportación
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/system/EmptyState";
import { Download, Search } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("leads")
      .select("*")
      .order("submitted_at", { ascending: false })
      .then(({ data }) => {
        setLeads(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.specialty.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["Nombre", "Especialidad", "Correo", "Teléfono", "Producto", "Fecha"];
    const rows = filtered.map((l) => [
      l.name,
      l.specialty,
      l.email,
      l.phone,
      l.product_of_interest,
      new Date(l.submitted_at).toLocaleDateString("es-PE"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return <div className="animate-pulse space-y-4"><div className="h-64 rounded-lg bg-muted" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Leads</h1>
          <p className="text-muted-foreground">{leads.length} solicitudes recibidas.</p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="rounded-full gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, especialidad o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Sin resultados" description="No se encontraron leads con ese criterio." />
      ) : (
        <Card className="overflow-hidden border-0 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold">Especialidad</TableHead>
                <TableHead className="font-semibold">Correo</TableHead>
                <TableHead className="font-semibold">Teléfono</TableHead>
                <TableHead className="font-semibold">Producto</TableHead>
                <TableHead className="font-semibold">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell>{l.specialty}</TableCell>
                  <TableCell>{l.email}</TableCell>
                  <TableCell>{l.phone}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {l.product_of_interest}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(l.submitted_at).toLocaleDateString("es-PE")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
