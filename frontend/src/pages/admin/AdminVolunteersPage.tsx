import { useState } from 'react'
import { volunteersStore } from '../../store/dataStore'

const STATUSES: Record<string, { label: string; color: string }> = {
  PENDING:  { label: 'Ожидает',   color: 'badge-yellow' },
  ACTIVE:   { label: 'Активен',   color: 'badge-green'  },
  REJECTED: { label: 'Отклонён', color: 'badge-red'    },
  INACTIVE: { label: 'Неактивен', color: 'badge-gray'   },
}

export default function AdminVolunteersPage() {
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [comment, setComment] = useState('')
  const [newStatus, setNewStatus] = useState('')

  const volunteers = volunteersStore.getAll()
  const filtered = volunteers.filter((v: any) => !filter || v.status === filter)

  const updateStatus = (id: number, status: string) => {
    volunteersStore.update(id, { status })
    refresh()
  }

  const remove = (id: number) => {
    if (!confirm('Удалить волонтёра из системы?')) return
    volunteersStore.remove(id)
    refresh()
  }

  const handleSave = () => {
    if (!selected) return
    volunteersStore.update(selected.id, {
      status: newStatus || selected.status,
      adminComment: comment,
    })
    refresh()
    setSelected(null)
  }

  const pendingCount = volunteers.filter((v: any) => v.status === 'PENDING').length

  return (
    <div>
      <div className="admin-header">
        <h2>🤝 Управление волонтёрами</h2>
        <p>Рассмотрение заявок и управление волонтёрами · Всего: {volunteers.length}</p>
      </div>

      {pendingCount > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 20 }}>
          ⚠️ <strong>{pendingCount}</strong> {pendingCount === 1 ? 'заявка ожидает' : 'заявок ожидают'} рассмотрения
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['', 'Все'], ...Object.entries(STATUSES).map(([k, v]) => [k, v.label])].map(([val, label]) => (
          <button key={val} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(val)}>{label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤝</div>
          <div className="empty-title">Волонтёров нет</div>
          <div className="empty-text">Заявки на волонтёрство появятся здесь</div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Имя</th><th>Контакты</th><th>Навыки</th><th>Дни</th>
                <th>Статус</th><th>Дата заявки</th><th>Действия</th>
              </tr></thead>
              <tbody>
                {filtered.map((v: any) => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                    <td>
                      <div style={{ fontSize: 13 }}>{v.email}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.phone}</div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 160 }}>{v.skills}</td>
                    <td style={{ fontSize: 13 }}>{v.availableDays}</td>
                    <td><span className={`badge ${STATUSES[v.status]?.color ?? 'badge-gray'}`}>{STATUSES[v.status]?.label ?? v.status}</span></td>
                    <td style={{ fontSize: 13 }}>{v.createdAt}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary btn-sm"
                          onClick={() => { setSelected(v); setComment(v.adminComment ?? ''); setNewStatus(v.status) }}>
                          Открыть
                        </button>
                        {v.status === 'PENDING' && <>
                          <button className="btn btn-success btn-sm" onClick={() => updateStatus(v.id, 'ACTIVE')} title="Одобрить">✅</button>
                          <button className="btn btn-danger btn-sm" onClick={() => updateStatus(v.id, 'REJECTED')} title="Отклонить">❌</button>
                        </>}
                        {v.status === 'ACTIVE' && (
                          <button className="btn btn-secondary btn-sm" onClick={() => updateStatus(v.id, 'INACTIVE')} title="Приостановить">⏸</button>
                        )}
                        {v.status === 'INACTIVE' && (
                          <button className="btn btn-success btn-sm" onClick={() => updateStatus(v.id, 'ACTIVE')} title="Восстановить">▶</button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => remove(v.id)} title="Удалить">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">🤝 Волонтёр: {selected.name}</div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="card" style={{ padding: 16, background: 'rgba(255,255,255,0.03)', marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
                {[
                  ['Имя', selected.name],
                  ['Email', selected.email],
                  ['Телефон', selected.phone || '—'],
                  ['Дата заявки', selected.createdAt],
                  ['Навыки', selected.skills],
                  ['Доступные дни', selected.availableDays],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}: </span>{v}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Изменить статус</label>
              <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {Object.entries(STATUSES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Комментарий сотрудника</label>
              <textarea className="form-control" rows={3} value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Добавьте комментарий или инструкции..." />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={handleSave}>Сохранить изменения</button>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
