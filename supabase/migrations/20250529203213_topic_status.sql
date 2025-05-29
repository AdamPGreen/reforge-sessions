-- Add status column to topics table
ALTER TABLE topics ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'converted', 'archived'));

-- Create index on status for better query performance
CREATE INDEX idx_topics_status ON topics(status);

-- Drop the redundant votes column from topics table
ALTER TABLE topics DROP COLUMN votes;

-- Create a view for vote counts
CREATE OR REPLACE VIEW topic_vote_counts AS
SELECT 
    t.id as topic_id,
    COUNT(v.id) as vote_count
FROM topics t
LEFT JOIN votes v ON t.id = v.topic_id
GROUP BY t.id;

-- Update existing topics to have 'active' status
UPDATE topics SET status = 'active' WHERE status IS NULL; 