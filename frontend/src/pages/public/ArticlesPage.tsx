import { useState } from 'react'
import { articlesStore } from '../../store/dataStore'
import { lsGet, lsSet } from '../../store/localStorage'

const CATS: Record<string, string> = { NEWS: 'Новости', GUIDE: 'Руководство', STORY: 'История', ANNOUNCEMENT: 'Объявление' }
const CAT_COLORS: Record<string, string> = { NEWS: 'badge-blue', GUIDE: 'badge-purple', STORY: 'badge-green', ANNOUNCEMENT: 'badge-yellow' }
const CAT_ICONS: Record<string, string> = { NEWS: '📰', GUIDE: '📖', STORY: '💛', ANNOUNCEMENT: '📢' }

// Счётчик просмотров через localStorage
const VIEWS_KEY = 'article_views'
const getViews = (): Record<number, number> => lsGet(VIEWS_KEY, {})
const incrementView = (id: number) => {
  const v = getViews()
  lsSet(VIEWS_KEY, { ...v, [id]: (v[id] ?? 0) + 1 })
}

// Моковые авторы для демо
const AUTHORS: Record<number, string> = {
  1: 'Мария Иванова, специалист по усыновлению',
  2: 'Редакция ЦССВ «Светлый путь»',
  3: 'Алексей Петров, юрист',
}

const COVER_GRADIENTS = [
  'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(6,182,212,0.4))',
  'linear-gradient(135deg, rgba(236,72,153,0.6), rgba(124,58,237,0.4))',
  'linear-gradient(135deg, rgba(16,185,129,0.6), rgba(6,182,212,0.4))',
]

export default function ArticlesPage() {
  const [catFilter, setCatFilter] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [, rerender] = useState(0)

  const allArticles = articlesStore.getAll().filter((a: any) => a.isPublished)
  const filtered = allArticles.filter((a: any) => !catFilter || a.category === catFilter)
  const views = getViews()

  const openArticle = (a: any) => {
    incrementView(a.id)
    setSelected(a)
    rerender(n => n + 1)
  }

  const formatDate = (d: string) => {
    if (!d) return ''
    try { return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return d }
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <div className="hero-badge">Статьи и публикации</div>
          <h1>📰 Статьи и новости</h1>
          <p>Полезные материалы об усыновлении, жизни детского дома и способах помощи.</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {(['', 'NEWS', 'GUIDE', 'ANNOUNCEMENT', 'STORY'] as const).map(c => (
              <button key={c} className={`btn ${catFilter === c ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setCatFilter(c)}>
                {c ? `${CAT_ICONS[c]} ${CATS[c]}` : 'Все'}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <div className="empty-title">Статей нет</div>
              <div className="empty-text">По данной категории публикаций не найдено</div>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map((a: any, idx: number) => (
                <div key={a.id} className="card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden' }}
                  onClick={() => openArticle(a)}>
                  {/* Cover */}
                  <div style={{
                    height: 140, background: COVER_GRADIENTS[idx % COVER_GRADIENTS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56,
                  }}>
                    {CAT_ICONS[a.category] ?? '📄'}
                  </div>
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${CAT_COLORS[a.category] ?? 'badge-gray'}`}>{CATS[a.category] ?? a.category}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(a.publishedAt)}</span>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>{a.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, flex: 1 }}>{a.summary}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>👁 {(views[a.id] ?? 0) + 1} просм.</span>
                      <button className="btn btn-outline btn-sm">Читать →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                <span className={`badge ${CAT_COLORS[selected.category] ?? 'badge-gray'}`}>
                  {CAT_ICONS[selected.category]} {CATS[selected.category]}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(selected.publishedAt)}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>· 👁 {views[selected.id] ?? 1} просм.</span>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <h2 style={{ marginBottom: 12, fontSize: 22, lineHeight: 1.4 }}>{selected.title}</h2>

            {/* Автор */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 14px', background: 'rgba(124,58,237,0.06)', borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                ✍️
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{AUTHORS[selected.id] ?? 'Редакция ЦССВ'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Автор публикации</div>
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 16, fontSize: 15, whiteSpace: 'pre-wrap' }}>
              {selected.content}
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>ЦССВ «Светлый путь» · {formatDate(selected.publishedAt)}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
