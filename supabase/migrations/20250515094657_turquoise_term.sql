/*
  # Add initial AI topics for voting

  1. Changes
    - Insert 5 initial topics focused on AI best practices and culture change
    - Topics are designed to help Reforge achieve A+ AI-first capabilities
    - Each topic starts with 0 votes to maintain fairness

  2. Topics Added
    - RAG Implementation Best Practices
    - AI Prompt Engineering Framework
    - AI Security and Risk Management
    - AI-First Product Development
    - AI Team Collaboration Patterns
*/

-- Insert initial topics with a system user ID
INSERT INTO topics (title, description, user_id)
VALUES 
  (
    'RAG Implementation Best Practices',
    'Deep dive into implementing Retrieval Augmented Generation (RAG) effectively, including vector store selection, chunking strategies, and embedding best practices. Learn how to build more accurate and contextually aware AI applications.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'AI Prompt Engineering Framework',
    'Develop a systematic approach to prompt engineering across different AI models. Create reusable templates, establish quality metrics, and implement version control for prompts to ensure consistent high-quality outputs.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'AI Security and Risk Management',
    'Comprehensive guide to securing AI implementations, including prompt injection prevention, data privacy considerations, and establishing guardrails. Create a robust framework for assessing and mitigating AI-related risks.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'AI-First Product Development',
    'Transform product development by integrating AI from ideation to deployment. Learn patterns for identifying AI opportunities, measuring AI feature success, and creating feedback loops for continuous improvement.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'AI Team Collaboration Patterns',
    'Establish effective collaboration patterns between product, engineering, and AI teams. Define roles, responsibilities, and workflows that enable rapid iteration and knowledge sharing in AI-driven projects.',
    '00000000-0000-0000-0000-000000000000'
  );