ALTER TABLE adoption.sponsors RENAME COLUMN organization_name TO name;
ALTER TABLE adoption.sponsors RENAME COLUMN phone TO phone_number;
ALTER TABLE adoption.sponsors ADD COLUMN company VARCHAR(255);
ALTER TABLE adoption.sponsors DROP COLUMN contact_person;
ALTER TABLE adoption.sponsors DROP COLUMN donation_amount;
ALTER TABLE adoption.sponsors DROP COLUMN sponsorship_type;

-- Also let's update adoption type enum to match if needed: 'ADOPTION', 'GUARDIANSHIP', 'FOSTER_CARE'
-- Wait, in V2 I used 'ADOPTION' and 'GUARDIANSHIP', which are valid!
-- AdoptionStatus: 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED', 'WITHDRAWN'
-- In V2 I used 'UNDER_REVIEW' and 'APPROVED', which are valid!

-- Let's add more sponsors and adoptions
INSERT INTO adoption.sponsors (name, email, phone_number, company) VALUES
('Благотворительный фонд "Детство"', 'info@detstvo-fund.ru', '+7 (495) 123-45-67', 'Фонд "Детство"'),
('ООО "ТехноГрупп"', 'hr@technogroup.ru', '+7 (495) 987-65-43', 'ТехноГрупп'),
('ИП Смирнов А.В.', 'smirnov@mail.ru', '+7 (916) 111-22-33', 'ИП Смирнов'),
('АО "СтройИнвест"', 'charity@stroyinvest.ru', '+7 (495) 222-33-44', 'СтройИнвест');

INSERT INTO adoption.adoption_requests (child_id, applicant_first_name, applicant_last_name, applicant_phone, applicant_email, request_type, status, submission_date, notes) VALUES
(3, 'Сергей', 'Волков', '+7 (926) 333-44-55', 'volkov@gmail.com', 'FOSTER_CARE', 'SUBMITTED', CURRENT_DATE, 'Запрос на патронатное воспитание на выходные'),
(4, 'Елена', 'Морозова', '+7 (903) 444-55-66', 'morozova@yandex.ru', 'ADOPTION', 'REJECTED', CURRENT_DATE, 'Отказ по результатам комиссии'),
(5, 'Михаил', 'Попов', '+7 (916) 555-66-77', 'popov@mail.ru', 'GUARDIANSHIP', 'COMPLETED', CURRENT_DATE, 'Ребенок передан опекунам'),
(1, 'Анна', 'Лебедева', '+7 (905) 666-77-88', 'lebedeva@gmail.com', 'ADOPTION', 'UNDER_REVIEW', CURRENT_DATE, 'Ожидание медицинских справок');
