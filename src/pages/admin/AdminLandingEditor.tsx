// Editor de landing — editar múltiples secciones de la landing
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Upload, CheckCircle } from "lucide-react";

type LandingContent = {
  id?: string;
  title: string;
  subtitle: string;
  cta_text: string;
  hero_image_url: string | null;
  section_key: string;
};

export default function AdminLandingEditor() {
  const [activeSection, setActiveSection] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<LandingContent>({
    title: "",
    subtitle: "",
    cta_text: "",
    hero_image_url: "",
    section_key: "hero",
  });

  const loadContent = async (key: string) => {
    setLoading(true);
    setError(null);
    const { data, error: dbError } = await supabase
      .from("landing_content")
      .select("*")
      .eq("section_key", key)
      .maybeSingle();

    if (dbError) {
      setError("Error al cargar el contenido.");
    } else if (data) {
      setForm({
        id: data.id,
        title: data.title || "",
        subtitle: data.subtitle || "",
        cta_text: data.cta_text || "",
        hero_image_url: data.hero_image_url || null,
        section_key: data.section_key,
      });
    } else {
      // Valor por defecto si no hay data
      setForm({
        title: "",
        subtitle: "",
        cta_text: "",
        hero_image_url: null,
        section_key: key,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContent(activeSection);
  }, [activeSection]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop();
    const path = `${activeSection}-${Date.now()}.${ext}`;

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
    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      cta_text: form.cta_text,
      hero_image_url: form.hero_image_url,
      section_key: activeSection,
    };

    let result;
    if (form.id) {
      result = await supabase
        .from("landing_content")
        .update(payload)
        .eq("id", form.id);
    } else {
      result = await supabase
        .from("landing_content")
        .insert([payload]);
    }

    setSaving(false);

    if (result.error) {
      setError("Error al guardar los cambios.");
      return;
    }

    setSuccess(true);
    // Recargar para obtener el ID si fue un insert
    loadContent(activeSection);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">Editor de Landing</h1>
        <p className="text-muted-foreground">Gestiona el contenido de todas las secciones de la landing del doctor.</p>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-4">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="producto">Producto</TabsTrigger>
          <TabsTrigger value="guias">Guías</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
          <TabsTrigger value="gracias">Gracias</TabsTrigger>
        </TabsList>

        <div className="mt-2">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-64 rounded-lg bg-muted" />
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Editando: {
                    activeSection === "hero" ? "Encabezado Principal" :
                      activeSection === "producto" ? "Sección Producto" :
                        activeSection === "guias" ? "Sección Guías" :
                          activeSection === "faq" ? "Sección FAQ" :
                            activeSection === "contacto" ? "Sección Contacto" : "Sección Gracias"
                  }
                </CardTitle>
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Título de la Sección</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Ingresa el título..."
                    />
                  </div>
                  {activeSection === "hero" && (
                    <div className="space-y-2">
                      <Label>Texto del Botón (CTA)</Label>
                      <Input
                        value={form.cta_text}
                        onChange={(e) => setForm((p) => ({ ...p, cta_text: e.target.value }))}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Contenido / Descripción Inicial</Label>
                    <Textarea
                      value={form.subtitle}
                      onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                      rows={3}
                      placeholder="Escribe el contenido principal de esta sección..."
                    />
                  </div>

                  {/* Editor de Listas para Guías */}
                  {activeSection === "guias" && (
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                      <Label className="text-base font-bold">Pasos de la Guía</Label>
                      <div className="space-y-3">
                        {(() => {
                          let steps: string[] = [];
                          try {
                            if (form.cta_text && form.cta_text.startsWith('[')) {
                              steps = JSON.parse(form.cta_text);
                            }
                          } catch (e) { steps = []; }

                          return (
                            <>
                              {steps.map((step, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <div className="flex-1">
                                    <Input
                                      value={step}
                                      placeholder={`Paso ${idx + 1}`}
                                      onChange={(e) => {
                                        const newSteps = [...steps];
                                        newSteps[idx] = e.target.value;
                                        setForm(p => ({ ...p, cta_text: JSON.stringify(newSteps) }));
                                      }}
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                      const newSteps = steps.filter((_, i) => i !== idx);
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(newSteps) }));
                                    }}
                                  >
                                    <Loader2 className="h-4 w-4 rotate-45" /> {/* Usando Loader2 como X temporal si no hay ícono X */}
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed"
                                onClick={() => {
                                  const newSteps = [...steps, ""];
                                  setForm(p => ({ ...p, cta_text: JSON.stringify(newSteps) }));
                                }}
                              >
                                + Añadir Paso
                              </Button>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Editor de FAQ */}
                  {activeSection === "faq" && (
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                      <Label className="text-base font-bold">Preguntas y Respuestas</Label>
                      <div className="space-y-4">
                        {(() => {
                          let faqs: { q: string, a: string }[] = [];
                          try {
                            if (form.cta_text && form.cta_text.startsWith('[')) {
                              faqs = JSON.parse(form.cta_text);
                            }
                          } catch (e) { faqs = []; }

                          return (
                            <>
                              {faqs.map((faq, idx) => (
                                <Card key={idx} className="relative p-3 border-primary/10">
                                  <div className="grid gap-2">
                                    <Input
                                      value={faq.q}
                                      placeholder="Pregunta"
                                      className="font-bold"
                                      onChange={(e) => {
                                        const newFaqs = [...faqs];
                                        newFaqs[idx].q = e.target.value;
                                        setForm(p => ({ ...p, cta_text: JSON.stringify(newFaqs) }));
                                      }}
                                    />
                                    <Textarea
                                      value={faq.a}
                                      placeholder="Respuesta"
                                      rows={2}
                                      className="text-sm"
                                      onChange={(e) => {
                                        const newFaqs = [...faqs];
                                        newFaqs[idx].a = e.target.value;
                                        setForm(p => ({ ...p, cta_text: JSON.stringify(newFaqs) }));
                                      }}
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm text-destructive"
                                    onClick={() => {
                                      const newFaqs = faqs.filter((_, i) => i !== idx);
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(newFaqs) }));
                                    }}
                                  >
                                    <Loader2 className="h-3 w-3 rotate-45" />
                                  </Button>
                                </Card>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed"
                                onClick={() => {
                                  const newFaqs = [...faqs, { q: "", a: "" }];
                                  setForm(p => ({ ...p, cta_text: JSON.stringify(newFaqs) }));
                                }}
                              >
                                + Añadir Pregunta
                              </Button>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {!["faq", "contacto", "gracias"].includes(activeSection) && (
                  <div className="space-y-2">
                    <Label>Imagen Representativa</Label>
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
                        <div className="relative group">
                          <img
                            src={form.hero_image_url}
                            alt="Preview"
                            className="h-20 rounded-lg border object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    onClick={handleSave}
                    className="rounded-full gap-2 w-full md:w-auto"
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Guardar Sección
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Tabs>
    </div>
  );
}


