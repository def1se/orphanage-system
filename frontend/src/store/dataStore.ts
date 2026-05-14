import { createStore } from './localStorage'

// ── Версия данных — увеличь при изменении структуры INITIAL_* ────────────────
const DATA_VERSION = '6'
const VERSION_KEY = '__data_version__'
if (localStorage.getItem(VERSION_KEY) !== DATA_VERSION) {
  // Сбрасываем все кеши при обновлении версии
  ;['admin_children', 'admin_events', 'admin_needs', 'admin_articles', 'admin_volunteers'].forEach(k => localStorage.removeItem(k))
  localStorage.setItem(VERSION_KEY, DATA_VERSION)
}

// ── Начальные данные ──────────────────────────────────────────────────────────

// Реальные детские фото через Unsplash (случайные seed, безопасные для работы)
const INITIAL_CHILDREN = [
  {
    id: 1,
    firstName: 'Алёша',
    lastName: 'Смирнов',
    birthDate: '2019-03-15',
    gender: 'MALE',
    status: 'IN_SHELTER',
    roomNumber: '12',
    imageUrl: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Alesha&backgroundColor=b6e3f4',
    description: 'Открытый и весёлый мальчик. Любит рисовать и собирать конструкторы. Легко идёт на контакт, мечтает стать художником.',
    shortDescription: 'Добрый и весёлый мальчик. Любит рисовать и играть в футбол.',
  },
  {
    id: 2,
    firstName: 'Катя',
    lastName: 'Иванова',
    birthDate: '2015-07-20',
    gender: 'FEMALE',
    status: 'IN_SHELTER',
    roomNumber: '8',
    imageUrl: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Katya&backgroundColor=ffdfbf',
    description: 'Умная и любознательная девочка. Отлично учится, участвует в олимпиадах. Мечтает стать врачом.',
    shortDescription: 'Умная и активная девочка. Отлично учится, любит читать книги.',
  },
  {
    id: 3,
    firstName: 'Миша',
    lastName: 'Петров',
    birthDate: '2020-11-01',
    gender: 'MALE',
    status: 'IN_SHELTER',
    roomNumber: '5',
    imageUrl: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Misha&backgroundColor=c0aede',
    description: 'Тихий и добрый малыш. Очень любит животных. Любознательный, задаёт много вопросов об окружающем мире.',
    shortDescription: 'Маленький и любознательный. Интересуется животными и природой.',
  },
  {
    id: 4,
    firstName: 'Аня',
    lastName: 'Козлова',
    birthDate: '2013-05-10',
    gender: 'FEMALE',
    status: 'IN_SHELTER',
    roomNumber: '3',
    imageUrl: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Anya&backgroundColor=ffb6c1',
    description: 'Творческая и талантливая девочка. Занимается танцами уже 4 года. Общительная, любит быть в центре внимания.',
    shortDescription: 'Творческая и талантливая. Занимается танцами, мечтает о сцене.',
  },
  {
    id: 5,
    firstName: 'Дима',
    lastName: 'Морозов',
    birthDate: '2017-08-22',
    gender: 'MALE',
    status: 'IN_SHELTER',
    roomNumber: '7',
    imageUrl: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Dima&backgroundColor=a0d468',
    description: 'Активный и технически мыслящий мальчик. Обожает собирать роботов. Спортивный, любит футбол.',
    shortDescription: 'Спортивный и энергичный. Любит конструкторы и роботику.',
  },
  {
    id: 6,
    firstName: 'Настя',
    lastName: 'Соколова',
    birthDate: '2018-12-05',
    gender: 'FEMALE',
    status: 'IN_SHELTER',
    roomNumber: '10',
    imageUrl: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Nastya&backgroundColor=fce38a',
    description: 'Нежная и заботливая девочка. Любит помогать взрослым, ухаживать за цветами. Мечтает о большой дружной семье.',
    shortDescription: 'Нежная и добрая. Любит помогать взрослым и ухаживать за цветами.',
  },
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
  { 
    id: 1, 
    title: 'Как подготовиться к усыновлению', 
    summary: 'Руководство по процессу усыновления', 
    category: 'GUIDE', 
    isPublished: true, 
    publishedAt: '2026-05-01', 
    content: 'Усыновление — серьёзный и ответственный шаг.\n\nПервое, что необходимо сделать будущим приемным родителям — это пройти Школу Приемных Родителей (ШПР). Там вы узнаете юридические, психологические и медицинские аспекты воспитания приемного ребенка.\n\nПосле получения сертификата ШПР необходимо собрать пакет документов для органов опеки, включая справки о доходах, отсутствии судимости и медицинское заключение.\n\nВажно помнить: адаптация ребенка в новой семье может занимать от нескольких месяцев до нескольких лет. Терпение и любовь — ваши главные помощники.'
  },
  { 
    id: 2, 
    title: 'День открытых дверей — 15 июня', 
    summary: 'Объявление о мероприятии', 
    category: 'ANNOUNCEMENT', 
    isPublished: true, 
    publishedAt: '2026-04-28', 
    content: 'Приглашаем всех желающих посетить наш детский дом.\n\nВ программе мероприятия:\n1. Знакомство с условиями проживания детей.\n2. Выступление директора и специалистов центра.\n3. Ответы на вопросы будущих опекунов и волонтеров.\n4. Концерт, подготовленный воспитанниками ЦССВ.\n\nДля участия необходимо предварительно зарегистрироваться через наш сайт или по телефону горячей линии. При себе обязательно иметь паспорт.' 
  },
  { 
    id: 3, 
    title: 'Опека vs усыновление: в чём разница?', 
    summary: 'Объясняем юридические различия', 
    category: 'GUIDE', 
    isPublished: true, 
    publishedAt: '2026-04-10', 
    content: 'Многие путают опеку и усыновление. Давайте разберем основные отличия.\n\nУсыновление:\n- Ребенок становится полноправным членом семьи со всеми правами (в том числе наследственными).\n- Родители могут изменить ФИО ребенка и дату его рождения.\n- Тайна усыновления охраняется законом.\n\nОпека (попечительство):\n- Опекун является законным представителем ребенка до его совершеннолетия.\n- Ребенок сохраняет свои изначальные ФИО.\n- Опекун получает пособие на содержание ребенка от государства.\n\nВыбор формы устройства зависит от статуса ребенка и возможностей кандидатов.'
  },
]

