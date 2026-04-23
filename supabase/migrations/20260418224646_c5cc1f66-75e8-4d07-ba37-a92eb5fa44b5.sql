
-- Reviews table for client ratings
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  service TEXT,
  city TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Approved reviews are public"
  ON public.reviews FOR SELECT
  USING (approved = true);

-- Anyone can submit a review (will need approval before showing)
CREATE POLICY "Anyone can submit a review"
  ON public.reviews FOR INSERT
  WITH CHECK (
    approved = false
    AND char_length(name) BETWEEN 2 AND 80
    AND char_length(comment) BETWEEN 5 AND 1000
    AND rating BETWEEN 1 AND 5
  );

CREATE INDEX idx_reviews_approved_created ON public.reviews(approved, created_at DESC);
