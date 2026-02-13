-- Rename map_image_url to google_maps_url for clarity
ALTER TABLE public.cities
RENAME COLUMN map_image_url TO google_maps_url;