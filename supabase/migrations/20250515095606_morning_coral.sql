-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000002',
  'authenticated',
  'authenticated',
  'adam.green@reforge.com',
  'admin',
  NOW(),
  NOW(),
  NOW()
);

-- Add email domain restriction policy
CREATE POLICY "Only allow reforge.com emails"
  ON auth.users
  FOR INSERT
  WITH CHECK (RIGHT(email, 12) = '@reforge.com');