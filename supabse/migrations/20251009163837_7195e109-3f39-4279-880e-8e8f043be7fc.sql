-- Add new columns to tours table for filtering
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS transportation text[] DEFAULT ARRAY['xe'],
ADD COLUMN IF NOT EXISTS quality_tier text DEFAULT 'standard' CHECK (quality_tier IN ('budget', 'standard', 'premium'));

-- Add index for better search performance
CREATE INDEX IF NOT EXISTS idx_tours_location ON tours USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_tours_price ON tours(price);

-- Update health_assessments table for more detailed health screening
ALTER TABLE health_assessments
ADD COLUMN IF NOT EXISTS has_heart_conditions boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_respiratory_conditions boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_mobility_issues boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS emergency_contact_name text,
ADD COLUMN IF NOT EXISTS emergency_contact_phone text;