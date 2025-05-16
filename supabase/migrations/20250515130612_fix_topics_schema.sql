-- Revert user_id column to NOT NULL
ALTER TABLE topics ALTER COLUMN user_id SET NOT NULL;

-- Drop the policy if it exists before recreating it
DROP POLICY IF EXISTS "Users can update their own topics" ON topics;
CREATE POLICY "Users can update their own topics"
  ON topics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id); 