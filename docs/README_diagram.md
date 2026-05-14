# 📊 Диаграмма базы данных

## Как открыть диаграмму в IntelliJ IDEA

### Вариант 1 — PlantUML файл (рекомендуется)
1. Установи плагин: **Settings → Plugins** → поиск `PlantUML Integration` → Install
2. Открой файл `docs/datamodel.puml`
3. Диаграмма отображается справа автоматически

### Вариант 2 — из живой БД (DataGrip / IDEA Ultimate)
1. В панели **Database** зажми `Ctrl` и выдели схемы:
   `adoption`, `children`, `inventory`, `notification`, `staff`
2. **ПКМ → Diagrams → Show Visualization** (`Ctrl+Shift+Alt+U`)
3. Нажми **«Show All»** в открытой диаграмме

---

## Структура базы данных

База данных `orphanage` содержит **5 схем** и **15+ таблиц**.

| Схема | Таблицы | Назначение |
|-------|---------|------------|
| **staff** | users, staff, volunteers, shelter_events, event_registrations, staff_schedules, articles | Пользователи, сотрудники, волонтёры, мероприятия |
| **children** | children, child_medical_records, education_records, psychologist_logs, legal_statuses | Карточки детей и все связанные записи |
| **adoption** | adoption_requests, happy_stories | Заявки на усыновление/опеку, истории успеха |
| **inventory** | shelter_needs, suppliers, procurement_requests, donations, material_help | Потребности, поставщики, пожертвования |
| **notification** | notification_logs, nutrition_norms | Журнал уведомлений, нормы питания |

---

## Почему adoption выглядит «пустым» в IDEA

Схема `adoption` **содержит таблицы**, но в диаграмме IDEA они могут не появиться если:
- Выбрана только схема, а не развёрнутые `tables`
- Flyway ещё не применил миграции V2–V5 (проверь `flyway_schema_history`)

### Проверить что в adoption:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'adoption';
```
Ожидаемый результат:
- `adoption_requests`
- `happy_stories`
- `flyway_schema_history`

---

## Связи между схемами

Связи **cross-schema** являются **логическими** (без физического `REFERENCES`),  
так как таблицы находятся в разных микросервисах и базах данных:

```
children.children.id  ──►  adoption.adoption_requests.child_id
children.children.id  ──►  adoption.happy_stories.child_id
staff.users.id        ──►  adoption.adoption_requests.user_id
staff.users.id        ──►  inventory.donations.user_id
staff.users.id        ──►  inventory.material_help.user_id
staff.users.id        ──►  staff.shelter_events.created_by
```

На диаграмме IDEA эти стрелки **не отображаются автоматически** —  
их нужно добавить вручную или смотреть в `docs/datamodel.puml`.
