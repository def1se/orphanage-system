-- Staff Service V3: Fix schema and mock data to match entities
-- Table shift_schedules must match ShiftSchedule.java

-- Recreate shift_schedules to match entity
DROP TABLE IF EXISTS staff.shift_schedules;
CREATE TABLE staff.shift_schedules (
    id BIGSERIAL PRIMARY KEY,
    staff_member_id BIGINT NOT NULL REFERENCES staff.staff(id),
    shift_start TIMESTAMP NOT NULL,
    shift_end TIMESTAMP NOT NULL,
    role_during_shift VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Update volunteers table
ALTER TABLE staff.volunteers RENAME COLUMN phone TO phone_number;
ALTER TABLE staff.volunteers ADD COLUMN skills TEXT;
ALTER TABLE staff.volunteers ADD COLUMN join_date DATE DEFAULT CURRENT_DATE;

-- Update staff positions to match Enums
UPDATE staff.staff SET position = 'EDUCATOR' WHERE position = 'Воспитатель';
UPDATE staff.staff SET position = 'DOCTOR' WHERE position = 'Врач';
UPDATE staff.staff SET position = 'DIRECTOR' WHERE position = 'Директор';

-- Add more staff
INSERT INTO staff.staff (first_name, last_name, middle_name, position, phone, email, hire_date, status) VALUES
('Светлана', 'Кузнецова', 'Ивановна', 'NURSE', '+7 (900) 123-45-67', 'nurse1@example.com', '2021-05-12', 'ACTIVE'),
('Антон', 'Смирнов', 'Павлович', 'PSYCHOLOGIST', '+7 (900) 234-56-78', 'psychologist1@example.com', '2022-09-01', 'ACTIVE'),
('Татьяна', 'Попова', 'Сергеевна', 'SOCIAL_WORKER', '+7 (900) 345-67-89', 'social1@example.com', '2020-11-20', 'ACTIVE'),
('Игорь', 'Волков', 'Дмитриевич', 'SECURITY', '+7 (900) 456-78-90', 'security1@example.com', '2018-03-15', 'ACTIVE'),
('Надежда', 'Морозова', 'Алексеевна', 'COOK', '+7 (900) 567-89-01', 'cook1@example.com', '2019-07-10', 'ACTIVE'),
('Екатерина', 'Лебедева', 'Михайловна', 'CLEANER', '+7 (900) 678-90-12', 'cleaner1@example.com', '2023-01-15', 'ACTIVE'),
('Дмитрий', 'Новиков', 'Александрович', 'EDUCATOR', '+7 (900) 789-01-23', 'educator2@example.com', '2022-02-28', 'ACTIVE');

-- Add more volunteers
INSERT INTO staff.volunteers (first_name, last_name, phone_number, skills, join_date) VALUES
('Алина', 'Козлова', '+7 (911) 111-22-33', 'Организация праздников, аниматор', '2023-12-01'),
('Роман', 'Макаров', '+7 (911) 222-33-44', 'Ремонт компьютеров, обучение информатике', '2024-01-15'),
('Юлия', 'Зайцева', '+7 (911) 333-44-55', 'Репетитор по английскому языку', '2023-09-10'),
('Павел', 'Степанов', '+7 (911) 444-55-66', 'Спортивный тренер (футбол, баскетбол)', '2024-03-20');

-- Add shift schedules (using correct column names)
INSERT INTO staff.shift_schedules (staff_member_id, shift_start, shift_end, role_during_shift) VALUES
(1, CURRENT_DATE + TIME '08:00:00', CURRENT_DATE + TIME '16:00:00', 'Дежурный воспитатель'),
(2, CURRENT_DATE + TIME '09:00:00', CURRENT_DATE + TIME '17:00:00', 'Прием врача'),
(4, CURRENT_DATE + TIME '08:00:00', CURRENT_DATE + TIME '20:00:00', 'Дежурная медсестра'),
(3, CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00', CURRENT_DATE + INTERVAL '1 day' + TIME '16:00:00', 'Замена воспитателя');
