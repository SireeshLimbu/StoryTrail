ALTER TABLE public.cities ADD COLUMN display_order integer NOT NULL DEFAULT 0;
CREATE INDEX idx_cities_display_order ON public.cities (display_order);