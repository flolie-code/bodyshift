-- Storage-Bucket fuer KI-generierte Rezept-Bilder
-- Oeffentlich lesbar (jeder mit URL kann Bild sehen), Schreibrechte nur Service-Role

INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Alle koennen Bilder lesen
CREATE POLICY "recipe_images_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');

-- Nur Service-Role kann hochladen (Edge Functions)
CREATE POLICY "recipe_images_service_write"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'service_role');

CREATE POLICY "recipe_images_service_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'recipe-images' AND auth.role() = 'service_role');
