CREATE TABLE IF NOT EXISTS inventory.suppliers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(200),
    address TEXT,
    rating INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO inventory.inventory_items (name, category, quantity, unit, min_quantity, status) VALUES
('Памперсы детские', 'HYGIENE', 150, 'шт', 200, 'IN_STOCK'),
('Молоко пастеризованное', 'FOOD', 20, 'л', 50, 'LOW_STOCK'),
('Тетради в клетку 12л', 'STATIONERY', 300, 'шт', 100, 'IN_STOCK'),
('Яблоки свежие', 'FOOD', 15, 'кг', 20, 'LOW_STOCK'),
('Мыло детское', 'HYGIENE', 45, 'шт', 30, 'IN_STOCK');

INSERT INTO inventory.suppliers (name, contact_person, phone) VALUES
('Оптовик Плюс', 'Антон Снабженец', '+79991234567'),
('Фермерские Продукты', 'Дядя Ваня', '+79997654321');
