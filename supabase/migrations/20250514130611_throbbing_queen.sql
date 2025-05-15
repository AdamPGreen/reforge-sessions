/*
  # Initial Schema Setup for Reforge AI Sessions

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (timestamptz)
      - `speaker` (text)
      - `recording_link` (text, nullable)
      - `summary_link` (text, nullable)
      - `calendar_link` (text, nullable)
      - `created_at` (timestamptz)
      - `is_past` (boolean)
    
    - `topics`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `votes` (integer)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

    - `votes`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, references topics)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create sessions table
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  speaker text NOT NULL,
  recording_link text,
  summary_link text,
  calendar_link text,
  created_at timestamptz DEFAULT now(),
  is_past boolean DEFAULT false
);

-- Create topics table
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

-- Create votes table
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(topic_id, user_id)
);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Sessions policies
CREATE POLICY "Anyone can view sessions"
  ON sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify sessions"
  ON sessions
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%@reforge.com');

-- Topics policies
CREATE POLICY "Anyone can view topics"
  ON topics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create topics"
  ON topics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own topics"
  ON topics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can remove their votes"
  ON votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);