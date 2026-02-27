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
import { Loader2, Save, Upload, CheckCircle, X } from "lucide-react";

// Definición del tipo para el contenido de la landing, alineado con la tabla 'landing_content' de Supabase
type LandingContent = {
  id?: string;
  title: string;
  subtitle: string;
  cta_text: string;     // Usado para texto simple o JSON stringificado (listas, tablas)
  hero_image_url: string | null;
  section_key: string;  // Identificador único de la sección (hero, producto, especificaciones, etc.)
};

export default function AdminLandingEditor() {
  // Estados para controlar la UI y validaciones
  const [activeSection, setActiveSection] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario actual
  const [form, setForm] = useState<LandingContent>({
    title: "",
    subtitle: "",
    cta_text: "",
    hero_image_url: "",
    section_key: "hero",
  });

  // Función para cargar los datos de una sección específica desde Supabase
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

  // Recargar el contenido cada vez que el usuario cambia de pestaña
  useEffect(() => {
    loadContent(activeSection);
  }, [activeSection]);

  // Gestión de subida de imágenes a Supabase Storage
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

  // Función unificada para guardar los cambios (insert o update)
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
        {/* Navegación por pestañas para las diferentes secciones de la landing */}
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-4">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="producto">Producto</TabsTrigger>
          <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
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
                            activeSection === "especificaciones" ? "Especificaciones Técnicas" :
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
                  {activeSection !== "especificaciones" && (
                    <div className="space-y-2">
                      <Label>Contenido / Descripción Inicial</Label>
                      <Textarea
                        value={form.subtitle}
                        onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                        rows={3}
                        placeholder="Escribe el contenido principal de esta sección..."
                      />
                    </div>
                  )}

                  {/* 
                    EDITOR DE ESPECIFICACIONES TÉCNICAS
                    Los datos se almacenan como un array de objetos JSON en el campo cta_text
                  */}
                  {activeSection === "especificaciones" && (
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-4 overflow-x-auto">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-bold">Filas de la Tabla</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            let items = [];
                            try {
                              if (form.cta_text && form.cta_text.startsWith('[')) {
                                items = JSON.parse(form.cta_text);
                              }
                            } catch (e) { items = []; }
                            const next = [...items, { gauge: "", length: "", diameter: "", flow: "", material: "" }];
                            setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                          }}
                        >
                          + Añadir Fila
                        </Button>
                      </div>

                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-muted-foreground border-b uppercase text-[10px] tracking-wider">
                            <th className="pb-2 font-medium text-left px-2">Calibre</th>
                            <th className="pb-2 font-medium text-left px-2">Longitud</th>
                            <th className="pb-2 font-medium text-left px-2">Diámetro</th>
                            <th className="pb-2 font-medium text-left px-2">Flujo</th>
                            <th className="pb-2 font-medium text-left px-2">Material</th>
                            <th className="pb-2 w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            let items: any[] = [];
                            try {
                              if (form.cta_text && form.cta_text.startsWith('[')) {
                                items = JSON.parse(form.cta_text);
                              }
                            } catch (e) { items = []; }

                            return items.map((item, idx) => (
                              <tr key={idx} className="border-b border-muted last:border-0">
                                <td className="py-2 px-1">
                                  <Input
                                    value={item.gauge}
                                    className="h-8 text-xs"
                                    onChange={(e) => {
                                      const next = [...items];
                                      next[idx].gauge = e.target.value;
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                    }}
                                  />
                                </td>
                                <td className="py-2 px-1">
                                  <Input
                                    value={item.length}
                                    className="h-8 text-xs"
                                    onChange={(e) => {
                                      const next = [...items];
                                      next[idx].length = e.target.value;
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                    }}
                                  />
                                </td>
                                <td className="py-2 px-1">
                                  <Input
                                    value={item.diameter}
                                    className="h-8 text-xs"
                                    onChange={(e) => {
                                      const next = [...items];
                                      next[idx].diameter = e.target.value;
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                    }}
                                  />
                                </td>
                                <td className="py-2 px-1">
                                  <Input
                                    value={item.flow}
                                    className="h-8 text-xs"
                                    onChange={(e) => {
                                      const next = [...items];
                                      next[idx].flow = e.target.value;
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                    }}
                                  />
                                </td>
                                <td className="py-2 px-1">
                                  <Input
                                    value={item.material}
                                    className="h-8 text-xs"
                                    onChange={(e) => {
                                      const next = [...items];
                                      next[idx].material = e.target.value;
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                    }}
                                  />
                                </td>
                                <td className="py-2 px-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => {
                                      const next = items.filter((_, i) => i !== idx);
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 
                    EDITOR DE BENEFICIOS PARA PRODUCTO
                    Maneja una lista de beneficios (título, descripción, imagen individual)
                  */}
                  {activeSection === "producto" && (
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                      <Label className="text-base font-bold">Beneficios Clave</Label>
                      <div className="space-y-4">
                        {(() => {
                          // Soporta el campo 'image' dinámico por cada beneficio
                          let items: { title: string, description: string, image?: string }[] = [];
                          try {
                            if (form.cta_text && form.cta_text.startsWith('[')) {
                              items = JSON.parse(form.cta_text);
                            }
                          } catch (e) { items = []; }

                          return (
                            <>
                              {items.map((item, idx) => (
                                <Card key={idx} className="relative p-3 border-primary/10">
                                  <div className="grid gap-4 md:grid-cols-[100px_1fr]">

                                    {/* Contenedor de Imagen del Beneficio */}
                                    <div className="group relative flex h-24 w-full flex-col items-center justify-center overflow-hidden rounded-md border bg-background">
                                      {item.image ? (
                                        <img src={item.image} alt={item.title} className="h-full w-full object-contain p-1" />
                                      ) : (
                                        <span className="text-[10px] text-muted-foreground text-center px-1">Subir Imagen</span>
                                      )}
                                      <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                        <Upload className="h-4 w-4" />
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            // Creamos un path dinámico usando la fecha para evitar colisiones
                                            const ext = file.name.split(".").pop();
                                            const path = `benefit-${Date.now()}.${ext}`;

                                            // Subir directamente a Supabase
                                            const { error: uploadErr } = await supabase.storage.from("landing-images").upload(path, file, { upsert: true });
                                            if (uploadErr) return; // TODO: handle error en UI

                                            const { data } = supabase.storage.from("landing-images").getPublicUrl(path);

                                            // Actualizar el estado temporal de los items con la nueva URL pública
                                            const next = [...items];
                                            next[idx].image = data.publicUrl;
                                            setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                          }}
                                        />
                                      </label>
                                    </div>

                                    {/* Textos del Beneficio */}
                                    <div className="grid gap-2">
                                      <Input
                                        value={item.title}
                                        placeholder="Título del beneficio"
                                        className="h-auto border-0 bg-transparent p-0 font-bold focus-visible:ring-0"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[idx].title = e.target.value;
                                          setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                        }}
                                      />
                                      <Textarea
                                        value={item.description}
                                        placeholder="Descripción corta"
                                        rows={2}
                                        className="h-auto resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                                        onChange={(e) => {
                                          const next = [...items];
                                          next[idx].description = e.target.value;
                                          setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full border bg-background text-destructive shadow-sm"
                                    onClick={() => {
                                      const next = items.filter((_, i) => i !== idx);
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Card>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed"
                                onClick={() => {
                                  const next = [...items, { title: "", description: "", image: "" }];
                                  setForm(p => ({ ...p, cta_text: JSON.stringify(next) }));
                                }}
                              >
                                + Añadir Beneficio
                              </Button>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* 
                    EDITOR DE GUÍAS DE USO
                    Maneja una tarjeta destacada (título/descripción) y una lista de pasos.
                    Todo se guarda como un objeto JSON en cta_text: { featureTitle, featureDescription, steps }
                  */}
                  {activeSection === "guias" && (
                    <div className="space-y-6 rounded-lg border bg-muted/50 p-4">
                      {(() => {
                        let data = { featureTitle: "", featureDescription: "", steps: [] as string[] };
                        try {
                          if (form.cta_text) {
                            if (form.cta_text.startsWith('[')) {
                              // Migración de formato antiguo (solo array) a nuevo formato (objeto)
                              data.steps = JSON.parse(form.cta_text);
                            } else if (form.cta_text.startsWith('{')) {
                              data = { ...data, ...JSON.parse(form.cta_text) };
                            }
                          }
                        } catch (e) { /* ignore */ }

                        return (
                          <>
                            {/* Editor de la Tarjeta Destacada */}
                            <div className="space-y-4">
                              <Label className="text-base font-bold text-primary">Tarjeta Destacada (Imagen)</Label>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label className="text-xs">Título de la Tarjeta</Label>
                                  <Input
                                    value={data.featureTitle}
                                    placeholder="Ej: Cateterización guiada por ultrasonido"
                                    onChange={(e) => {
                                      const newData = { ...data, featureTitle: e.target.value };
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(newData) }));
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Descripción de la Tarjeta</Label>
                                  <Textarea
                                    value={data.featureDescription}
                                    placeholder="Breve descripción del caso de uso..."
                                    rows={2}
                                    onChange={(e) => {
                                      const newData = { ...data, featureDescription: e.target.value };
                                      setForm(p => ({ ...p, cta_text: JSON.stringify(newData) }));
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Separador */}
                            <div className="border-t border-border"></div>

                            {/* Editor de la Lista de Pasos */}
                            <div className="space-y-3">
                              <Label className="text-base font-bold text-primary">Lista de Pasos (Paso a Paso)</Label>
                              {data.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <div className="flex-1">
                                    <Input
                                      value={step}
                                      placeholder={`Paso ${idx + 1}`}
                                      onChange={(e) => {
                                        const newSteps = [...data.steps];
                                        newSteps[idx] = e.target.value;
                                        setForm(p => ({ ...p, cta_text: JSON.stringify({ ...data, steps: newSteps }) }));
                                      }}
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                      const newSteps = data.steps.filter((_, i) => i !== idx);
                                      setForm(p => ({ ...p, cta_text: JSON.stringify({ ...data, steps: newSteps }) }));
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed"
                                onClick={() => {
                                  const newSteps = [...data.steps, ""];
                                  setForm(p => ({ ...p, cta_text: JSON.stringify({ ...data, steps: newSteps }) }));
                                }}
                              >
                                + Añadir Paso
                              </Button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* 
                    EDITOR DE FAQ (PREGUNTAS FRECUENTES)
                    Maneja pares de Pregunta y Respuesta
                  */}
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
                                    <X className="h-3 w-3" />
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

                {/* 
                  SECCIÓN DE IMAGEN REPRESENTATIVA 
                  Solo mostramos el uploader de imágenes en secciones que realmente lo usan (hero, producto, guías).
                  Secciones de solo texto/tablas quedan excluidas. 
                */}
                {!["faq", "contacto", "gracias", "especificaciones"].includes(activeSection) && (
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


