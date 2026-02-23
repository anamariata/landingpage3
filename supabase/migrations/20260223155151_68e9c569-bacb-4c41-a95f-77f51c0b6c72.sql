
-- Corregir política permisiva en page_visits
DROP POLICY "Usuarios autenticados pueden registrar visitas" ON public.page_visits;

CREATE POLICY "Usuarios registran sus propias visitas"
ON public.page_visits FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());
