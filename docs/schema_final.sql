-- ============================================================
-- ORPHANAGE MANAGEMENT SYSTEM — Consolidated Data Model
-- ЦССВ «Светлый путь»
-- Version: FINAL (consolidated from all Flyway migrations)
-- Generated: 2026-05-14
-- ============================================================
-- Этот файл — итоговое описание ВСЕЙ схемы БД.
-- Используется как документация и для создания БД с нуля.
-- Реальные миграции Flyway находятся в services/*/db/migration/
-- ============================================================

-- ── Создание схем ──────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS staff;
CREATE SCHEMA IF NOT EXISTS children;
CREATE SCHEMA IF NOT EXISTS adoption;
CREATE SCHEMA IF NOT EXISTS inventory;

-- ============================================================
-- СХЕМА: staff — Пользователи, волонтёры, мероприятия, статьи
-- ============================================================

-- 1. USERS — все пользователи системы (auth через Keycloak)
CREATE TABLE IF NOT EXISTS staff.users (
    id            UUID         PRIMARY KEY,             -- Keycloak User ID (sub claim)
    username      VARCHAR(100) NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    phone         VARCHAR(20),
    password_hash VARCHAR(255),                         -- только для local dev
    avatar_url    VARCHAR(255),
    role          VARCHAR(20)  NOT NULL DEFAULT 'GUEST',-- GUEST|USER|VOLUNTEER|EMPLOYEE|ADMIN
    is_enabled    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE  staff.users         IS 'Все пользователи системы. Auth через Keycloak.';
COMMENT ON COLUMN staff.users.id      IS 'UUID из Keycloak (sub claim JWT)';
COMMENT ON COLUMN staff.users.role    IS 'GUEST | USER | VOLUNTEER | EMPLOYEE | ADMIN';

-- 2. VOLUNTEERS — данные о волонтёрах (FK → users)
CREATE TABLE IF NOT EXISTS staff.volunteers (
    id                BIGSERIAL    PRIMARY KEY,
    user_id           UUID         NOT NULL REFERENCES staff.users(id) ON DELETE CASCADE,
    status            VARCHAR(50)  NOT NULL DEFAULT 'PENDING', -- PENDING|ACTIVE|INACTIVE
    skills            TEXT,
    available_days    VARCHAR(100),
    experience        TEXT,
    registration_date TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON staff.volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_status  ON staff.volunteers(status);
COMMENT ON TABLE staff.volunteers IS 'Данные о волонтёрах. Связаны с users.';

-- 3. SHELTER_EVENTS — мероприятия детского дома
CREATE TABLE IF NOT EXISTS staff.shelter_events (
    id               BIGSERIAL    PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    event_date       DATE         NOT NULL,
    location         VARCHAR(255),
    max_participants INTEGER,
    image_url        VARCHAR(255),
    created_by       UUID         REFERENCES staff.users(id),
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE staff.shelter_events IS 'Мероприятия и события детского дома';

-- 4. EVENT_REGISTRATIONS — записи пользователей на мероприятия
CREATE TABLE IF NOT EXISTS staff.event_registrations (
    id            BIGSERIAL    PRIMARY KEY,
    event_id      BIGINT       NOT NULL REFERENCES staff.shelter_events(id) ON DELETE CASCADE,
    user_id       UUID         REFERENCES staff.users(id),
    name          VARCHAR(100),
    email         VARCHAR(255),
    phone         VARCHAR(20),
    notes         TEXT,
    registered_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_event_reg_event_id ON staff.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_user_id  ON staff.event_registrations(user_id);
COMMENT ON TABLE staff.event_registrations IS 'Регистрации пользователей на мероприятия';

-- 5. ARTICLES — полезные статьи и новости
CREATE TABLE IF NOT EXISTS staff.articles (
    id           BIGSERIAL    PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    content      TEXT         NOT NULL,
    summary      VARCHAR(500),
    image_url    VARCHAR(255),
    category     VARCHAR(50),                 -- NEWS|GUIDE|STORY|ANNOUNCEMENT
    author_id    UUID         REFERENCES staff.users(id),
    is_published BOOLEAN      NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_articles_category    ON staff.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON staff.articles(is_published);
COMMENT ON TABLE staff.articles IS 'Статьи, новости, объявления';

-- ============================================================
-- СХЕМА: children — Воспитанники и медкарты
-- ============================================================

-- 6. CHILDREN — данные о воспитанниках
CREATE TABLE IF NOT EXISTS children.children (
    id             BIGSERIAL    PRIMARY KEY,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    middle_name    VARCHAR(100),
    birth_date     DATE         NOT NULL,
    gender         VARCHAR(10)  NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    description    TEXT,
    image_url      VARCHAR(500),
    status         VARCHAR(30)  NOT NULL DEFAULT 'IN_SHELTER',
    -- IN_SHELTER | UNDER_GUARDIANSHIP | ADOPTED | RETURNED
    admission_date DATE         NOT NULL DEFAULT CURRENT_DATE,
    room_number    VARCHAR(20),
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_children_status    ON children.children(status);
CREATE INDEX IF NOT EXISTS idx_children_last_name ON children.children(last_name);
COMMENT ON TABLE  children.children        IS 'Реестр воспитанников детского дома';
COMMENT ON COLUMN children.children.status IS 'IN_SHELTER | UNDER_GUARDIANSHIP | ADOPTED | RETURNED';

-- 7. CHILD_MEDICAL_RECORDS — медицинские и социальные записи
CREATE TABLE IF NOT EXISTS children.child_medical_records (
    id          BIGSERIAL   PRIMARY KEY,
    child_id    BIGINT      NOT NULL REFERENCES children.children(id) ON DELETE CASCADE,
    record_date DATE        NOT NULL,
    record_type VARCHAR(50),                  -- MEDICAL|PSYCHOLOGICAL|SOCIAL
    description TEXT,
    created_by  UUID,                         -- staff.users.id (логическая связь между схемами)
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_med_records_child_id ON children.child_medical_records(child_id);
COMMENT ON TABLE children.child_medical_records IS 'Медицинские, психологические и социальные записи о детях';

-- ============================================================
-- СХЕМА: adoption — Заявки и истории
-- ============================================================

-- 8. ADOPTION_REQUESTS — заявки на устройство ребёнка в семью
CREATE TABLE IF NOT EXISTS adoption.adoption_requests (
    id                    BIGSERIAL    PRIMARY KEY,
    child_id              BIGINT       NOT NULL,        -- children.children.id (логич.)
    user_id               UUID,                         -- staff.users.id (логич.)
    request_type          VARCHAR(30)  NOT NULL DEFAULT 'ACQUAINTANCE',
    -- ACQUAINTANCE | GUARDIANSHIP | CUSTODY | ADOPTION
    message               TEXT,
    status                VARCHAR(30)  NOT NULL DEFAULT 'NEW',
    -- NEW | REVIEW | APPROVED | REJECTED | CLOSED
    admin_comment         TEXT,
    applicant_first_name  VARCHAR(100),
    applicant_last_name   VARCHAR(100),
    applicant_phone       VARCHAR(20),
    applicant_email       VARCHAR(200),
    submission_date       DATE         NOT NULL DEFAULT CURRENT_DATE,
    decision_date         DATE,
    created_at            TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_adoption_child_id ON adoption.adoption_requests(child_id);
CREATE INDEX IF NOT EXISTS idx_adoption_user_id  ON adoption.adoption_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_status   ON adoption.adoption_requests(status);
COMMENT ON TABLE  adoption.adoption_requests        IS 'Заявки на усыновление, опеку, попечительство';
COMMENT ON COLUMN adoption.adoption_requests.status IS 'NEW → REVIEW → APPROVED/REJECTED → CLOSED';

-- 9. HAPPY_STORIES — истории успешного устройства детей
CREATE TABLE IF NOT EXISTS adoption.happy_stories (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id     BIGINT       NOT NULL,        -- children.children.id (логич.)
    story_text   TEXT         NOT NULL,
    author_id    UUID         NOT NULL,        -- staff.users.id (логич.)
    published_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    is_anonymous BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE adoption.happy_stories IS 'Истории успешного устройства детей в семьи';

-- ============================================================
-- СХЕМА: inventory — Потребности, пожертвования, матпомощь
-- ============================================================

-- 10. SHELTER_NEEDS — текущие потребности детского дома
CREATE TABLE IF NOT EXISTS inventory.shelter_needs (
    id               BIGSERIAL      PRIMARY KEY,
    category         VARCHAR(50)    NOT NULL,   -- CLOTHING|EDUCATION|HOUSEHOLD|HEALTH|FOOD
    item_name        VARCHAR(200)   NOT NULL,
    quantity_needed  INTEGER        NOT NULL DEFAULT 0,
    quantity_current INTEGER        NOT NULL DEFAULT 0,
    priority         VARCHAR(50)    NOT NULL DEFAULT 'MEDIUM', -- HIGH|MEDIUM|LOW
    price            NUMERIC(10,2),
    description      TEXT,
    status           VARCHAR(30)    NOT NULL DEFAULT 'ACTIVE',
    created_at       TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP      NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_needs_category ON inventory.shelter_needs(category);
CREATE INDEX IF NOT EXISTS idx_needs_priority ON inventory.shelter_needs(priority);
COMMENT ON TABLE inventory.shelter_needs IS 'Текущие потребности детского дома';

-- 11. DONATIONS — финансовые пожертвования
CREATE TABLE IF NOT EXISTS inventory.donations (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID,                       -- staff.users.id (логич.)
    amount         DECIMAL(10,2)  NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50)    NOT NULL DEFAULT 'CARD', -- CARD|SBP|TRANSFER
    transaction_id VARCHAR(100),
    status         VARCHAR(50)    NOT NULL DEFAULT 'PENDING', -- PENDING|COMPLETED|FAILED
    created_at     TIMESTAMP      NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON inventory.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status  ON inventory.donations(status);
COMMENT ON TABLE inventory.donations IS 'Финансовые пожертвования';

-- 12. MATERIAL_HELP — материальная помощь (вещи)
CREATE TABLE IF NOT EXISTS inventory.material_help (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID,                    -- staff.users.id (логич.)
    need_id    BIGINT      NOT NULL REFERENCES inventory.shelter_needs(id),
    quantity   INTEGER     NOT NULL CHECK (quantity > 0),
    status     VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING|DELIVERED|CANCELLED
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_material_help_user_id ON inventory.material_help(user_id);
CREATE INDEX IF NOT EXISTS idx_material_help_need_id ON inventory.material_help(need_id);
COMMENT ON TABLE inventory.material_help IS 'Заявки на материальную помощь (вещи)';

-- ============================================================
-- ИТОГОВАЯ ТАБЛИЦА СУЩНОСТЕЙ
-- ============================================================
-- Схема   │ Таблица                │ Записей │ Описание
-- --------│------------------------│---------│---------------------------
-- staff   │ users                  │ ~10-50  │ Все пользователи (Keycloak)
-- staff   │ volunteers             │ ~5-20   │ Волонтёры
-- staff   │ shelter_events         │ ~10-50  │ Мероприятия
-- staff   │ event_registrations    │ ~50-200 │ Записи на мероприятия
-- staff   │ articles               │ ~5-30   │ Статьи и новости
-- children│ children               │ ~20-100 │ Воспитанники
-- children│ child_medical_records  │ ~50-500 │ Медкарты
-- adoption│ adoption_requests      │ ~10-50  │ Заявки
-- adoption│ happy_stories          │ ~5-20   │ Истории успеха
-- inventory│ shelter_needs         │ ~10-30  │ Потребности
-- inventory│ donations             │ ~5-100  │ Пожертвования
-- inventory│ material_help         │ ~5-50   │ Матпомощь
-- ============================================================
