import { createStore } from './localStorage'

// ── Начальные данные ──────────────────────────────────────────────────────────

const INITIAL_CHILDREN = [
  { id: 1, firstName: 'Алёша', lastName: 'Смирнов', birthDate: '2019-03-15', gender: 'MALE', status: 'IN_SHELTER', roomNumber: '12', description: 'Добрый мальчик, любит рисовать' },
  { id: 2, firstName: 'Катя', lastName: 'Иванова', birthDate: '2015-07-20', gender: 'FEMALE', status: 'IN_SHELTER', roomNumber: '8', description: 'Умная девочка, хорошо учится' },
  { id: 3, firstName: 'Миша', lastName: 'Петров', birthDate: '2020-11-01', gender: 'MALE', status: 'UNDER_GUARDIANSHIP', roomNumber: '5', description: 'Любит животных' },
  { id: 4, firstName: 'Аня', lastName: 'Козлова', birthDate: '2013-05-10', gender: 'FEMALE', status: 'IN_SHELTER', roomNumber: '3', description: 'Занимается танцами' },
  { id: 5, firstName: 'Дима', lastName: 'Морозов', birthDate: '2017-08-22', gender: 'MALE', status: 'IN_SHELTER', roomNumber: '7', description: 'Любит конструкторы и технику' },
  { id: 6, firstName: 'Настя', lastName: 'Соколова', birthDate: '2018-12-05', gender: 'FEMALE', status: 'IN_SHELTER', roomNumber: '10', description: 'Добрая и общительная девочка' },
]

const INITIAL_EVENTS = [
  { id: 1, title: 'День открытых дверей', description: 'Приглашаем всех желающих познакомиться с нашим учреждением.', eventDate: '2026-06-15T10:00:00', location: 'Главный корпус', maxParticipants: 50, registered: 23 },
  { id: 2, title: 'Благотворительный концерт', description: 'Воспитанники детского дома покажут театральную постановку.', eventDate: '2026-06-20T18:00:00', location: 'ДК «Россия»', maxParticipants: 200, registered: 145 },
  { id: 3, title: 'Мастер-класс по рисованию', description: 'Совместный мастер-класс для детей и потенциальных опекунов.', eventDate: '2026-07-05T12:00:00', location: 'Арт-студия ЦССВ', maxParticipants: 20, registered: 8 },
  { id: 4, title: 'Спортивный праздник', description: 'Ежегодный день спорта. Эстафеты, конкурсы, весёлые старты.', eventDate: '2026-07-12T10:00:00', location: 'Стадион ЦССВ', maxParticipants: 100, registered: 34 },
]

const INITIAL_NEEDS = [
  { id: 1, itemName: 'Детские куртки (зима)', category: 'CLOTHING', quantityNeeded: 30, quantityCurrent: 8, priority: 'HIGH', price: 2500 },
  { id: 2, itemName: 'Школьные рюкзаки', category: 'EDUCATION', quantityNeeded: 20, quantityCurrent: 5, priority: 'HIGH', price: 1500 },
  { id: 3, itemName: 'Постельное бельё (комплект)', category: 'HOUSEHOLD', quantityNeeded: 50, quantityCurrent: 20, priority: 'MEDIUM', price: 800 },
  { id: 4, itemName: 'Спортивная обувь', category: 'CLOTHING', quantityNeeded: 25, quantityCurrent: 12, priority: 'MEDIUM', price: 1200 },
  { id: 5, itemName: 'Витамины', category: 'HEALTH', quantityNeeded: 100, quantityCurrent: 40, priority: 'HIGH', price: 300 },
]

const INITIAL_ARTICLES = [
  { id: 1, title: 'Как подготовиться к усыновлению', summary: 'Руководство по процессу усыновления', category: 'GUIDE', isPublished: true, publishedAt: '2026-05-01', content: 'Усыновление — серьёзный и ответственный шаг...' },
  { id: 2, title: 'День открытых дверей — 15 июня', summary: 'Объявление о мероприятии', category: 'ANNOUNCEMENT', isPublished: true, publishedAt: '2026-04-28', content: 'Приглашаем всех желающих посетить наш детский дом.' },
  { id: 3, title: 'Опека vs усыновление: в чём разница?', summary: 'Объясняем юридические различия', category: 'GUIDE', isPublished: true, publishedAt: '2026-04-10', content: 'Многие путают опеку и усыновление...' },
]

const INITIAL_VOLUNTEERS = [
  { id: 1, name: 'Анна Петрова', email: 'anna@mail.ru', phone: '+7 900 111-00-01', skills: 'Педагогика, творчество', availableDays: 'Сб, Вс', status: 'PENDING', createdAt: '2026-05-01' },
  { id: 2, name: 'Дмитрий Соколов', email: 'dmitry@mail.ru', phone: '+7 900 111-00-02', skills: 'Спорт, футбол', availableDays: 'Пн, Ср, Пт', status: 'ACTIVE', createdAt: '2026-04-15' },
  { id: 3, name: 'Елена Морозова', email: 'elena@mail.ru', phone: '+7 900 111-00-03', skills: 'Психология, арт-терапия', availableDays: 'Вт, Чт', status: 'ACTIVE', createdAt: '2026-04-01' },
]

// ── Экспортируемые стора ──────────────────────────────────────────────────────

export const childrenStore = createStore<any>('admin_children', INITIAL_CHILDREN)
export const eventsStore   = createStore<any>('admin_events',   INITIAL_EVENTS)
export const needsStore    = createStore<any>('admin_needs',    INITIAL_NEEDS)
export const articlesStore = createStore<any>('admin_articles', INITIAL_ARTICLES)
export const volunteersStore = createStore<any>('admin_volunteers', INITIAL_VOLUNTEERS)

/** Заявки хранятся с привязкой к userId из Keycloak */
export const requestsStore = createStore<any>('adoption_requests', [
  { id: 1, userId: 'demo-user', applicantFirstName: 'Иван', applicantLastName: 'Иванов', applicantPhone: '+7 900 000-00-01', applicantEmail: 'ivan@mail.ru', requestType: 'ACQUAINTANCE', childId: 1, childName: 'Алёша', status: 'NEW', message: 'Хотели бы познакомиться.', adminComment: '', createdAt: '2026-05-01' },
])
