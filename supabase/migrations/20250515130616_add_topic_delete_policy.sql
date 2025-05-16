-- Add delete policy for topics
CREATE POLICY "Admins can delete any topic"
  ON topics FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  )); 