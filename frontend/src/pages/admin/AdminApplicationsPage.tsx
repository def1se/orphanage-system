import { useState } from 'react'
import { requestsStore } from '../../store/dataStore'

const STATUSES: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Новая', color: 'badge-blue' },
  REVIEW: { label: 'На рассмотрении', color: 'badge-yellow' },
  APPROVED: { label: 'Одобрена', color: 'badge-green' },
  REJECTED: { label: 'Отклонена', color: 'badge-red' },
  CLOSED: { label: 'Закрыта', color: 'badge-gray' },
}
const TYPES: Record<string, string> = {
  ACQUAINTANCE: '👋 Знакомство',
  GUARDIANSHIP: '🤝 Опека',
  ADOPTION: '❤️ Усыновление',
}

export default function AdminApplicationsPage() {
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)

  const [selected, setSelected] = useState<any>(null)
  const [comment, setComment] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const allRequests = requestsStore.getAll()
  const filtered = allRequests.filter((a: any) => !statusFilter || a.status === statusFilter)

  const handleUpdate = () => {
    if (!selected) return
    requestsStore.update(selected.id, {
      status: newStatus || selected.status,
      adminComment: comment,
    })
    refresh()
    setSelected(null)
  }

  return (
    <div>
      <div className="admin-header">
        <h2>📋 Заявки на устройство</h2>
        <p>Управление заявками на знакомство, опеку и усыновление</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['', 'Все'], ...Object.entries(STATUSES).map(([k, v]) => [k, v.label])].map(([val, label]) => (
          <button key={val} className={`btn btn-sm ${statusFilter === val ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter(val)}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">Заявок нет</div>
          <div className="empty-text">Когда пользователи оставят заявки — они появятся здесь</div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Заявитель</th><th>Тип</th>
                  <th>Ребёнок</th><th>Статус</th><th>Дата</th><th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a: any) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.applicantLastName} {a.applicantFirstName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.applicantEmail}</div>
                    </td>
                    <td>{TYPES[a.requestType] ?? a.requestType}</td>
                    <td>{a.childName ?? '—'}</td>
                    <td>
                      <span className={`badge ${STATUSES[a.status]?.color ?? 'badge-gray'}`}>
                        {STATUSES[a.status]?.label ?? a.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{a.createdAt}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm"
                        onClick={() => { setSelected(a); setComment(a.adminComment ?? ''); setNewStatus(a.status) }}>
                        Открыть
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Заявка #{selected.id}</div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="card" style={{ padding: 16, background: 'rgba(255,255,255,0.03)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>ДАННЫЕ ЗАЯВИТЕЛЯ</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Имя: </span>{selected.applicantFirstName} {selected.applicantLastName}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Тип: </span>{TYPES[selected.requestType] ?? selected.requestType}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Телефон: </span>{selected.applicantPhone || '—'}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Email: </span>{selected.applicantEmail}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Ребёнок: </span>{selected.childName ?? 'Не указан'}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Дата: </span>{selected.createdAt}</div>
              </div>
              {selected.message && (
                <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-card)', borderRadius: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  💬 {selected.message}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Изменить статус</label>
              <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Комментарий сотрудника</label>
              <textarea className="form-control" rows={3} value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Добавьте комментарий или инструкции для заявителя..." />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={handleUpdate}>Сохранить изменения</button>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
