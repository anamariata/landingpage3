
-- ═══════════════════════════════════════════
-- ENUM DE ROLES
-- ═══════════════════════════════════════════
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor');

-- ═══════════════════════════════════════════
-- TABLA: user_roles
-- ═══════════════════════════════════════════
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
-- TABLA: leads (formulario de contacto)
-- ═══════════════════════════════════════════
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    product_of_interest TEXT NOT NULL,
    submitted_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
-- TABLA: landing_content (editable por admin)
-- ═══════════════════════════════════════════
CREATE TABLE public.landing_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE,
    hero_image_url TEXT,
    title TEXT NOT NULL DEFAULT '',
    subtitle TEXT NOT NULL DEFAULT '',
    cta_text TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.landing_content ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
-- TABLA: page_visits (métricas)
-- ═══════════════════════════════════════════
CREATE TABLE public.page_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    path TEXT NOT NULL,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
-- FUNCIONES HELPER (SECURITY DEFINER)
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.is_doctor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(auth.uid(), 'doctor')
$$;

-- Trigger para updated_at en landing_content
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_landing_content_updated_at
BEFORE UPDATE ON public.landing_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ═══════════════════════════════════════════
-- RLS POLICIES: user_roles
-- ═══════════════════════════════════════════
CREATE POLICY "Usuarios autenticados pueden ver sus propios roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Solo admins pueden crear roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Solo admins pueden eliminar roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.is_admin());

-- ═══════════════════════════════════════════
-- RLS POLICIES: leads
-- ═══════════════════════════════════════════
CREATE POLICY "Doctores y admins pueden crear leads"
ON public.leads FOR INSERT TO authenticated
WITH CHECK (public.is_admin() OR public.is_doctor());

CREATE POLICY "Admins pueden ver todos los leads"
ON public.leads FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins pueden actualizar leads"
ON public.leads FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins pueden eliminar leads"
ON public.leads FOR DELETE TO authenticated
USING (public.is_admin());

-- ═══════════════════════════════════════════
-- RLS POLICIES: landing_content
-- ═══════════════════════════════════════════
CREATE POLICY "Cualquier usuario autenticado puede ver el contenido"
ON public.landing_content FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Solo admins pueden editar contenido"
ON public.landing_content FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "Solo admins pueden insertar contenido"
ON public.landing_content FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

-- ═══════════════════════════════════════════
-- RLS POLICIES: page_visits
-- ═══════════════════════════════════════════
CREATE POLICY "Usuarios autenticados pueden registrar visitas"
ON public.page_visits FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Solo admins pueden ver visitas"
ON public.page_visits FOR SELECT TO authenticated
USING (public.is_admin());

-- ═══════════════════════════════════════════
-- DATOS INICIALES: contenido de la landing
-- ═══════════════════════════════════════════
INSERT INTO public.landing_content (section_key, title, subtitle, cta_text)
VALUES ('hero', 'Protección Pasiva, Precisión Activa.', 'El nuevo estándar en acceso vascular con tecnología de control de sangre multi-acceso. Diseñado para proteger al clínico y al paciente.', 'Solicitar Información');

-- ═══════════════════════════════════════════
-- STORAGE: bucket para imágenes de landing
-- ═══════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public) VALUES ('landing-images', 'landing-images', true);

CREATE POLICY "Imágenes de landing son públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'landing-images');

CREATE POLICY "Solo admins pueden subir imágenes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'landing-images' AND public.is_admin());

CREATE POLICY "Solo admins pueden actualizar imágenes"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'landing-images' AND public.is_admin());

CREATE POLICY "Solo admins pueden eliminar imágenes"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'landing-images' AND public.is_admin());
