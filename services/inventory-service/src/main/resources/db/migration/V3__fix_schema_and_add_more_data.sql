ALTER TABLE inventory.suppliers RENAME COLUMN phone TO phone_number;
ALTER TABLE inventory.suppliers DROP COLUMN email;

-- Fix ItemCategory mismatches
UPDATE inventory.inventory_items SET category = 'EDUCATIONAL' WHERE category = 'STATIONERY';
UPDATE inventory.inventory_items SET category = 'FOOD' WHERE category = 'GROCERIES';
UPDATE inventory.inventory_items SET category = 'MEDICINE' WHERE category = 'MEDICAL';

-- Insert lots of logical data
INSERT INTO inventory.inventory_items (name, category, quantity, unit, min_quantity, status, unit_price, supplier) VALUES
('Стул деревянный детский', 'FURNITURE', 45, 'шт', 50, 'LOW_STOCK', 1200.00, 'МебельОпт'),
('Стол обеденный', 'FURNITURE', 10, 'шт', 10, 'IN_STOCK', 4500.00, 'МебельОпт'),
('Кровать односпальная', 'FURNITURE', 30, 'шт', 30, 'IN_STOCK', 6000.00, 'МебельОпт'),
('Матрас ортопедический', 'FURNITURE', 30, 'шт', 30, 'IN_STOCK', 3500.00, 'СонСтрой'),
('Постельное белье (комплект)', 'CLOTHING', 60, 'шт', 100, 'LOW_STOCK', 800.00, 'ТекстильТрейд'),
('Полотенце махровое', 'HYGIENE', 120, 'шт', 100, 'IN_STOCK', 300.00, 'ТекстильТрейд'),
('Мыло детское', 'HYGIENE', 15, 'шт', 50, 'OUT_OF_STOCK', 45.00, 'ЧистыйМир'),
('Зубная паста детская', 'HYGIENE', 20, 'шт', 40, 'LOW_STOCK', 120.00, 'ЧистыйМир'),
('Шампунь без слез', 'HYGIENE', 18, 'шт', 30, 'LOW_STOCK', 180.00, 'ЧистыйМир'),
('Мяч футбольный', 'SPORTS', 5, 'шт', 10, 'LOW_STOCK', 1500.00, 'СпортМастер'),
('Мяч волейбольный', 'SPORTS', 4, 'шт', 10, 'LOW_STOCK', 1200.00, 'СпортМастер'),
('Настольная игра "Монополия"', 'EDUCATIONAL', 2, 'шт', 5, 'LOW_STOCK', 2000.00, 'ИгроЛенд'),
('Конструктор Lego', 'EDUCATIONAL', 10, 'шт', 15, 'LOW_STOCK', 3500.00, 'ИгроЛенд'),
('Парацетамол', 'MEDICINE', 50, 'упак', 20, 'IN_STOCK', 80.00, 'ФармаТрейд'),
('Бинт стерильный', 'MEDICINE', 100, 'шт', 50, 'IN_STOCK', 25.00, 'ФармаТрейд'),
('Зеленка', 'MEDICINE', 30, 'шт', 20, 'IN_STOCK', 30.00, 'ФармаТрейд'),
('Макароны', 'FOOD', 80, 'кг', 100, 'LOW_STOCK', 60.00, 'ПродуктОпт'),
('Гречка', 'FOOD', 45, 'кг', 50, 'LOW_STOCK', 80.00, 'ПродуктОпт'),
('Рис', 'FOOD', 60, 'кг', 50, 'IN_STOCK', 90.00, 'ПродуктОпт'),
('Молоко', 'FOOD', 20, 'л', 30, 'LOW_STOCK', 75.00, 'ФермаДар'),
('Яблоки', 'FOOD', 15, 'кг', 40, 'OUT_OF_STOCK', 120.00, 'ФермаДар');

INSERT INTO inventory.suppliers (name, contact_person, phone_number, address) VALUES
('МебельОпт', 'Иван Сергеев', '+7 (999) 111-22-33', 'г. Москва, ул. Ленина, 10'),
('СонСтрой', 'Анна Смирнова', '+7 (999) 222-33-44', 'г. Москва, ул. Мира, 15'),
('ТекстильТрейд', 'Елена Попова', '+7 (999) 333-44-55', 'г. Иваново, ул. Ткачей, 1'),
('ЧистыйМир', 'Дмитрий Волков', '+7 (999) 444-55-66', 'г. Казань, ул. Химиков, 5'),
('СпортМастер', 'Алексей Морозов', '+7 (999) 555-66-77', 'г. Москва, пр. Спорта, 8'),
('ИгроЛенд', 'Светлана Соколова', '+7 (999) 666-77-88', 'г. Санкт-Петербург, ул. Игровая, 2'),
('ФармаТрейд', 'Михаил Новиков', '+7 (999) 777-88-99', 'г. Москва, ул. Аптечная, 12'),
('ПродуктОпт', 'Ольга Лебедева', '+7 (999) 888-99-00', 'г. Краснодар, ул. Агрономная, 4'),
('ФермаДар', 'Сергей Козлов', '+7 (999) 999-00-11', 'Московская обл., дер. Коровкино');
