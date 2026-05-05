CREATE TABLE IF NOT EXISTS children.medical_records (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children.children(id),
    doctor_name VARCHAR(100) NOT NULL,
    diagnosis VARCHAR(200),
    treatment_plan TEXT,
    visit_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children.education_records (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children.children(id),
    school_name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(50),
    performance_notes TEXT,
    record_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Mock data
INSERT INTO children.children (first_name, last_name, middle_name, date_of_birth, gender, status, admission_date, room_number) VALUES
('Иван', 'Иванов', 'Иванович', '2015-05-12', 'MALE', 'ACTIVE', '2020-09-01', '101'),
('Анна', 'Смирнова', 'Петровна', '2016-08-22', 'FEMALE', 'ACTIVE', '2021-01-15', '102'),
('Дмитрий', 'Соколов', 'Александрович', '2018-11-05', 'MALE', 'ACTIVE', '2023-03-10', '103'),
('Екатерина', 'Попова', 'Андреевна', '2017-02-14', 'FEMALE', 'ACTIVE', '2022-06-20', '104'),
('Максим', 'Лебедев', 'Сергеевич', '2019-07-30', 'MALE', 'ACTIVE', '2024-01-05', '105');

INSERT INTO children.medical_records (child_id, doctor_name, diagnosis, visit_date) VALUES
(1, 'Доктор Быков', 'Здоров', '2023-12-01'),
(2, 'Доктор Айболит', 'ОРВИ', '2024-02-15');

INSERT INTO children.education_records (child_id, school_name, grade_level, record_date) VALUES
(1, 'Школа №1', '3 класс', '2023-09-01'),
(2, 'Школа №1', '2 класс', '2023-09-01');