const INITIAL_VOLUNTEERS = [
  { id: 1, name: 'Анна Петрова', email: 'anna@mail.ru', phone: '+7 900 111-00-01', skills: 'Педагогика, творчество', availableDays: 'Сб, Вс', status: 'PENDING', createdAt: '2026-05-01' },
  { id: 2, name: 'Дмитрий Соколов', email: 'dmitry@mail.ru', phone: '+7 900 111-00-02', skills: 'Спорт, футбол', availableDays: 'Пн, Ср, Пт', status: 'ACTIVE', createdAt: '2026-04-15' },
  { id: 3, name: 'Елена Морозова', email: 'elena@mail.ru', phone: '+7 900 111-00-03', skills: 'Психология, арт-терапия', availableDays: 'Вт, Чт', status: 'ACTIVE', createdAt: '2026-04-01' },
]

// ── Экспортируемые стора ──────────────────────────────────────────────────────

export const childrenStore   = createStore<any>('admin_children',  INITIAL_CHILDREN)
export const eventsStore     = createStore<any>('admin_events',    INITIAL_EVENTS)
export const needsStore      = createStore<any>('admin_needs',     INITIAL_NEEDS)
export const articlesStore   = createStore<any>('admin_articles',  INITIAL_ARTICLES)
export const volunteersStore = createStore<any>('admin_volunteers', INITIAL_VOLUNTEERS)

/** Заявки хранятся с привязкой к userId из Keycloak */
export const requestsStore = createStore<any>('adoption_requests', [])
