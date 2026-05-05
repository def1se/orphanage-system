-- Refactor staff-service to match the new data model

-- 1. Create Users table
CREATE TABLE staff.users (
    id UUID PRIMARY KEY, -- Keycloak User ID
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255), -- Keep it for local dev if needed, though Keycloak is primary
    avatar_url VARCHAR(255),
    role VARCHAR(20) DEFAULT 'GUEST',
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Refactor Volunteers table
-- Drop old first_name, last_name, phone_number as they are now in Users
-- In a real migration we would migrate data, but here we'll just adjust schema.
ALTER TABLE staff.volunteers DROP COLUMN first_name;
ALTER TABLE staff.volunteers DROP COLUMN last_name;
ALTER TABLE staff.volunteers DROP COLUMN phone_number;
ALTER TABLE staff.volunteers RENAME COLUMN join_date TO registration_date;
ALTER TABLE staff.volunteers ADD COLUMN user_id UUID NOT NULL REFERENCES staff.users(id);
ALTER TABLE staff.volunteers ADD COLUMN status VARCHAR(50);
ALTER TABLE staff.volunteers ADD COLUMN available_days VARCHAR(100);
ALTER TABLE staff.volunteers ADD COLUMN experience TEXT;

-- 3. Refactor Events table
ALTER TABLE staff.events RENAME TO shelter_events;
ALTER TABLE staff.shelter_events ADD COLUMN description TEXT;
ALTER TABLE staff.shelter_events ADD COLUMN location VARCHAR(255);
ALTER TABLE staff.shelter_events ADD COLUMN max_participants INTEGER;
ALTER TABLE staff.shelter_events ADD COLUMN image_url VARCHAR(255);
ALTER TABLE staff.shelter_events ADD COLUMN created_by UUID REFERENCES staff.users(id);

-- 4. Refactor Event Registrations table
-- Assuming it exists from V5
ALTER TABLE staff.event_registrations ADD COLUMN name VARCHAR(100);
ALTER TABLE staff.event_registrations ADD COLUMN email VARCHAR(255);
ALTER TABLE staff.event_registrations ADD COLUMN phone VARCHAR(20);
ALTER TABLE staff.event_registrations ADD COLUMN notes TEXT;
ALTER TABLE staff.event_registrations RENAME COLUMN registration_date TO registered_at;
ALTER TABLE staff.event_registrations ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
