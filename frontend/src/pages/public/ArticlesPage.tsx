import { useState } from 'react'

const MOCK_ARTICLES = [
  { id: 1, title: 'Как правильно подготовиться к усыновлению', summary: 'Подробное руководство по процессу усыновления: документы, этапы, психологическая подготовка.', category: 'GUIDE', publishedAt: '2026-05-01T10:00:00', content: 'Усыновление — это серьёзный и ответственный шаг...' },
  { id: 2, title: 'День открытых дверей — 15 июня', summary: 'Приглашаем всех желающих посетить наш детский дом и познакомиться с воспитанниками.', category: 'ANNOUNCEMENT', publishedAt: '2026-04-28T09:00:00', content: 'Приглашаем всех желающих...' },
  { id: 3, title: 'Психологическая поддержка детей в учреждениях', summary: 'О методах работы наших психологов и программах развития воспитанников.', category: 'GUIDE', publishedAt: '2026-04-20T14:00:00', content: 'Психологическое благополучие...' },
  { id: 4, title: 'Волонтёры — наши помощники', summary: 'Как стать волонтёром и что это даёт вам и детям.', category: 'NEWS', publishedAt: '2026-04-15T11:00:00', content: 'Волонтёрская деятельность...' },
  { id: 5, title: 'Опека vs усыновление: в чём разница?', summary: 'Объясняем юридические различия и помогаем сделать осознанный выбор.', category: 'GUIDE', publishedAt: '2026-04-10T10:00:00', content: 'Многие путают опеку и усыновление...' },
  { id: 6, title: 'Итоги благотворительного концерта', summary: 'Собрали 180 000 ₽ на летний лагерь для воспитанников. Спасибо всем участникам!', category: 'NEWS', publishedAt: '2026-04-05T18:00:00', content: 'Благодаря вашей поддержке...' },
]
const CATS: Record<string, string> = { NEWS: 'Новости', GUIDE: 'Руководство', STORY: 'История', ANNOUNCEMENT: 'Объявление' }
const CAT_COLORS: Record<string, string> = { NEWS: 'badge-blue', GUIDE: 'badge-purple', STORY: 'badge-green', ANNOUNCEMENT: 'badge-yellow' }

export default function ArticlesPage() {
  const [catFilter, setCatFilter] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const filtered = MOCK_ARTICLES.filter(a => !catFilter || a.category === catFilter)

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>📰 Статьи и новости</h1>
          <p>Полезные материалы об усыновлении, жизни детского дома и способах помощи.</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {['', 'NEWS', 'GUIDE', 'ANNOUNCEMENT', 'STORY'].map(c => (
              <button key={c} className={`btn ${catFilter === c ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setCatFilter(c)}>
                {c ? CATS[c] : 'Все'}
              </button>
            ))}
          </div>
          <div className="grid-3">
            {filtered.map(a => (
              <div key={a.id} className="card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}
                onClick={() => setSelected(a)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${CAT_COLORS[a.category] ?? 'badge-gray'}`}>{CATS[a.category] ?? a.category}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(a.publishedAt)}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>{a.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, flex: 1 }}>{a.summary}</p>
                <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>Читать →</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                <span className={`badge ${CAT_COLORS[selected.category] ?? 'badge-gray'}`}>{CATS[selected.category]}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(selected.publishedAt)}</span>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <h2 style={{ marginBottom: 16 }}>{selected.title}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{selected.content}</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: 12 }}>{selected.summary}</p>
          </div>
        </div>
      )}
    </>
  )
}
