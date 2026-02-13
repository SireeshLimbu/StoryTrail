-- Create storage bucket for character images
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-images', 'character-images', true);

-- Allow anyone to view character images (public bucket)
CREATE POLICY "Anyone can view character images"
ON storage.objects FOR SELECT
USING (bucket_id = 'character-images');

-- Allow admins to upload character images
CREATE POLICY "Admins can upload character images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'character-images' AND is_admin());

-- Allow admins to update character images
CREATE POLICY "Admins can update character images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'character-images' AND is_admin());

-- Allow admins to delete character images
CREATE POLICY "Admins can delete character images"
ON storage.objects FOR DELETE
USING (bucket_id = 'character-images' AND is_admin());