-- V4: Adding complex Adoption Pipeline tracking

CREATE TABLE IF NOT EXISTS adoption.candidate_pipeline (
    id BIGSERIAL PRIMARY KEY,
    sponsor_id BIGINT REFERENCES adoption.sponsors(id), -- using sponsor table as a base for applicants/sponsors
    applicant_name VARCHAR(255) NOT NULL,
    background_check_passed BOOLEAN DEFAULT FALSE,
    school_of_foster_parents_completed BOOLEAN DEFAULT FALSE,
    psychological_readiness_score INTEGER CHECK (psychological_readiness_score >= 0 AND psychological_readiness_score <= 100),
    living_conditions_approved BOOLEAN DEFAULT FALSE,
    current_stage VARCHAR(100) NOT NULL DEFAULT 'INITIAL_INTERVIEW',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS adoption.post_adoption_visits (
    id BIGSERIAL PRIMARY KEY,
    adoption_request_id BIGINT NOT NULL REFERENCES adoption.adoption_requests(id),
    visit_date DATE NOT NULL,
    social_worker_name VARCHAR(255) NOT NULL,
    living_conditions_rating INTEGER CHECK (living_conditions_rating BETWEEN 1 AND 5),
    child_wellbeing_rating INTEGER CHECK (child_wellbeing_rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO adoption.candidate_pipeline (applicant_name, background_check_passed, school_of_foster_parents_completed, psychological_readiness_score, living_conditions_approved, current_stage) VALUES
('Смирнов Сергей Ивановч', TRUE, TRUE, 85, TRUE, 'READY_FOR_MATCHING'),
('Козлова Анна Сергеевна', TRUE, FALSE, 60, FALSE, 'SCHOOL_OF_FOSTER_PARENTS'),
('Иванов Петр Алексеевич', FALSE, FALSE, NULL, FALSE, 'BACKGROUND_CHECK_PENDING');

-- Insert a post-adoption visit for the COMPLETED request (id=3 from V3)
INSERT INTO adoption.post_adoption_visits (adoption_request_id, visit_date, social_worker_name, living_conditions_rating, child_wellbeing_rating, comments) VALUES
(3, CURRENT_DATE - 15, 'Попова Т.С.', 5, 5, 'Ребенок отлично адаптировался в новой семье. Условия проживания прекрасные.');
