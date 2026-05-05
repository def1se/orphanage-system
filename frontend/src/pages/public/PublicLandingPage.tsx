import { Link } from 'react-router-dom'
import keycloak from '../../keycloak'

const STORIES = [
  { name: 'Алёша', age: 7, text: 'Алёша попал в нашу семью три года назад. Сейчас он учится в школе, любит рисовать и мечтает стать художником. Мы счастливы!', family: 'Семья Петровых' },
  { name: 'Катя и Миша', age: 0, text: 'Мы взяли двух братьев и сестёр. Сначала было непросто, но сейчас они называют нас мамой и папой. Это лучшее, что случилось в нашей жизни.', family: 'Семья Ивановых' },
  { name: 'Анна', age: 12, text: 'Аня пришла к нам подростком. Мы вместе прошли через многое. Сейчас она студентка университета — мы гордимся ею каждый день.', family: 'Семья Сидоровых' },
]

const STATS = [
  { n: '127', label: 'Детей обрели семью' },
  { n: '340+', label: 'Волонтёров помогают' },
  { n: '1.2M ₽', label: 'Собрано пожертвований' },
  { n: '45', label: 'Мероприятий в год' },
]

const HELP_WAYS = [
  { icon: '💰', title: 'Финансовая помощь', text: 'Пожертвуйте любую сумму — каждый рубль идёт на нужды детей', link: '/help', btn: 'Помочь деньгами' },
  { icon: '📦', title: 'Материальная помощь', text: 'Передайте вещи, которые нужны детям прямо сейчас', link: '/help', btn: 'Передать вещи' },
  { icon: '🤝', title: 'Волонтёрство', text: 'Проводите время с детьми, помогайте в мероприятиях', link: '/volunteer', btn: 'Стать волонтёром' },
  { icon: '🏠', title: 'Опека/Усыновление', text: 'Подарите ребёнку настоящую семью и дом', link: '/children', btn: 'Узнать подробнее' },
]

export default function PublicLandingPage() {
  const isAuth = keycloak.authenticated
  const parsed = keycloak.tokenParsed as any
  const username = parsed?.preferred_username

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">✨ ЦССВ «Светлый Путь»</div>
          <h1>
            Каждый ребёнок заслуживает<br />
            <span>любящую семью</span>
          </h1>
          {isAuth ? (
            <>
              <p>Добро пожаловать, <strong>{username}</strong>! Посмотрите, что нового в нашей системе.</p>
              <div className="hero-actions">
                <Link to="/children" className="btn btn-primary btn-lg">👶 Каталог детей</Link>
                <Link to="/profile" className="btn btn-secondary btn-lg">👤 Личный кабинет</Link>
              </div>
            </>
          ) : (
            <>
              <p>Мы помогаем детям-сиротам обрести семью, а людям — найти способ изменить чью-то жизнь к лучшему.</p>
              <div className="hero-actions">
                <Link to="/children" className="btn btn-primary btn-lg">👶 Познакомиться с детьми</Link>
                <Link to="/help" className="btn btn-secondary btn-lg">💛 Помочь детскому дому</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stats-grid">
            {STATS.map(s => (
              <div key={s.n} className="card stat-card">
                <div className="stat-number">{s.n}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" style={{ background: 'rgba(124,58,237,0.04)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="section-header">
                <div className="section-title">О нашем детском доме</div>
                <div className="section-subtitle">Более 20 лет помогаем детям обрести семью</div>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.8 }}>
                ЦССВ «Светлый Путь» — государственное учреждение для детей-сирот и детей, оставшихся без попечения родителей. Мы создаём все условия для полноценного развития каждого воспитанника.
              </p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.8 }}>
                Наша главная цель — помочь каждому ребёнку найти любящую семью. Мы сопровождаем весь процесс от знакомства до усыновления.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>📍 г. Москва, ул. Примерная, д. 1</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>📞 +7 (495) 000-00-00</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>🕐 Пн–Пт 9:00–18:00</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['🏫', 'Образование', 'Школьная программа и дополнительные занятия'],
                ['🏥', 'Здоровье', 'Медицинское наблюдение и реабилитация'],
                ['🎨', 'Творчество', 'Кружки и секции для развития таланта'],
                ['💼', 'Профориентация', 'Подготовка к самостоятельной жизни']
              ].map(([icon, title, text]) => (
                <div key={title} className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <div className="section-title">Как вы можете помочь?</div>
            <div className="section-subtitle">Любая помощь важна — выберите удобный способ</div>
          </div>
          <div className="grid-4">
            {HELP_WAYS.map(w => (
              <div key={w.title} className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 40 }}>{w.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{w.title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14, flex: 1 }}>{w.text}</div>
                <Link to={w.link} className="btn btn-outline btn-sm">{w.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="section" style={{ background: 'rgba(6,182,212,0.04)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="row">
              <div>
                <div className="section-title">Истории счастливых семей</div>
                <div className="section-subtitle">Дети, которые уже обрели дом</div>
              </div>
              <Link to="/stories" className="btn btn-outline">Все истории →</Link>
            </div>
          </div>
          <div className="grid-3">
            {STORIES.map(s => (
              <div key={s.name} className="card story-card">
                <div className="quote">"</div>
                <p>{s.text}</p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="author">{s.family}</div>
                  {s.age > 0 && <span className="tag">Возраст: {s.age} лет</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuth && (
        <section className="section" style={{ textAlign: 'center' }}>
          <div className="container">
            <div className="card" style={{ maxWidth: 600, margin: '0 auto', padding: '48px 40px', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💛</div>
              <h2 style={{ marginBottom: 12 }}>Готовы изменить чью-то жизнь?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
                Зарегистрируйтесь, чтобы оставить заявку на знакомство с ребёнком, записаться на мероприятие или стать волонтёром.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => keycloak.login()}>
                Зарегистрироваться
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
