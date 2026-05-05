-- Инициализация схем PostgreSQL для каждого микросервиса
-- Запускается автоматически при первом старте контейнера

CREATE SCHEMA IF NOT EXISTS children;
CREATE SCHEMA IF NOT EXISTS staff;
CREATE SCHEMA IF NOT EXISTS adoption;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS notification;

-- Права на схемы
GRANT ALL PRIVILEGES ON SCHEMA children    TO orphanage_user;
GRANT ALL PRIVILEGES ON SCHEMA staff       TO orphanage_user;
GRANT ALL PRIVILEGES ON SCHEMA adoption    TO orphanage_user;
GRANT ALL PRIVILEGES ON SCHEMA inventory   TO orphanage_user;
GRANT ALL PRIVILEGES ON SCHEMA notification TO orphanage_user;
