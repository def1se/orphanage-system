# 🏠 Информационная система детского дома

Дипломный проект — полноценная микросервисная ИС на **Java 17 + Spring Boot 3.2 + PostgreSQL**.

## Архитектура

```
Frontend (React + Vite)
        ↓  HTTP (JWT Bearer)
  API Gateway :8080   ←→  Eureka :8761
        ↓  lb://
  ┌─────────────────────────────────┐
  │ children-service   :8081        │
  │ staff-service      :8082        │
  │ adoption-service   :8083 ──────►│ RabbitMQ → notification-service :8085
  │ inventory-service  :8084        │
  └─────────────────────────────────┘
        ↓
   PostgreSQL :5432 (схемы: children, staff, adoption, inventory, notification)
   Keycloak   :8180 (realm: orphanage)
   RabbitMQ   :5672 / UI :15672
```

## Быстрый старт

### 1. Инфраструктура (Docker)
```bash
# Запустить PostgreSQL, Keycloak и RabbitMQ
docker-compose up -d postgres keycloak rabbitmq

# Подождать готовности (~30 сек), затем запустить все сервисы
docker-compose up -d
```

### 2. Запуск бэкенда локально (без Docker)
```bash
# Из корня проекта
mvn clean install -DskipTests

# Запускать в таком порядке:
# 1. eureka-server
# 2. api-gateway
# 3. children-service, staff-service, adoption-service, inventory-service, notification-service
```

### 3. Запуск фронтенда
```bash
cd frontend
npm install
npm run dev
# Открыть http://localhost:5173
```

## Доступы после старта

| Сервис         | URL                          | Логин/Пароль        |
|----------------|------------------------------|---------------------|
| Фронтенд       | http://localhost:5173        | Через Keycloak      |
| API Gateway    | http://localhost:8080        | —                   |
| Eureka         | http://localhost:8761        | —                   |
| Keycloak Admin | http://localhost:8180        | admin / admin       |
| RabbitMQ UI    | http://localhost:15672       | rabbit / rabbit_secret |

## Тестовые пользователи (Keycloak, realm: orphanage)

| Пользователь | Пароль       | Роль                |
|-------------|--------------|---------------------|
| admin       | admin123     | ROLE_ADMIN          |
| director    | director123  | ROLE_DIRECTOR       |
| educator1   | educator123  | ROLE_EDUCATOR       |

## Стек

| Слой        | Технология                              |
|-------------|------------------------------------------|
| Язык        | Java 17                                  |
| Фреймворк   | Spring Boot 3.2.5, Spring Cloud 2023.0.1 |
| Auth        | Keycloak 23 (OIDC/JWT)                   |
| Async       | RabbitMQ 3.13 (AMQP)                     |
| Sync        | OpenFeign                                |
| БД          | PostgreSQL 16 (схемы per-service)        |
| Миграции    | Flyway                                   |
| Маппинг     | MapStruct                                |
| Фронтенд    | React 18, Vite, TypeScript, TanStack Query |
| Инфра       | Docker, Docker Compose                   |

## Структура проекта

```
orphanage-system/
├── pom.xml                    # Parent Maven POM
├── docker-compose.yml
├── .env
├── infrastructure/
│   ├── postgres/init.sql      # Создание схем
│   └── keycloak/realm-export.json
├── services/
│   ├── eureka-server/         # Service Discovery
│   ├── api-gateway/           # Gateway + JWT validation
│   ├── children-service/      # Реестр детей
│   ├── staff-service/         # Персонал
│   ├── adoption-service/      # Усыновление + RabbitMQ publisher
│   ├── inventory-service/     # Склад
│   └── notification-service/  # Уведомления (RabbitMQ consumer)
└── frontend/                  # React SPA
```
