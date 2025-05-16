-- Add user_email column to topics table
ALTER TABLE topics ADD COLUMN user_email text;

-- Update existing topics with user emails
UPDATE topics t
SET user_email = u.email
FROM auth.users u
WHERE t.user_id = u.id;

-- Make user_email NOT NULL for future entries
ALTER TABLE topics ALTER COLUMN user_email SET NOT NULL; 