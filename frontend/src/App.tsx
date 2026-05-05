import { Routes, Route, NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import keycloak from './keycloak'
// Public pages
import PublicLandingPage from './pages/public/PublicLandingPage'
import ChildrenCatalogPage from './pages/public/ChildrenCatalogPage'
import HappyStoriesPage from './pages/public/HappyStoriesPage'
import EventsPage from './pages/public/EventsPage'
import HowToHelpPage from './pages/public/HowToHelpPage'
import ArticlesPage from './pages/public/ArticlesPage'
import ProfilePage from './pages/public/ProfilePage'
import VolunteerPage from './pages/public/VolunteerPage'
import AdoptionRequestPage from './pages/public/AdoptionRequestPage'
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminChildrenPage from './pages/admin/AdminChildrenPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage'
import AdminEventsPage from './pages/admin/AdminEventsPage'
import AdminNeedsPage from './pages/admin/AdminNeedsPage'
import AdminArticlesPage from './pages/admin/AdminArticlesPage'
import AdminVolunteersPage from './pages/admin/AdminVolunteersPage'

const NAV_LINKS = [
  { to: '/', label: 'Главная', exact: true },
  { to: '/children', label: 'Дети' },
  { to: '/stories', label: 'Истории' },
  { to: '/events', label: 'Мероприятия' },
  { to: '/help', label: 'Помочь' },
  { to: '/articles', label: 'Статьи' },
]

const ADMIN_NAV = [
  { to: '/admin', label: 'Дашборд', icon: '📊', exact: true },
  { section: 'Управление' },
  { to: '/admin/children', label: 'Воспитанники', icon: '👶' },
  { to: '/admin/applications', label: 'Заявки', icon: '📋' },
  { to: '/admin/volunteers', label: 'Волонтёры', icon: '🤝' },
  { to: '/admin/events', label: 'Мероприятия', icon: '📅' },
  { section: 'Контент' },
  { to: '/admin/articles', label: 'Статьи', icon: '📰' },
  { to: '/admin/needs', label: 'Потребности', icon: '📦' },
  { to: '/admin/users', label: 'Пользователи', icon: '👥' },
]

function PublicLayout() {
  const isAuthenticated = keycloak.authenticated
  const parsed = keycloak.tokenParsed as any
  const username = parsed?.preferred_username ?? 'Профиль'
  const roles: string[] = parsed?.realm_access?.roles ?? []
  const isAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_STAFF') || roles.includes('ROLE_DIRECTOR')

  return (
    <div className="public-layout">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="topbar-logo">🏡 Светлый Путь</Link>
          <nav className="topbar-nav">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.exact}
                className={({ isActive }) => isActive ? 'active' : ''}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="topbar-actions">
            {isAdmin && <Link to="/admin" className="btn-admin">⚙️ Панель</Link>}
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="btn-profile">👤 {username}</Link>
                <button className="btn-logout" onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>Выйти</button>
              </div>
            ) : (
              <button className="btn-login" onClick={() => keycloak.login()}>Войти / Регистрация</button>
            )}
          </div>
        </div>
      </header>
      <main className="public-main"><Outlet /></main>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-title">🏡 ЦССВ «Светлый Путь»</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Центр содействия семейному воспитанию.<br />Помогаем детям обрести семью.
              </p>
            </div>
            <div>
              <div className="footer-title">Навигация</div>
              <div className="footer-links">
                {NAV_LINKS.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
              </div>
            </div>
            <div>
              <div className="footer-title">Помочь</div>
              <div className="footer-links">
                <Link to="/help">Финансовая помощь</Link>
                <Link to="/help">Материальная помощь</Link>
                <Link to="/volunteer">Стать волонтёром</Link>
              </div>
            </div>
            <div>
              <div className="footer-title">Контакты</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span>📍 г. Москва, ул. Примерная, д. 1</span>
                <span>📞 +7 (495) 000-00-00</span>
                <span>✉️ info@svetly-put.ru</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">© 2026 ЦССВ «Светлый Путь». Все права защищены.</div>
        </div>
      </footer>
    </div>
  )
}

function AdminLayout() {
  const navigate = useNavigate()
  const parsed = keycloak.tokenParsed as any
  const username = parsed?.preferred_username ?? 'Пользователь'
  const roles: string[] = parsed?.realm_access?.roles ?? []
  const initials = username.slice(0, 2).toUpperCase()
  const isAdmin = roles.includes('ROLE_ADMIN')
  const isStaff = isAdmin || roles.includes('ROLE_STAFF') || roles.includes('ROLE_DIRECTOR') || roles.includes('ROLE_EDUCATOR')

  if (!keycloak.authenticated) {
    keycloak.login()
    return null
  }
  if (!isStaff) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🚫</div>
        <h2 style={{ marginBottom: 8 }}>Доступ запрещён</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>У вас нет прав для доступа к панели управления.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>На главную</button>
      </div>
    )
  }

  const roleLabel = isAdmin ? 'Администратор' : 'Сотрудник'

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>🏠 Светлый Путь</h1>
          <span>Панель управления</span>
        </div>
        <nav className="sidebar-nav">
          {ADMIN_NAV.map((item, i) => {
            if ('section' in item) return <div key={i} className="nav-section-label">{item.section}</div>
            if (!isAdmin && (item.to === '/admin/users')) return null
            return (
              <NavLink key={item.to} to={item.to!} end={item.exact}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <span className="icon">{item.icon}</span> {item.label}
              </NavLink>
            )
          })}
          <div style={{ marginTop: 'auto' }} />
          <Link to="/" className="nav-link" style={{ color: 'var(--text-muted)' }}>
            <span className="icon">🌍</span> На сайт
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{username}</div>
              <div className="user-role">{roleLabel}</div>
            </div>
            <button className="btn-logout" style={{ padding: '6px 10px', marginLeft: 'auto' }}
              onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>⏏</button>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="children" element={<AdminChildrenPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="needs" element={<AdminNeedsPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="volunteers" element={<AdminVolunteersPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<PublicLandingPage />} />
        <Route path="children" element={<ChildrenCatalogPage />} />
        <Route path="stories" element={<HappyStoriesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="help" element={<HowToHelpPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="volunteer" element={<VolunteerPage />} />
        <Route path="adoption-request" element={<AdoptionRequestPage />} />
      </Route>
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  )
}
