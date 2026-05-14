import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import keycloak from '../../keycloak'
import { requestsStore, volunteersStore } from '../../store/dataStore'
import { eventRegistrationsStore } from '../../store/eventRegistrationsStore'
import { materialOrdersStore } from '../../store/materialOrdersStore'
import { lsGet, lsSet } from '../../store/localStorage'

const STATUSES: Record<string, { label: string; color: string }> = {
  NEW:      { label: 'Новая',           color: 'badge-blue' },
  REVIEW:   { label: 'На рассмотрении', color: 'badge-yellow' },
  APPROVED: { label: 'Одобрена',        color: 'badge-green' },
  REJECTED: { label: 'Отклонена',       color: 'badge-red' },
  CLOSED:   { label: 'Закрыта',         color: 'badge-gray' },
}

const ORDER_STATUSES: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'В обработке', color: 'badge-yellow' },
  CONFIRMED: { label: 'Подтверждён', color: 'badge-blue' },
  DELIVERED: { label: 'Доставлен',   color: 'badge-green' },
  CANCELLED: { label: 'Отменён',     color: 'badge-red' },
}

const TABS = ['info', 'requests', 'events', 'orders', 'volunteer', 'settings'] as const
type Tab = typeof TABS[number]

const PROFILE_KEY = 'user_profile_extra'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultTab = (searchParams.get('tab') as Tab) ?? 'info'
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)
  const [saved, setSaved] = useState(false)
  const [pwdSaved, setPwdSaved] = useState(false)
  const [pwdError, setPwdError] = useState('')

  if (!keycloak.authenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔐</div>
        <h2 style={{ marginBottom: 8 }}>Требуется авторизация</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Войдите в аккаунт, чтобы открыть личный кабинет</p>
        <button className="btn btn-primary btn-lg" onClick={() => keycloak.login()}>Войти в аккаунт</button>
      </div>
    )
  }

  const parsed = keycloak.tokenParsed as any
  const userId: string = parsed?.sub ?? ''
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

  // Доп. данные профиля из localStorage
  const extra = lsGet(PROFILE_KEY + '_' + userId, { phone: '', address: '', displayName: name, avatarEmoji: '👤' })
  const [form, setForm] = useState({ displayName: extra.displayName, phone: extra.phone, address: extra.address, avatarEmoji: extra.avatarEmoji })
  const [editMode, setEditMode] = useState(false)

  // Смена пароля (локальная валидация, Keycloak через редирект)
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' })

  const myRequests = requestsStore.getAll().filter((r: any) => r.userId === userId)
  const myEvents = eventRegistrationsStore.getAll().filter(r => r.userId === userId)
  const myOrders = materialOrdersStore.getAll().filter(o => o.userId === userId)
  const myVolunteering = volunteersStore.getAll().filter((v: any) => v.userId === userId || v.email === email)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 400))
    lsSet(PROFILE_KEY + '_' + userId, { ...extra, ...form })
    setSaved(true)
    setEditMode(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePwdChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPwdError('')
    if (!pwdForm.current) { setPwdError('Введите текущий пароль'); return }
    if (pwdForm.next.length < 8) { setPwdError('Новый пароль должен быть не менее 8 символов'); return }
    if (!/[A-Z]/.test(pwdForm.next)) { setPwdError('Пароль должен содержать заглавную букву'); return }
    if (!/[0-9]/.test(pwdForm.next)) { setPwdError('Пароль должен содержать цифру'); return }
    if (pwdForm.next !== pwdForm.confirm) { setPwdError('Пароли не совпадают'); return }
    // Реальная смена через Keycloak Account Portal
    window.open('http://localhost:8180/realms/orphanage/account/#/security/signingin', '_blank')
    setPwdSaved(true)
    setPwdForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwdSaved(false), 4000)
  }

  const AVATAR_OPTIONS = ['👤', '🧑', '👨', '👩', '🧒', '👦', '👧', '🧑‍💻', '🧑‍🎓', '🦸', '🧙', '🌟']

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="profile-avatar" style={{ fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {extra.avatarEmoji || initials}
              </div>
              <div className="profile-name">{extra.displayName || name}</div>
              <div className="profile-email">{email}</div>
              <div className="profile-role" style={{ marginTop: 8 }}>
                <span className={`badge ${roleColor}`}>{roleLabel}</span>
              </div>
            </div>
            <div className="card" style={{ padding: 8 }}>
              <div className="profile-menu">
                {([
                  ['info',     '👤', 'Мои данные'],
                  ['requests', '📋', `Заявки (${myRequests.length})`],
                  ['events',   '📅', `Мероприятия (${myEvents.length})`],
                  ['orders',   '📦', `Заказы (${myOrders.length})`],
                  ['volunteer', '🤝', `Волонтёрство (${myVolunteering.length})`],
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
                      <label className="form-label">Аватар</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {AVATAR_OPTIONS.map(emoji => (
                          <button key={emoji} type="button"
                            onClick={() => setForm(f => ({ ...f, avatarEmoji: emoji }))}
                            style={{
                              fontSize: 28, padding: '8px', borderRadius: 12, border: `2px solid ${form.avatarEmoji === emoji ? 'var(--primary)' : 'var(--border)'}`,
                              background: form.avatarEmoji === emoji ? 'rgba(124,58,237,0.1)' : 'transparent', cursor: 'pointer'
                            }}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Отображаемое имя</label>
                      <input className="form-control" value={form.displayName}
                        onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Иванов Иван Иванович" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-control" value={email} disabled style={{ opacity: 0.6 }} />
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Email управляется через Keycloak</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Телефон</label>
                      <input className="form-control" value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+7 (900) 000-00-00" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Адрес</label>
                      <input className="form-control" value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="г. Москва, ул. ..." />
                    </div>
                    <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      ['Логин', username],
                      ['Полное имя', extra.displayName || name],
                      ['Email', email],
                      ['Телефон', extra.phone || 'Не указан'],
                      ['Адрес', extra.address || 'Не указан'],
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
                  <h3 style={{ fontSize: 20, fontWeight: 700 }}>📋 Мои заявки на опеку</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/children')}>Найти ребёнка</button>
                </div>
                {myRequests.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <div className="empty-title">Заявок пока нет</div>
                    <div className="empty-text" style={{ marginBottom: 20 }}>Оставьте заявку на знакомство с ребёнком</div>
                    <button className="btn btn-primary" onClick={() => navigate('/children')}>Найти ребёнка</button>
                  </div>
                ) : myRequests.map((r: any) => (
                  <div key={r.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                          Заявка #{r.id}{r.childName ? ` — ${r.childName}` : ''}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>
                          {r.requestType === 'ACQUAINTANCE' ? '👋 Знакомство' : r.requestType === 'GUARDIANSHIP' ? '🤝 Опека' : '❤️ Усыновление'} · {r.createdAt}
                        </div>
                        {r.applicantPhone && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>📞 {r.applicantPhone}</div>}
                        {r.message && <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>«{r.message}»</div>}
                        {r.adminComment && <div className="alert alert-info" style={{ padding: '8px 12px', marginTop: 8 }}>💬 {r.adminComment}</div>}
                      </div>
                      <span className={`badge ${STATUSES[r.status]?.color ?? 'badge-gray'}`}>{STATUSES[r.status]?.label ?? r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Мои мероприятия */}
            {activeTab === 'events' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700 }}>📅 Мои мероприятия</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/events')}>Все мероприятия</button>
                </div>
                {myEvents.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <div className="empty-title">Вы не записаны ни на одно мероприятие</div>
                    <div className="empty-text" style={{ marginBottom: 20 }}>Просмотрите актуальные события</div>
                    <button className="btn btn-primary" onClick={() => navigate('/events')}>Перейти к мероприятиям</button>
                  </div>
                ) : myEvents.map(r => (
                  <div key={r.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>📅 {r.eventTitle || `Мероприятие #${r.eventId}`}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 4 }}>🕐 Дата регистрации: {r.registeredAt}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>👤 {r.name} · 📞 {r.phone}</div>
                        {r.notes && <div style={{ fontSize: 13, fontStyle: 'italic', marginTop: 6 }}>«{r.notes}»</div>}
                      </div>
                      <span className="badge badge-green">✓ Записан</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Мои заказы */}
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700 }}>📦 Мои заказы</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/help?tab=material')}>Оформить заказ</button>
                </div>
                {myOrders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <div className="empty-title">Заказов пока нет</div>
                    <div className="empty-text" style={{ marginBottom: 20 }}>Перейдите в раздел «Помочь» и оформите передачу вещей</div>
                    <button className="btn btn-primary" onClick={() => navigate('/help')}>Оформить заказ</button>
                  </div>
                ) : myOrders.map(o => (
                  <div key={o.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Заказ #{String(o.id).slice(-6)}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                          {o.deliveryMethod === 'DELIVERY' ? '🚚 Доставка' : '🚶 Самовывоз'} · {o.createdAt}
                        </div>
                      </div>
                      <span className={`badge ${ORDER_STATUSES[o.status]?.color ?? 'badge-gray'}`}>
                        {ORDER_STATUSES[o.status]?.label ?? o.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                      {o.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
                          <span>{item.itemName}</span>
                          <span>{item.quantity} шт. · {(item.quantity * item.price).toLocaleString()} ₽</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)', fontWeight: 700 }}>
                      <span>Итого</span>
                      <span style={{ color: 'var(--primary-light)' }}>{o.totalAmount.toLocaleString()} ₽</span>
                    </div>
                    {o.address && o.deliveryMethod === 'DELIVERY' && (
                      <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>📍 {o.address}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Волонтёрство */}
            {activeTab === 'volunteer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700 }}>🤝 Мои заявки на волонтёрство</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/volunteer')}>Подать заявку</button>
                </div>
                {myVolunteering.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🤝</div>
                    <div className="empty-title">Вы еще не подавали заявку</div>
                    <div className="empty-text" style={{ marginBottom: 20 }}>Присоединяйтесь к команде волонтёров</div>
                    <button className="btn btn-primary" onClick={() => navigate('/volunteer')}>Стать волонтёром</button>
                  </div>
                ) : myVolunteering.map((v: any) => (
                  <div key={v.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Анкета от {v.createdAt || 'недавно'}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8 }}>Сферы: {v.skills}</div>
                        {v.availableDays && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>📅 Доступные дни: {v.availableDays}</div>}
                      </div>
                      <span className={`badge ${v.status === 'PENDING' ? 'badge-yellow' : v.status === 'ACTIVE' ? 'badge-green' : 'badge-gray'}`}>
                        {v.status === 'PENDING' ? 'На рассмотрении' : v.status === 'ACTIVE' ? 'Одобрена' : v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Настройки */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Смена пароля */}
                <div className="card">
                  <div className="card-title" style={{ marginBottom: 16 }}>🔒 Изменить пароль</div>
                  {pwdSaved && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ Открыт портал Keycloak для смены пароля</div>}
                  {pwdError && <div className="alert alert-danger" style={{ marginBottom: 16 }}>⚠️ {pwdError}</div>}
                  <form onSubmit={handlePwdChange}>
                    <div className="form-group">
                      <label className="form-label">Текущий пароль *</label>
                      <input className="form-control" type="password" value={pwdForm.current}
                        onChange={e => setPwdForm(f => ({ ...f, current: e.target.value }))} placeholder="Введите текущий пароль" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Новый пароль *</label>
                      <input className="form-control" type="password" value={pwdForm.next}
                        onChange={e => setPwdForm(f => ({ ...f, next: e.target.value }))} placeholder="Не менее 8 символов" />
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ color: pwdForm.next.length >= 8 ? 'var(--success)' : 'inherit' }}>• Не менее 8 символов</span>
                        <span style={{ color: /[A-Z]/.test(pwdForm.next) ? 'var(--success)' : 'inherit' }}>• Заглавная буква</span>
                        <span style={{ color: /[0-9]/.test(pwdForm.next) ? 'var(--success)' : 'inherit' }}>• Цифра</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Подтверждение пароля *</label>
                      <input className={`form-control${pwdForm.confirm && pwdForm.confirm !== pwdForm.next ? ' is-invalid' : ''}`}
                        type="password" value={pwdForm.confirm}
                        onChange={e => setPwdForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Повторите новый пароль" />
                    </div>
                    <button type="submit" className="btn btn-primary">Изменить пароль</button>
                  </form>
                </div>

                {/* Аккаунт Keycloak */}
                <div className="card">
                  <div className="card-title" style={{ marginBottom: 12 }}>🔗 Управление аккаунтом</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
                    Для изменения email и других настроек безопасности используйте портал Keycloak.
                  </p>
                  <button className="btn btn-secondary"
                    onClick={() => window.open('http://localhost:8180/realms/orphanage/account', '_blank')}>
                    🔗 Открыть настройки аккаунта
                  </button>
                </div>

                {/* Опасная зона */}
                <div className="card" style={{ borderColor: 'var(--danger)' }}>
                  <div className="card-title" style={{ marginBottom: 12, color: 'var(--danger)' }}>⚠️ Опасная зона</div>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>
                    Выйти из всех устройств
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
