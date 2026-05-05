import { useState } from 'react'

const MOCK_USERS = [
  { id: '1', username: 'admin', email: 'admin@shelter.ru', role: 'ROLE_ADMIN', isEnabled: true, createdAt: '2026-01-01' },
  { id: '2', username: 'staff1', email: 'staff@shelter.ru', role: 'ROLE_STAFF', isEnabled: true, createdAt: '2026-02-10' },
  { id: '3', username: 'ivan_ivanov', email: 'ivan@mail.ru', role: 'ROLE_USER', isEnabled: true, createdAt: '2026-04-01' },
  { id: '4', username: 'maria_v', email: 'maria@mail.ru', role: 'ROLE_USER', isEnabled: true, createdAt: '2026-04-20' },
  { id: '5', username: 'volunteer1', email: 'vol@mail.ru', role: 'ROLE_VOLUNTEER', isEnabled: false, createdAt: '2026-05-01' },
]
const ROLES: Record<string, string> = { ROLE_ADMIN: '🔴 Администратор', ROLE_STAFF: '🟠 Сотрудник', ROLE_VOLUNTEER: '🟡 Волонтёр', ROLE_USER: '🟢 Пользователь', GUEST: '⚫ Гость' }
const ROLE_COLORS: Record<string, string> = { ROLE_ADMIN: 'badge-red', ROLE_STAFF: 'badge-yellow', ROLE_VOLUNTEER: 'badge-purple', ROLE_USER: 'badge-green', GUEST: 'badge-gray' }

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    if (q && !u.username.includes(q) && !u.email.includes(q)) return false
    if (roleFilter && u.role !== roleFilter) return false
    return true
  })

  const toggleEnabled = (id: string) =>
    setUsers(us => us.map(u => u.id === id ? { ...u, isEnabled: !u.isEnabled } : u))
  const changeRole = (id: string, role: string) =>
    setUsers(us => us.map(u => u.id === id ? { ...u, role } : u))
  const remove = (id: string) => { if (confirm('Удалить пользователя?')) setUsers(us => us.filter(u => u.id !== id)) }

  return (
    <div>
      <div className="admin-header">
        <h2>👥 Управление пользователями</h2>
        <p>Просмотр, блокировка и управление ролями пользователей</p>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="search-input" placeholder="🔍 Поиск..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        <select className="filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">Все роли</option>
          {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Пользователь</th><th>Email</th><th>Роль</th><th>Статус</th><th>Зарегистрирован</th><th>Действия</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>@{u.username}</td>
                  <td style={{ fontSize: 13 }}>{u.email}</td>
                  <td>
                    <select className="filter-select" style={{ padding: '4px 8px', fontSize: 13 }} value={u.role} onChange={e => changeRole(u.id, e.target.value)}>
                      {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                  <td><span className={`badge ${u.isEnabled ? 'badge-green' : 'badge-red'}`}>{u.isEnabled ? 'Активен' : 'Заблокирован'}</span></td>
                  <td style={{ fontSize: 13 }}>{u.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className={`btn btn-sm ${u.isEnabled ? 'btn-secondary' : 'btn-success'}`} onClick={() => toggleEnabled(u.id)}>
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
    </div>
  )
}
