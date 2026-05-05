import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import keycloak from '../../keycloak'
import { requestsStore } from '../../store/dataStore'

const STATUSES: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Новая', color: 'badge-blue' },
  REVIEW: { label: 'На рассмотрении', color: 'badge-yellow' },
  APPROVED: { label: 'Одобрена', color: 'badge-green' },
  REJECTED: { label: 'Отклонена', color: 'badge-red' },
  CLOSED: { label: 'Закрыта', color: 'badge-gray' },
}

const TABS = ['info', 'requests', 'settings'] as const
type Tab = typeof TABS[number]

export default function ProfilePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [editMode, setEditMode] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!keycloak.authenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔐</div>
        <h2 style={{ marginBottom: 8 }}>Требуется авторизация</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Войдите в аккаунт, чтобы открыть личный кабинет
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => keycloak.login()}>Войти в аккаунт</button>
      </div>
    )
  }

  const parsed = keycloak.tokenParsed as any
  const userId: string = parsed?.sub ?? ''           // уникальный ID пользователя
  const username = parsed?.preferred_username ?? 'Пользователь'
  const email = parsed?.email ?? ''
  const name = parsed?.name ?? username
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  const roles: string[] = parsed?.realm_access?.roles ?? []
  const roleLabel = roles.includes('ROLE_ADMIN') ? 'Администратор'
    : roles.includes('ROLE_DIRECTOR') ? 'Директор'
    : roles.includes('ROLE_STAFF') ? 'Сотрудник'
    : roles.includes('ROLE_EDUCATOR') ? 'Воспитатель'
    : roles.includes('ROLE_VOLUNTEER') ? 'Волонтёр'
    : 'Пользователь'
  const roleColor = roles.includes('ROLE_ADMIN') ? 'badge-red'
    : roles.includes('ROLE_STAFF') || roles.includes('ROLE_DIRECTOR') ? 'badge-yellow'
    : roles.includes('ROLE_VOLUNTEER') ? 'badge-purple'
    : 'badge-green'

  const [form, setForm] = useState({ name, phone: '', address: '' })

  // Только заявки текущего пользователя
  const myRequests = requestsStore.getAll().filter((r: any) => r.userId === userId)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 400))
    setSaved(true)
    setEditMode(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="profile-avatar">{initials}</div>
              <div className="profile-name">{name}</div>
              <div className="profile-email">{email}</div>
              <div className="profile-role" style={{ marginTop: 8 }}>
                <span className={`badge ${roleColor}`}>{roleLabel}</span>
              </div>
            </div>
            <div className="card" style={{ padding: 8 }}>
              <div className="profile-menu">
                {([
                  ['info', '👤', 'Мои данные'],
                  ['requests', '📋', `Мои заявки (${myRequests.length})`],
                  ['settings', '⚙️', 'Настройки'],
                ] as const).map(([tab, icon, label]) => (
                  <div key={tab}
                    className={`profile-menu-item ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}>
                    <span>{icon}</span> {label}
                  </div>
                ))}
                <div className="divider" />
                <div className="profile-menu-item"
                  onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
                  style={{ color: 'var(--danger)' }}>
                  <span>⏏️</span> Выйти
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            {saved && <div className="alert alert-success">✅ Данные успешно сохранены!</div>}

            {/* Личная информация */}
            {activeTab === 'info' && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">👤 Личная информация</div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Отмена' : '✏️ Редактировать'}
                  </button>
                </div>
                {editMode ? (
                  <form onSubmit={handleSave}>
                    <div className="form-group">
                      <label className="form-label">Полное имя</label>
                      <input className="form-control" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-control" value={email} disabled style={{ opacity: 0.6 }} />
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                        Email изменяется через настройки аккаунта Keycloak
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Телефон</label>
                      <input className="form-control" value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+7 (900) 000-00-00" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Адрес</label>
                      <input className="form-control" value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        placeholder="г. Москва, ул. ..." />
                    </div>
                    <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      ['Логин', username],
                      ['Полное имя', form.name],
                      ['Email', email],
                      ['Телефон', form.phone || 'Не указан'],
                      ['Роль', roleLabel],
                      ['ID пользователя', userId.slice(0, 18) + '...'],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{label}</span>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Мои заявки */}
            {activeTab === 'requests' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700 }}>📋 Мои заявки</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/adoption-request')}>
                    + Новая заявка
                  </button>
                </div>
                {myRequests.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <div className="empty-title">Заявок пока нет</div>
                    <div className="empty-text" style={{ marginBottom: 20 }}>
                      Оставьте заявку на знакомство с ребёнком
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/adoption-request')}>
                      Оставить заявку
                    </button>
                  </div>
                ) : myRequests.map((r: any) => (
                  <div key={r.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                          Заявка #{r.id}
                          {r.childName ? ` — ${r.childName}` : ''}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>
                          {r.requestType === 'ACQUAINTANCE' ? '👋 Знакомство'
                            : r.requestType === 'GUARDIANSHIP' ? '🤝 Опека'
                            : '❤️ Усыновление'} • {r.createdAt}
                        </div>
                        {r.message && (
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            «{r.message}»
                          </div>
                        )}
                        {r.adminComment && (
                          <div className="alert alert-info" style={{ padding: '8px 12px', marginTop: 8 }}>
                            💬 Комментарий: {r.adminComment}
                          </div>
                        )}
                      </div>
                      <span className={`badge ${STATUSES[r.status]?.color ?? 'badge-gray'}`}>
                        {STATUSES[r.status]?.label ?? r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Настройки */}
            {activeTab === 'settings' && (
              <div className="card">
                <div className="card-title" style={{ marginBottom: 24 }}>⚙️ Настройки аккаунта</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="alert alert-info">
                    ℹ️ Для изменения пароля и email используйте портал Keycloak
                  </div>
                  <button className="btn btn-secondary"
                    onClick={() => window.open('http://localhost:8180/realms/orphanage/account', '_blank')}>
                    🔗 Открыть настройки аккаунта
                  </button>
                  <div className="divider" />
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 12 }}>Опасная зона</div>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>
                      Выйти из всех устройств
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
