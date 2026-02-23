// Editor de landing — editar hero image, título, subtítulo y CTA
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, Upload, CheckCircle } from "lucide-react";

export default function AdminLandingEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentId, setContentId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    cta_text: "",
    hero_image_url: "",
  });

  useEffect(() => {
    supabase
      .from("landing_content")
      .select("*")
      .eq("section_key", "hero")
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setContentId(data.id);
          setForm({
            title: data.title,
            subtitle: data.subtitle,
            cta_text: data.cta_text,
            hero_image_url: data.hero_image_url ?? "",
          });
        }
        setLoading(false);
      });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop();
    const path = `hero-${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("landing-images")
      .upload(path, file, { upsert: true });

    if (uploadErr) {
      setError("Error al subir la imagen.");
      return;
    }

    const { data } = supabase.storage.from("landing-images").getPublicUrl(path);
    setForm((prev) => ({ ...prev, hero_image_url: data.publicUrl }));
  };

  const handleSave = async () => {
    if (!contentId) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: dbErr } = await supabase
      .from("landing_content")
      .update({
        title: form.title,
        subtitle: form.subtitle,
        cta_text: form.cta_text,
        hero_image_url: form.hero_image_url || null,
      })
      .eq("id", contentId);

    setSaving(false);

    if (dbErr) {
      setError("Error al guardar los cambios.");
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading)
    return <div className="animate-pulse space-y-4"><div className="h-64 rounded-lg bg-muted" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">Editor de Landing</h1>
        <p className="text-muted-foreground">Edita el contenido que ven los doctores al ingresar.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Sección Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-primary/30 bg-primary/5">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary">Cambios guardados correctamente.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Título Principal</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Textarea
              value={form.subtitle}
              onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              rows={3}
              maxLength={300}
            />
          </div>
          <div className="space-y-2">
            <Label>Texto del Botón (CTA)</Label>
            <Input
              value={form.cta_text}
              onChange={(e) => setForm((p) => ({ ...p, cta_text: e.target.value }))}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label>Imagen del Hero</Label>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Subir Imagen
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </Button>
              {form.hero_image_url && (
                <img
                  src={form.hero_image_url}
                  alt="Preview"
                  className="h-16 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="rounded-full gap-2"
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar Cambios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
