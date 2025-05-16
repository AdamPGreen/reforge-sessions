-- Drop existing admin policies
DROP POLICY IF EXISTS "Only admins can modify sessions" ON sessions;
DROP POLICY IF EXISTS "Only admins can modify app assets" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can upload recordings" ON storage.objects;

-- Create new admin policies using admin_users table
CREATE POLICY "Only admins can modify sessions"
  ON sessions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Only admins can modify app assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'app-assets' AND
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only admins can upload recordings"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'session-recordings' AND
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  ); 