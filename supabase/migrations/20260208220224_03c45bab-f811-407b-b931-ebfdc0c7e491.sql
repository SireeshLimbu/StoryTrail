-- Create storage bucket for location images
INSERT INTO storage.buckets (id, name, public)
VALUES ('location-images', 'location-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
CREATE POLICY "Anyone can view location images"
ON storage.objects FOR SELECT
USING (bucket_id = 'location-images');

-- Create storage policy for admin upload
CREATE POLICY "Admins can upload location images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'location-images' AND is_admin());

-- Create storage policy for admin update
CREATE POLICY "Admins can update location images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'location-images' AND is_admin());

-- Create storage policy for admin delete
CREATE POLICY "Admins can delete location images"
ON storage.objects FOR DELETE
USING (bucket_id = 'location-images' AND is_admin());