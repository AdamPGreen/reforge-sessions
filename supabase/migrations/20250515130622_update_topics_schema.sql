-- Add new columns to topics table
ALTER TABLE topics 
ADD COLUMN is_external boolean DEFAULT false,
ADD COLUMN knows_expert boolean DEFAULT false;

-- Drop volunteers table as it's no longer needed
DROP TABLE IF EXISTS volunteers; 