/*
  # Create Outfits Management System

  1. New Tables
    - `outfits`
      - `id` (uuid, primary key) - Unique identifier for each outfit
      - `user_id` (uuid) - Reference to the authenticated user who owns the outfit
      - `image_url` (text) - URL to the outfit image stored in Supabase Storage
      - `title` (text) - Optional title/name for the outfit
      - `weather` (text) - Weather condition tag (e.g., sunny, rainy, cold, hot)
      - `temperature` (text) - Temperature range tag (e.g., warm, cool, hot, cold)
      - `feeling` (text) - Mood/feeling associated with the outfit (e.g., casual, formal, confident)
      - `season` (text) - Season tag (e.g., spring, summer, fall, winter)
      - `tags` (text array) - Additional custom tags for filtering
      - `notes` (text) - Optional notes about the outfit
      - `created_at` (timestamptz) - Timestamp when the outfit was added
      - `updated_at` (timestamptz) - Timestamp when the outfit was last updated

  2. Security
    - Enable RLS on `outfits` table
    - Add policies for authenticated users to:
      - Read their own outfits
      - Insert their own outfits
      - Update their own outfits
      - Delete their own outfits

  3. Storage
    - Create a storage bucket for outfit images
    - Enable RLS on the storage bucket
    - Add policies for authenticated users to upload and access their own images
*/

-- Create outfits table
CREATE TABLE IF NOT EXISTS outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  title text DEFAULT '',
  weather text DEFAULT '',
  temperature text DEFAULT '',
  feeling text DEFAULT '',
  season text DEFAULT '',
  tags text[] DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for outfits table
CREATE POLICY "Users can view own outfits"
  ON outfits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfits"
  ON outfits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits"
  ON outfits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits"
  ON outfits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS outfits_user_id_idx ON outfits(user_id);
CREATE INDEX IF NOT EXISTS outfits_created_at_idx ON outfits(created_at DESC);
CREATE INDEX IF NOT EXISTS outfits_weather_idx ON outfits(weather);
CREATE INDEX IF NOT EXISTS outfits_temperature_idx ON outfits(temperature);
CREATE INDEX IF NOT EXISTS outfits_feeling_idx ON outfits(feeling);
CREATE INDEX IF NOT EXISTS outfits_season_idx ON outfits(season);

-- Create storage bucket for outfit images
INSERT INTO storage.buckets (id, name, public)
VALUES ('outfits', 'outfits', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage bucket
CREATE POLICY "Users can upload own outfit images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'outfits' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own outfit images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'outfits' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own outfit images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'outfits' AND
    auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'outfits' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own outfit images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'outfits' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );