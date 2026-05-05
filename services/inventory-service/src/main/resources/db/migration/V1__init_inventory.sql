CREATE TABLE IF NOT EXISTS inventory.inventory_items
(
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(200)   NOT NULL,
    description  TEXT,
    category     VARCHAR(50)    NOT NULL,
    quantity     INTEGER        NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    unit         VARCHAR(50),
    min_quantity INTEGER,
    unit_price   NUMERIC(10, 2),
    expiry_date  DATE,
    supplier     VARCHAR(200),
    status       VARCHAR(30)    NOT NULL DEFAULT 'IN_STOCK',
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory.inventory_items (category);
CREATE INDEX IF NOT EXISTS idx_inventory_status   ON inventory.inventory_items (status);

COMMENT ON TABLE inventory.inventory_items IS 'Склад и инвентарь детского дома';
