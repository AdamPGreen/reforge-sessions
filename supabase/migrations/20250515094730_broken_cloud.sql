/*
  # Add system user and initial topics

  1. Changes
    - Create a system user for seeding data
    - Add initial AI topics linked to the system user
  
  2. Topics Added
    - RAG Implementation Best Practices
    - AI Prompt Engineering Framework
    - AI Security and Risk Management
    - AI-First Product Development
    - AI Team Collaboration Patterns
*/

-- Remove system user and topic insertions
-- DO $$
-- DECLARE
--   system_user_id uuid;
-- BEGIN
--   INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
--   VALUES
--     ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'system@reforge.com', 'system', NOW(), NOW(), NOW())
--   RETURNING id INTO system_user_id;
-- 
--   -- Insert initial topics with the system user ID
--   INSERT INTO topics (title, description, user_id)
--   VALUES 
--     (
--       'RAG Implementation Best Practices',
--       'Deep dive into implementing Retrieval Augmented Generation (RAG) effectively, including vector store selection, chunking strategies, and embedding best practices. Learn how to build more accurate and contextually aware AI applications.',
--       system_user_id
--     ),
--     (
--       'AI Prompt Engineering Framework',
--       'Develop a systematic approach to prompt engineering across different AI models. Create reusable templates, establish quality metrics, and implement version control for prompts to ensure consistent high-quality outputs.',
--       system_user_id
--     ),
--     (
--       'AI Security and Risk Management',
--       'Comprehensive guide to securing AI implementations, including prompt injection prevention, data privacy considerations, and establishing guardrails. Create a robust framework for assessing and mitigating AI-related risks.',
--       system_user_id
--     ),
--     (
--       'AI-First Product Development',
--       'Transform product development by integrating AI from ideation to deployment. Learn patterns for identifying AI opportunities, measuring AI feature success, and creating feedback loops for continuous improvement.',
--       system_user_id
--     ),
--     (
--       'AI Team Collaboration Patterns',
--       'Establish effective collaboration patterns between product, engineering, and AI teams. Define roles, responsibilities, and workflows that enable rapid iteration and knowledge sharing in AI-driven projects.',
--       system_user_id
--     );
-- END $$;