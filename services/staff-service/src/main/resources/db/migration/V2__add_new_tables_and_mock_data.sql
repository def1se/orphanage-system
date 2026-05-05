CREATE TABLE IF NOT EXISTS staff.shift_schedules (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff.staff(id),
    shift_date DATE NOT NULL,
    shift_type VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff.volunteers (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(200),
    organization VARCHAR(200),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO staff.staff (first_name, last_name, position, hire_date, status) VALUES
('Мария', 'Иванова', 'Воспитатель', '2019-01-10', 'ACTIVE'),
('Елена', 'Петрова', 'Врач', '2020-03-15', 'ACTIVE'),
('Александр', 'Сидоров', 'Директор', '2015-08-01', 'ACTIVE');

INSERT INTO staff.volunteers (first_name, last_name, organization) VALUES
('Сергей', 'Волков', 'Доброе сердце'),
('Ольга', 'Зайцева', 'Помощь детям');
