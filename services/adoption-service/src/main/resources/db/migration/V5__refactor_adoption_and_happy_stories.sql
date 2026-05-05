-- Refactor adoption-service to match the new data model

-- 1. Refactor adoption_requests
ALTER TABLE adoption.adoption_requests ADD COLUMN user_id UUID; -- Link to applicant in staff/user-service
ALTER TABLE adoption.adoption_requests RENAME COLUMN notes TO message;
ALTER TABLE adoption.adoption_requests ADD COLUMN admin_comment TEXT;

-- We'll keep applicant info for now, but in future it can be fetched from user_id
-- Drop curator_staff_id if not in the model, but it's useful so I'll keep it as admin_id link.

-- 2. Create Happy Stories table
CREATE TABLE adoption.happy_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id BIGINT NOT NULL, -- Link to child in children-service
    story_text TEXT NOT NULL,
    author_id UUID NOT NULL, -- Link to user in staff/user-service
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
