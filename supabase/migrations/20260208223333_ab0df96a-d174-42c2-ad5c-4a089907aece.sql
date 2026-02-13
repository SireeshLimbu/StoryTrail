-- Add map_image_url column to cities table for storing uploaded map images
ALTER TABLE public.cities
ADD COLUMN map_image_url text;

-- Create storage bucket for city map images
INSERT INTO storage.buckets (id, name, public)
VALUES ('city-maps', 'city-maps', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for city map uploads (admins only can upload)
CREATE POLICY "Anyone can view city maps"
ON storage.objects FOR SELECT
USING (bucket_id = 'city-maps');

CREATE POLICY "Admins can upload city maps"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'city-maps' AND is_admin());

CREATE POLICY "Admins can update city maps"
ON storage.objects FOR UPDATE
USING (bucket_id = 'city-maps' AND is_admin());

CREATE POLICY "Admins can delete city maps"
ON storage.objects FOR DELETE
USING (bucket_id = 'city-maps' AND is_admin());