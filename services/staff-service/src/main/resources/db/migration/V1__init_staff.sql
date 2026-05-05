CREATE TABLE IF NOT EXISTS staff.staff
(
    id                BIGSERIAL PRIMARY KEY,
    first_name        VARCHAR(100) NOT NULL,
    last_name         VARCHAR(100) NOT NULL,
    middle_name       VARCHAR(100),
    position          VARCHAR(50)  NOT NULL,
    phone             VARCHAR(20),
    email             VARCHAR(200),
    hire_date         DATE         NOT NULL,
    keycloak_user_id  VARCHAR(100),
    notes             TEXT,
    status            VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_position ON staff.staff (position);
CREATE INDEX IF NOT EXISTS idx_staff_status   ON staff.staff (status);

COMMENT ON TABLE staff.staff IS 'Реестр сотрудников детского дома';
