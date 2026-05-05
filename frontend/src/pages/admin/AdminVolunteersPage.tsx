import { useState } from 'react'

const MOCK_VOLUNTEERS = [
  { id: 1, name: 'Анна Петрова', email: 'anna@mail.ru', phone: '+7 900 111-00-01', skills: 'Педагогика, творчество', availableDays: 'Сб, Вс', status: 'PENDING', createdAt: '2026-05-01' },
  { id: 2, name: 'Дмитрий Соколов', email: 'dmitry@mail.ru', phone: '+7 900 111-00-02', skills: 'Спорт, футбол', availableDays: 'Пн, Ср, Пт', status: 'ACTIVE', createdAt: '2026-04-15' },
  { id: 3, name: 'Елена Морозова', email: 'elena@mail.ru', phone: '+7 900 111-00-03', skills: 'Психология, арт-терапия', availableDays: 'Вт, Чт', status: 'ACTIVE', createdAt: '2026-04-01' },
  { id: 4, name: 'Иван Козлов', email: 'ivan@mail.ru', phone: '+7 900 111-00-04', skills: 'IT, программирование', availableDays: 'Сб', status: 'PENDING', createdAt: '2026-05-03' },
]
const STATUSES: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Ожидает', color: 'badge-yellow' },
  ACTIVE: { label: 'Активен', color: 'badge-green' },
  REJECTED: { label: 'Отклонён', color: 'badge-red' },
  INACTIVE: { label: 'Неактивен', color: 'badge-gray' },
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState(MOCK_VOLUNTEERS)
  const [filter, setFilter] = useState('')

  const updateStatus = (id: number, status: string) =>
    setVolunteers(vs => vs.map(v => v.id === id ? { ...v, status } : v))
  const remove = (id: number) => { if (confirm('Удалить волонтёра?')) setVolunteers(vs => vs.filter(v => v.id !== id)) }

  const filtered = volunteers.filter(v => !filter || v.status === filter)

  return (
    <div>
      <div className="admin-header">
        <h2>🤝 Управление волонтёрами</h2>
        <p>Рассмотрение заявок и управление волонтёрами</p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['', 'Все'], ...Object.entries(STATUSES).map(([k, v]) => [k, v.label])].map(([val, label]) => (
          <button key={val} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Имя</th><th>Контакты</th><th>Навыки</th><th>Дни</th><th>Статус</th><th>Дата</th><th>Действия</th></tr></thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{v.email}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.phone}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{v.skills}</td>
                  <td style={{ fontSize: 13 }}>{v.availableDays}</td>
                  <td><span className={`badge ${STATUSES[v.status]?.color}`}>{STATUSES[v.status]?.label}</span></td>
                  <td style={{ fontSize: 13 }}>{v.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {v.status === 'PENDING' && <>
                        <button className="btn btn-success btn-sm" onClick={() => updateStatus(v.id, 'ACTIVE')}>✅</button>
                        <button className="btn btn-danger btn-sm" onClick={() => updateStatus(v.id, 'REJECTED')}>❌</button>
                      </>}
                      {v.status === 'ACTIVE' && <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(v.id, 'INACTIVE')}>⏸</button>}
                      <button className="btn btn-danger btn-sm" onClick={() => remove(v.id)}>🗑️</button>
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
