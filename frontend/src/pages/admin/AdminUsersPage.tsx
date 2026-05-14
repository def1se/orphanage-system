import { useState } from 'react'
import { lsGet, lsSet } from '../../store/localStorage'

// Храним пользователей в localStorage для персистентности
const USERS_KEY = 'admin_users'
const INITIAL_USERS = [
  { id: '1', username: 'admin', email: 'admin@shelter.ru', role: 'ROLE_ADMIN', isEnabled: true, createdAt: '2026-01-01' },
  { id: '2', username: 'staff1', email: 'staff@shelter.ru', role: 'ROLE_STAFF', isEnabled: true, createdAt: '2026-02-10' },
  { id: '3', username: 'ivan_ivanov', email: 'ivan@mail.ru', role: 'ROLE_USER', isEnabled: true, createdAt: '2026-04-01' },
  { id: '4', username: 'maria_v', email: 'maria@mail.ru', role: 'ROLE_USER', isEnabled: true, createdAt: '2026-04-20' },
  { id: '5', username: 'volunteer1', email: 'vol@mail.ru', role: 'ROLE_VOLUNTEER', isEnabled: false, createdAt: '2026-05-01' },
]

const getUsers = () => lsGet(USERS_KEY, INITIAL_USERS)
const saveUsers = (users: any[]) => lsSet(USERS_KEY, users)

const ROLES: Record<string, string> = {
  ROLE_USER: 'Пользователь',
  ROLE_VOLUNTEER: 'Волонтёр',
  ROLE_STAFF: 'Сотрудник',
  ROLE_DIRECTOR: 'Директор',
  ROLE_ADMIN: 'Администратор'
}

export default function AdminUsersPage() {
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', email: '', role: 'ROLE_USER' })
  const [saveMsg, setSaveMsg] = useState('')

  const users = getUsers()

  const filtered = users.filter((u: any) => {
    const q = search.toLowerCase()
    if (q && !u.username.includes(q) && !u.email.includes(q)) return false
    if (roleFilter && u.role !== roleFilter) return false
    return true
  })

  const toggleEnabled = (id: string) => {
    const updated = users.map((u: any) => u.id === id ? { ...u, isEnabled: !u.isEnabled } : u)
    saveUsers(updated)
    showMsg(users.find((u: any) => u.id === id)?.isEnabled ? '🔒 Пользователь заблокирован' : '🔓 Пользователь разблокирован')
    refresh()
  }

  const changeRole = (id: string, role: string) => {
    const updated = users.map((u: any) => u.id === id ? { ...u, role } : u)
    saveUsers(updated)
    showMsg('✅ Роль изменена')
    refresh()
  }

  const remove = (id: string) => {
    if (!confirm('Удалить пользователя? Это действие необратимо.')) return
    saveUsers(users.filter((u: any) => u.id !== id))
    refresh()
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date().toISOString().slice(0, 10)
    const added = [...users, { ...newUser, id: String(Date.now()), isEnabled: true, createdAt: today }]
    saveUsers(added)
    setShowAddModal(false)
    setNewUser({ username: '', email: '', role: 'ROLE_USER' })
    showMsg('✅ Пользователь добавлен')
    refresh()
  }

  const showMsg = (msg: string) => {
    setSaveMsg(msg)
    setTimeout(() => setSaveMsg(''), 2500)
  }

  return (
    <div>
      <div className="admin-header">
        <h2>👥 Управление пользователями</h2>
        <p>Просмотр, блокировка и управление ролями пользователей · Всего: {users.length}</p>
      </div>

      {saveMsg && <div className="alert alert-success" style={{ marginBottom: 16 }}>{saveMsg}</div>}

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input className="search-input" placeholder="Поиск по логину / email..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
          <select className="filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">Все роли</option>
            {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Добавить пользователя</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Пользователь</th><th>Email</th><th>Роль</th>
              <th>Статус</th><th>Зарегистрирован</th><th>Действия</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Нет данных</td></tr>
              ) : filtered.map((u: any) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>@{u.username}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{u.email}</td>
                  <td>
                    <select className="filter-select" style={{ padding: '4px 8px', fontSize: 13 }}
                      value={u.role} onChange={e => changeRole(u.id, e.target.value)}>
                      {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.isEnabled ? 'badge-green' : 'badge-red'}`}>
                      {u.isEnabled ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{u.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className={`btn btn-sm ${u.isEnabled ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => toggleEnabled(u.id)}>
                        {u.isEnabled ? '🔒 Блок.' : '🔓 Разблок.'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add user modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">➕ Добавить пользователя</div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Логин *</label>
                <input className="form-control" required value={newUser.username}
                  onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))}
                  placeholder="ivan_ivanov" />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-control" type="email" required value={newUser.email}
                  onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
                  placeholder="user@mail.ru" />
              </div>
              <div className="form-group">
                <label className="form-label">Роль</label>
                <select className="form-control" value={newUser.role}
                  onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}>
                  {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary">Добавить</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
