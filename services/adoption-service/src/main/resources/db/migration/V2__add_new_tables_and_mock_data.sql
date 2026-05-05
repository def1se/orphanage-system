CREATE TABLE IF NOT EXISTS adoption.sponsors (
    id BIGSERIAL PRIMARY KEY,
    organization_name VARCHAR(200),
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(200),
    donation_amount NUMERIC(10, 2),
    sponsorship_type VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO adoption.adoption_requests (child_id, applicant_first_name, applicant_last_name, request_type, status, submission_date) VALUES
(1, 'Алексей', 'Морозов', 'ADOPTION', 'UNDER_REVIEW', '2024-03-01'),
(3, 'Светлана', 'Новикова', 'GUARDIANSHIP', 'APPROVED', '2023-11-20');

INSERT INTO adoption.sponsors (organization_name, contact_person, donation_amount, sponsorship_type) VALUES
('ООО Ромашка', 'Иван Меценатов', 500000.00, 'FINANCIAL'),
(NULL, 'Петр Добряков', 15000.00, 'MATERIAL');
