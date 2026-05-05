-- V4: Adding Procurement Requests and Nutrition Norms

CREATE TABLE IF NOT EXISTS inventory.procurement_requests (
    id BIGSERIAL PRIMARY KEY,
    requester_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(50) NOT NULL,
    item_description TEXT NOT NULL,
    requested_quantity INTEGER NOT NULL,
    estimated_budget NUMERIC(10, 2),
    justification TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL', -- PENDING_APPROVAL, APPROVED, ORDERED, DELIVERED, REJECTED
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory.nutrition_norms (
    id BIGSERIAL PRIMARY KEY,
    age_group VARCHAR(100) NOT NULL, -- e.g., '1-3 years', '4-7 years', '8-12 years', '13-18 years'
    calories_per_day INTEGER NOT NULL,
    protein_grams NUMERIC(5, 2) NOT NULL,
    fat_grams NUMERIC(5, 2) NOT NULL,
    carbs_grams NUMERIC(5, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO inventory.procurement_requests (requester_name, item_category, item_description, requested_quantity, estimated_budget, justification, status) VALUES
('Завхоз Петрович', 'FURNITURE', 'Новые матрасы для старшей группы', 15, 50000.00, 'Старые матрасы пришли в негодность (износ 80%)', 'APPROVED'),
('Медсестра Кузнецова', 'MEDICINE', 'Сезонные витамины', 100, 15000.00, 'Подготовка к осенне-зимнему периоду', 'PENDING_APPROVAL'),
('Директор', 'EDUCATIONAL', 'Интерактивная доска в учебный класс', 1, 120000.00, 'Для проведения обучающих занятий', 'ORDERED');

INSERT INTO inventory.nutrition_norms (age_group, calories_per_day, protein_grams, fat_grams, carbs_grams) VALUES
('1-3 years', 1200, 53.0, 53.0, 170.0),
('4-7 years', 1800, 68.0, 68.0, 260.0),
('8-12 years', 2350, 90.0, 90.0, 320.0),
('13-18 years (Boys)', 2900, 110.0, 110.0, 400.0),
('13-18 years (Girls)', 2600, 95.0, 95.0, 360.0);
