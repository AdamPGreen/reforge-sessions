-- Add user_name column to topics table
ALTER TABLE topics ADD COLUMN user_name text;

-- Update existing topics with user names from auth.users
UPDATE topics t
SET user_name = COALESCE(
  (SELECT u.raw_user_meta_data->>'full_name' 
   FROM auth.users u 
   WHERE u.id = t.user_id),
  t.user_email
);

-- Make user_name NOT NULL for future entries
ALTER TABLE topics ALTER COLUMN user_name SET NOT NULL; 