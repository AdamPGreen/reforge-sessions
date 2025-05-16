-- Drop existing admin_users policies
DROP POLICY IF EXISTS "Only admins can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can insert into admin_users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can delete from admin_users" ON admin_users;

-- Create new policies that don't cause recursion
CREATE POLICY "Anyone can view admin_users"
    ON admin_users FOR SELECT
    TO authenticated
    USING (true);

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