-- Add session_id column to topics table
ALTER TABLE topics ADD COLUMN session_id uuid REFERENCES sessions(id);

-- Add index for better query performance
CREATE INDEX idx_topics_session_id ON topics(session_id);

-- Add policy to allow admins to update session_id
CREATE POLICY "Admins can update session_id"
  ON topics FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  )); 