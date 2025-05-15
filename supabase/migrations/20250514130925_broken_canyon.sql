/*
  # Create storage buckets for assets
  
  1. New Buckets
    - `app-assets`: For application assets (images, fonts, etc.)
    - `user-avatars`: For user profile pictures
    - `session-recordings`: For session recordings and materials
    
  2. Security
    - Enable public access to app assets
    - Restrict user avatars to authenticated users
    - Restrict session recordings to authenticated users
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('app-assets', 'app-assets', true),
  ('user-avatars', 'user-avatars', false),
  ('session-recordings', 'session-recordings', false);

-- Set up security policies for app-assets
CREATE POLICY "Public can view app assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'app-assets');

CREATE POLICY "Only admins can modify app assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'app-assets' AND
    auth.jwt() ->> 'email' LIKE '%@reforge.com'
  );

-- Set up security policies for user avatars
CREATE POLICY "Users can view avatars"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user-avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Set up security policies for session recordings
CREATE POLICY "Authenticated users can view recordings"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'session-recordings');

CREATE POLICY "Only admins can upload recordings"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'session-recordings' AND
    auth.jwt() ->> 'email' LIKE '%@reforge.com'
  );