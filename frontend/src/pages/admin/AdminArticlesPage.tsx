import { useState } from 'react'
import { articlesStore } from '../../store/dataStore'

const CATS: Record<string, string> = { NEWS: 'Новости', GUIDE: 'Руководство', STORY: 'История', ANNOUNCEMENT: 'Объявление' }
const CAT_COLORS: Record<string, string> = { NEWS: 'badge-blue', GUIDE: 'badge-purple', STORY: 'badge-green', ANNOUNCEMENT: 'badge-yellow' }
const EMPTY = { title: '', content: '', summary: '', category: 'NEWS', isPublished: false }

export default function AdminArticlesPage() {
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)

  const articles = articlesStore.getAll()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date().toISOString().slice(0, 10)
    if (modal === 'create') {
      articlesStore.add({ ...form, publishedAt: form.isPublished ? today : null })
    } else {
      articlesStore.update(editing.id, {
        ...form,
        publishedAt: form.isPublished ? (editing.publishedAt || today) : null
      })
    }
    refresh()
    setModal(null)
  }

  const togglePublish = (a: any) => {
    const today = new Date().toISOString().slice(0, 10)
    articlesStore.update(a.id, {
      isPublished: !a.isPublished,
      publishedAt: !a.isPublished ? today : null
    })
    refresh()
  }

  const remove = (id: number) => {
    if (!confirm('Удалить статью?')) return
    articlesStore.remove(id)
    refresh()
  }

  return (
    <div>
      <div className="admin-header">
        <h2>📰 Управление статьями</h2>
        <p>Создание и публикация новостей и полезных материалов</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal('create') }}>+ Новая статья</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Заголовок</th><th>Категория</th><th>Статус</th><th>Дата</th><th>Действия</th>
            </tr></thead>
            <tbody>
              {articles.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Нет статей</td></tr>
              ) : articles.map((a: any) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.summary}</div>
                  </td>
                  <td><span className={`badge ${CAT_COLORS[a.category] ?? 'badge-gray'}`}>{CATS[a.category] ?? a.category}</span></td>
                  <td><span className={`badge ${a.isPublished ? 'badge-green' : 'badge-gray'}`}>{a.isPublished ? 'Опубликована' : 'Черновик'}</span></td>
                  <td style={{ fontSize: 13 }}>{a.publishedAt ?? '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(a); setForm({ ...a }); setModal('edit') }}>✏️</button>
                      <button className={`btn btn-sm ${a.isPublished ? 'btn-secondary' : 'btn-success'}`} onClick={() => togglePublish(a)}>
                        {a.isPublished ? '🙈 Скрыть' : '🚀 Опубл.'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(a.id)}>🗑️</button>
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
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal === 'create' ? '➕ Новая статья' : '✏️ Редактировать'}</div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Заголовок *</label>
                <input className="form-control" required value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Краткое описание</label>
                <input className="form-control" value={form.summary} onChange={e => setForm((f: any) => ({ ...f, summary: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Категория</label>
                <select className="form-control" value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}>
                  {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Текст статьи *</label>
                <textarea className="form-control" rows={8} required value={form.content}
                  onChange={e => setForm((f: any) => ({ ...f, content: e.target.value }))}
                  placeholder="Полный текст статьи..." />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <input type="checkbox" id="pub-chk" checked={form.isPublished}
                  onChange={e => setForm((f: any) => ({ ...f, isPublished: e.target.checked }))} />
                <label htmlFor="pub-chk" style={{ fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Опубликовать сразу
                </label>
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
