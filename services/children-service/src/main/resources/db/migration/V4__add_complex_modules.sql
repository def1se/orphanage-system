-- V4: Adding Legal Status and Psychological Logs to complicate the system

CREATE TABLE IF NOT EXISTS children.legal_statuses (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children.children(id),
    parents_status VARCHAR(255) NOT NULL, -- e.g., DEPRIVED_OF_RIGHTS, DECEASED, UNKNOWN
    alimony_account VARCHAR(100),
    property_rights_notes TEXT,
    court_decisions TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children.psychologist_logs (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children.children(id),
    session_date DATE NOT NULL,
    specialist_name VARCHAR(150) NOT NULL,
    topic VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert mock data
INSERT INTO children.legal_statuses (child_id, parents_status, alimony_account, property_rights_notes, court_decisions) VALUES
(1, 'DEPRIVED_OF_RIGHTS', '40817810099910004312', 'Доля в квартире 1/2 (г. Москва, ул. Пушкина)', 'Решение суда №123 от 10.05.2021'),
(2, 'DECEASED', NULL, 'Наследственное дело открыто', 'Свидетельства о смерти родителей'),
(3, 'RESTRICTED_RIGHTS', '40817810099910004313', 'Нет имущества', 'Решение суда об ограничении от 15.08.2022');

INSERT INTO children.psychologist_logs (child_id, session_date, specialist_name, topic, notes) VALUES
(1, CURRENT_DATE - 5, 'Смирнова А.В.', 'Адаптация в коллективе', 'Ребенок стал более открытым, завел друзей.'),
(2, CURRENT_DATE - 2, 'Смирнова А.В.', 'Снижение тревожности', 'Проведена арт-терапия. Рекомендовано продолжить занятия.'),
(3, CURRENT_DATE - 10, 'Смирнова А.В.', 'Профориентация', 'Проявлен интерес к IT и техническим специальностям.');
