-- Add confirmation_token column to auth.users if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'auth' 
        AND table_name = 'users' 
        AND column_name = 'confirmation_token'
    ) THEN
        ALTER TABLE auth.users 
        ADD COLUMN confirmation_token text;
    END IF;
END $$;

-- Update existing users to have a default confirmation_token
UPDATE auth.users 
SET confirmation_token = gen_random_uuid()::text 
WHERE confirmation_token IS NULL;

-- Add NOT NULL constraint to confirmation_token
ALTER TABLE auth.users 
ALTER COLUMN confirmation_token SET NOT NULL; 