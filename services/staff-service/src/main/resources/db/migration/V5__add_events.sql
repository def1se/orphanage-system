CREATE TABLE staff.events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    type VARCHAR(100) NOT NULL,
    open_for_volunteers BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff.event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES staff.events(id),
    volunteer_name VARCHAR(255) NOT NULL,
    volunteer_email VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO staff.events (title, event_date, type, open_for_volunteers) VALUES 
('Новогодний утренник', '2026-12-25', 'Праздник', true),
('Мастер-класс по программированию', '2026-06-10', 'Обучение', true),
('Поездка в зоопарк', '2026-07-15', 'Экскурсия', false);
