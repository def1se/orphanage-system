-- Flyway V1: Создание таблицы children в схеме children
CREATE TABLE IF NOT EXISTS children.children
(
    id                       BIGSERIAL PRIMARY KEY,
    first_name               VARCHAR(100)  NOT NULL,
    last_name                VARCHAR(100)  NOT NULL,
    middle_name              VARCHAR(100),
    date_of_birth            DATE          NOT NULL,
    gender                   VARCHAR(10)   NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    status                   VARCHAR(30)   NOT NULL DEFAULT 'ACTIVE',
    admission_date           DATE          NOT NULL,
    room_number              VARCHAR(20),
    health_notes             TEXT,
    education_notes          TEXT,
    photo_url                VARCHAR(500),
    responsible_educator_id  BIGINT,
    created_at               TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_children_status  ON children.children (status);
CREATE INDEX IF NOT EXISTS idx_children_last_name ON children.children (last_name);
CREATE INDEX IF NOT EXISTS idx_children_educator  ON children.children (responsible_educator_id);

COMMENT ON TABLE children.children IS 'Реестр детей детского дома';
COMMENT ON COLUMN children.children.status IS 'ACTIVE | UNDER_GUARDIANSHIP | ADOPTED | GRADUATED | TRANSFERRED';
