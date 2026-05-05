import { useState } from 'react'
import { childrenStore } from '../../store/dataStore'

const STATUS_OPTS: Record<string, string> = {
  IN_SHELTER: 'В учреждении', UNDER_GUARDIANSHIP: 'Под опекой',
  ADOPTED: 'Усыновлён', RETURNED: 'Возвращён'
}
const STATUS_COLORS: Record<string, string> = {
  IN_SHELTER: 'badge-blue', UNDER_GUARDIANSHIP: 'badge-yellow',
  ADOPTED: 'badge-green', RETURNED: 'badge-red'
}
const getAge = (birthDate: string) => {
  const d = new Date(birthDate), today = new Date()
  return today.getFullYear() - d.getFullYear() -
    (today < new Date(today.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0)
}
const EMPTY = { firstName: '', lastName: '', middleName: '', birthDate: '', gender: 'MALE', status: 'IN_SHELTER', roomNumber: '', description: '' }

export default function AdminChildrenPage() {
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)

  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)

  const children = childrenStore.getAll().filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => { setForm(EMPTY); setModal('create') }
  const openEdit = (c: any) => { setEditing(c); setForm({ ...c }); setModal('edit') }

  const handleDelete = (id: number) => {
    if (!confirm('Удалить запись?')) return
    childrenStore.remove(id)
    refresh()
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (modal === 'create') {
      childrenStore.add(form)
    } else {
      childrenStore.update(editing.id, form)
    }
    refresh()
    setModal(null)
  }

  return (
    <div>
      <div className="admin-header">
        <h2>👶 Управление воспитанниками</h2>
        <p>Создание, редактирование и просмотр карточек детей</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <input className="search-input" placeholder="🔍 Поиск по имени..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ flex: 1, maxWidth: 360 }} />
        <button className="btn btn-primary" onClick={openCreate}>+ Добавить воспитанника</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Имя</th><th>Дата рождения</th><th>Возраст</th><th>Пол</th><th>Статус</th><th>Комната</th><th>Действия</th>
            </tr></thead>
            <tbody>
              {children.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Нет данных</td></tr>
              ) : children.map((c: any) => (
                <tr key={c.id}>
                  <td><span style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</span></td>
                  <td>{c.birthDate ? new Date(c.birthDate).toLocaleDateString('ru-RU') : '—'}</td>
                  <td>{c.birthDate ? getAge(c.birthDate) + ' лет' : '—'}</td>
                  <td>{c.gender === 'MALE' ? '👦 М' : '👧 Ж'}</td>
                  <td><span className={`badge ${STATUS_COLORS[c.status] ?? 'badge-gray'}`}>{STATUS_OPTS[c.status] ?? c.status}</span></td>
                  <td>{c.roomNumber || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal === 'create' ? '➕ Добавить воспитанника' : '✏️ Редактировать карточку'}</div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Имя *</label>
                  <input className="form-control" required value={form.firstName} onChange={e => setForm((f: any) => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Фамилия *</label>
                  <input className="form-control" required value={form.lastName} onChange={e => setForm((f: any) => ({ ...f, lastName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Отчество</label>
                  <input className="form-control" value={form.middleName} onChange={e => setForm((f: any) => ({ ...f, middleName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Дата рождения *</label>
                  <input className="form-control" type="date" required value={form.birthDate} onChange={e => setForm((f: any) => ({ ...f, birthDate: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Пол</label>
                  <select className="form-control" value={form.gender} onChange={e => setForm((f: any) => ({ ...f, gender: e.target.value }))}>
                    <option value="MALE">👦 Мальчик</option>
                    <option value="FEMALE">👧 Девочка</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Статус</label>
                  <select className="form-control" value={form.status} onChange={e => setForm((f: any) => ({ ...f, status: e.target.value }))}>
                    {Object.entries(STATUS_OPTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Номер комнаты</label>
                  <input className="form-control" value={form.roomNumber} onChange={e => setForm((f: any) => ({ ...f, roomNumber: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Описание</label>
                <textarea className="form-control" rows={3} value={form.description}
                  onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                  placeholder="Краткая характеристика..." />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary">{modal === 'create' ? 'Добавить' : 'Сохранить'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
