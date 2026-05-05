import { Routes, Route, NavLink, Link, Outlet } from 'react-router-dom'
import keycloak from './keycloak'
import ChildrenPage from './pages/ChildrenPage'
import StaffPage from './pages/StaffPage'
import AdoptionPage from './pages/AdoptionPage'
import InventoryPage from './pages/InventoryPage'
import DashboardPage from './pages/DashboardPage'
import PublicLandingPage from './pages/public/PublicLandingPage'
import ProfilePage from './pages/public/ProfilePage'
import HelpPage from './pages/public/HelpPage'
import EventsPage from './pages/public/EventsPage'

const ROLES_MAP: Record<string, string> = {
  ROLE_ADMIN: 'Администратор',
  ROLE_STAFF: 'Сотрудник',
  ROLE_DIRECTOR: 'Директор',
  ROLE_EDUCATOR: 'Воспитатель',
  ROLE_USER: 'Пользователь'
}

function PublicLayout() {
  const isAuthenticated = keycloak.authenticated;
  const parsed = keycloak.tokenParsed as any;
  const username = parsed?.preferred_username ?? 'Пользователь';
  const roles: string[] = parsed?.realm_access?.roles ?? [];
  const hasAdminAccess = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_STAFF') || roles.includes('ROLE_DIRECTOR');

  return (
    <div className="public-layout">
      <header className="public-topbar">
        <div className="public-container topbar-inner">
          <Link to="/" className="topbar-logo">🏡 ЦССВ "Светлый Путь"</Link>
          <nav className="topbar-nav">
            <Link to="/">Главная</Link>
            <Link to="/events">Мероприятия</Link>
            <Link to="/help">Как помочь</Link>
          </nav>
          <div className="topbar-actions">
            {hasAdminAccess && <Link to="/admin" className="btn-admin">Панель управления</Link>}
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="btn-profile">👤 {username}</Link>
                <button className="btn-logout" onClick={() => keycloak.logout()}>Выйти</button>
              </div>
            ) : (
              <button className="btn-login" onClick={() => keycloak.login({ action: 'register' })}>Войти / Регистрация</button>
            )}
          </div>
        </div>
      </header>
      <main className="public-main">
        <Outlet />
      </main>
      <footer className="public-footer">
        <div className="public-container">
          <p>© 2026 Детский дом "Светлый Путь". Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}

function AdminLayout() {
  if (!keycloak.authenticated) {
    keycloak.login();
    return null;
  }

  const parsed = keycloak.tokenParsed as any;
  const username = parsed?.preferred_username ?? 'Пользователь';
  const roles: string[] = parsed?.realm_access?.roles ?? [];
  const displayRole = roles.find(r => ROLES_MAP[r]) ?? roles[0] ?? 'Пользователь';
  const initials = username.slice(0, 2).toUpperCase();

  const isAdmin = roles.includes('ROLE_ADMIN');
  const isStaff = roles.includes('ROLE_STAFF') || roles.includes('ROLE_EDUCATOR') || roles.includes('ROLE_DIRECTOR');

  if (!isAdmin && !isStaff) {
    return <div style={{padding: 40}}>У вас нет доступа к панели администратора. <Link to="/">Вернуться на сайт</Link></div>;
  }

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>🏠 Панель</h1>
          <span>Администрирование</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="icon">📊</span> Дашборд
          </NavLink>
          {(isAdmin || isStaff) && (
            <>
              <NavLink to="/admin/children" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <span className="icon">👶</span> Дети
              </NavLink>
              <NavLink to="/admin/staff" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <span className="icon">👥</span> Персонал
              </NavLink>
              <NavLink to="/admin/inventory" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <span className="icon">📦</span> Склад и Закупки
              </NavLink>
            </>
          )}
          <NavLink to="/admin/adoptions" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="icon">💝</span> Заявки (Усыновление)
          </NavLink>
          <div style={{ marginTop: 'auto' }}>
            <Link to="/" className="nav-link" style={{ color: '#64748b' }}>
              <span className="icon">🌍</span> Вернуться на сайт
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{username}</div>
              <div className="user-role">{ROLES_MAP[displayRole] ?? displayRole}</div>
            </div>
            <button className="btn-logout" onClick={() => keycloak.logout()} title="Выйти">⏏</button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/children" element={<ChildrenPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/adoptions" element={<AdoptionPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<PublicLandingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="events" element={<EventsPage />} />
      </Route>
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  )
}

export default App
