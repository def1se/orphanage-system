-- Refactor inventory-service to match the new data model

-- 1. Refactor inventory_items to shelter_needs
ALTER TABLE inventory.inventory_items RENAME TO shelter_needs;
ALTER TABLE inventory.shelter_needs RENAME COLUMN name TO item_name;
ALTER TABLE inventory.shelter_needs RENAME COLUMN quantity TO quantity_current;
ALTER TABLE inventory.shelter_needs ADD COLUMN quantity_needed INTEGER;
ALTER TABLE inventory.shelter_needs ADD COLUMN priority VARCHAR(50);
ALTER TABLE inventory.shelter_needs RENAME COLUMN unit_price TO price;

-- 2. Create Donations table
CREATE TABLE inventory.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Link to user in staff/user-service
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Material Help table
CREATE TABLE inventory.material_help (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Link to user in staff/user-service
    need_id BIGINT NOT NULL REFERENCES inventory.shelter_needs(id),
    quantity INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
