CREATE TABLE IF NOT EXISTS adoption.adoption_requests
(
    id                       BIGSERIAL PRIMARY KEY,
    child_id                 BIGINT       NOT NULL,
    applicant_first_name     VARCHAR(100) NOT NULL,
    applicant_last_name      VARCHAR(100) NOT NULL,
    applicant_middle_name    VARCHAR(100),
    applicant_phone          VARCHAR(20),
    applicant_email          VARCHAR(200),
    request_type             VARCHAR(30)  NOT NULL,
    status                   VARCHAR(30)  NOT NULL DEFAULT 'SUBMITTED',
    submission_date          DATE         NOT NULL,
    decision_date            DATE,
    notes                    TEXT,
    curator_staff_id         BIGINT,
    created_at               TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_adoption_child_id ON adoption.adoption_requests (child_id);
CREATE INDEX IF NOT EXISTS idx_adoption_status   ON adoption.adoption_requests (status);
CREATE INDEX IF NOT EXISTS idx_adoption_email    ON adoption.adoption_requests (applicant_email);

COMMENT ON TABLE adoption.adoption_requests IS 'Заявки на усыновление / опеку';
