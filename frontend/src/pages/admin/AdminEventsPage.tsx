import { useState } from 'react'
import { eventsStore } from '../../store/dataStore'

const EMPTY = { title: '', description: '', eventDate: '', location: '', maxParticipants: 50 }

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function AdminEventsPage() {
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)

  const events = eventsStore.getAll()

  const openCreate = () => { setForm(EMPTY); setModal('create') }
  const openEdit = (ev: any) => {
    setEditing(ev)
    setForm({ ...ev, eventDate: ev.eventDate?.slice(0, 16) })
    setModal('edit')
  }

  const handleDelete = (id: number) => {
    if (!confirm('Удалить мероприятие?')) return
    eventsStore.remove(id)
    refresh()
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (modal === 'create') {
      eventsStore.add({ ...form, registered: 0 })
    } else {
      eventsStore.update(editing.id, form)
    }
    refresh()
    setModal(null)
  }

  const downloadReport = () => {
    const rows = events.map((e: any) =>
      `${e.title}\nДата: ${formatDate(e.eventDate)}\nМесто: ${e.location}\nУчастников: ${e.registered ?? 0}/${e.maxParticipants}\n`
    ).join('\n')
    const content = `ОТЧЁТ ПО МЕРОПРИЯТИЯМ\nСформирован: ${new Date().toLocaleString('ru-RU')}\n\n${rows}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'events_report.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="admin-header">
        <h2>📅 Управление мероприятиями</h2>
        <p>Создание и редактирование событий, управление записями участников</p>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={openCreate}>+ Создать мероприятие</button>
        <button className="btn btn-secondary" onClick={downloadReport}>📄 Скачать отчёт</button>
      </div>

      {events.length === 0 && (
        <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-title">Нет мероприятий</div></div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {events.map((ev: any) => {
          const pct = ev.maxParticipants > 0 ? Math.round(((ev.registered ?? 0) / ev.maxParticipants) * 100) : 0
          return (
            <div key={ev.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{ev.title}</h3>
                  <div style={{ display: 'flex', gap: 20, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8, flexWrap: 'wrap' }}>
                    {ev.eventDate && <span>📅 {formatDate(ev.eventDate)}</span>}
                    {ev.location && <span>📍 {ev.location}</span>}
                    <span>👥 {ev.registered ?? 0}/{ev.maxParticipants}</span>
                  </div>
                  {ev.description && <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>{ev.description}</p>}
                  <div className="progress-bar" style={{ margin: 0, width: 300 }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{pct}% заполнено</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 16 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(ev)}>✏️ Редактировать</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev.id)}>🗑️</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal === 'create' ? '➕ Новое мероприятие' : '✏️ Редактировать'}</div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Название *</label>
                <input className="form-control" required value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Описание</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Дата и время *</label>
                  <input className="form-control" type="datetime-local" required value={form.eventDate} onChange={e => setForm((f: any) => ({ ...f, eventDate: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Макс. участников</label>
                  <input className="form-control" type="number" min="1" value={form.maxParticipants} onChange={e => setForm((f: any) => ({ ...f, maxParticipants: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Место проведения</label>
                <input className="form-control" value={form.location} onChange={e => setForm((f: any) => ({ ...f, location: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary">{modal === 'create' ? 'Создать' : 'Сохранить'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
