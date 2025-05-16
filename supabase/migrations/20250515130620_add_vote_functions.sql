-- Function to increment votes
CREATE OR REPLACE FUNCTION increment_votes(topic_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE topics
  SET votes = votes + 1
  WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement votes
CREATE OR REPLACE FUNCTION decrement_votes(topic_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE topics
  SET votes = GREATEST(votes - 1, 0)
  WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION increment_votes TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_votes TO authenticated; 