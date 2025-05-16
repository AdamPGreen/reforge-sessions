-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only admins can view admin_users"
    ON admin_users FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "Only admins can insert into admin_users"
    ON admin_users FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "Only admins can delete from admin_users"
    ON admin_users FOR DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    ));

-- Insert initial admin user (replace with actual user ID)
INSERT INTO admin_users (user_id, created_by)
SELECT id, id
FROM auth.users
WHERE email = 'adam.green@reforge.com'
ON CONFLICT (user_id) DO NOTHING; 