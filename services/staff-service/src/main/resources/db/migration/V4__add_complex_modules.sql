-- V4: Adding Staff Certifications and detailed Shift Logs

CREATE TABLE IF NOT EXISTS staff.certifications (
    id BIGSERIAL PRIMARY KEY,
    staff_member_id BIGINT NOT NULL REFERENCES staff.staff(id),
    certification_name VARCHAR(255) NOT NULL,
    issued_by VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff.shift_logs (
    id BIGSERIAL PRIMARY KEY,
    shift_schedule_id BIGINT NOT NULL REFERENCES staff.shift_schedules(id),
    incident_report TEXT,
    handover_notes TEXT,
    log_time TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO staff.certifications (staff_member_id, certification_name, issued_by, issue_date, expiry_date) VALUES
(1, 'Сертификат воспитателя I категории', 'Министерство Просвещения РФ', '2023-05-10', '2028-05-10'),
(2, 'Сертификат медицинского работника (педиатрия)', 'Минздрав РФ', '2022-11-20', '2027-11-20'),
(3, 'Повышение квалификации: Психология травмы', 'МГППУ', '2024-01-15', '2029-01-15');

INSERT INTO staff.shift_logs (shift_schedule_id, incident_report, handover_notes) VALUES
(1, 'Без происшествий', 'Дети уложены спать вовремя. Температура в комнатах в норме.'),
(2, 'Ребенок (ИД 3) жаловался на боль в животе', 'Передано дежурному врачу, выдано лекарство.');
