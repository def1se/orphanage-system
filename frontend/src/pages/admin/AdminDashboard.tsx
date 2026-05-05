import keycloak from '../../keycloak'
import { Link } from 'react-router-dom'

const STATS = [
  { icon: '👶', label: 'Воспитанников', value: '42', sub: '+2 в этом месяце', color: '#7c3aed' },
  { icon: '📋', label: 'Заявок на рассмотрении', value: '8', sub: '3 новые сегодня', color: '#06b6d4' },
  { icon: '🤝', label: 'Волонтёров', value: '34', sub: '5 ожидают одобрения', color: '#10b981' },
  { icon: '💰', label: 'Пожертвований (мес.)', value: '124 800 ₽', sub: '+18% к прошлому', color: '#f59e0b' },
]
const RECENT_ACTIONS = [
  { time: '10:24', text: 'Новая заявка от Иванова И.И. на знакомство с Алёшей', type: 'request' },
  { time: '09:45', text: 'Волонтёр Петрова А.С. зарегистрировалась на мероприятие', type: 'volunteer' },
  { time: 'Вчера', text: 'Пожертвование 5 000 ₽ от анонимного донора', type: 'donation' },
  { time: 'Вчера', text: 'Обновлена медицинская карта Кати Смирновой', type: 'medical' },
  { time: '2 дня', text: 'Создано новое мероприятие «День открытых дверей»', type: 'event' },
]
const ICONS: Record<string, string> = { request: '📋', volunteer: '🤝', donation: '💰', medical: '🏥', event: '📅' }
const QUICK_LINKS = [
  { to: '/admin/children', icon: '➕', label: 'Добавить воспитанника' },
  { to: '/admin/events', icon: '📅', label: 'Создать мероприятие' },
  { to: '/admin/articles', icon: '📰', label: 'Написать статью' },
  { to: '/admin/applications', icon: '📋', label: 'Рассмотреть заявки' },
  { to: '/admin/needs', icon: '📦', label: 'Обновить потребности' },
  { to: '/admin/volunteers', icon: '🤝', label: 'Управление волонтёрами' },
]

export default function AdminDashboard() {
  const parsed = keycloak.tokenParsed as any
  const username = parsed?.preferred_username ?? 'Пользователь'

  return (
    <div>
      <div className="admin-header">
        <h2>📊 Дашборд</h2>
        <p>Добро пожаловать, <strong>{username}</strong>! Обзор системы.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 32 }}>
        {STATS.map(s => (
          <div key={s.label} className="card stat-card" style={{ border: `1px solid ${s.color}30` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{s.label}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">🕐 Последние события</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {RECENT_ACTIONS.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < RECENT_ACTIONS.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{ICONS[a.type]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>{a.text}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">📈 Заявки по статусам</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Новые', 3, '#06b6d4'], ['На рассмотрении', 5, '#f59e0b'], ['Одобрены', 12, '#10b981'], ['Отклонены', 2, '#ef4444']].map(([label, count, color]) => (
                <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 100, fontSize: 14, color: 'var(--text-secondary)' }}>{label}</div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 20, overflow: 'hidden' }}>
                    <div style={{ width: `${(count as number / 22) * 100}%`, height: '100%', background: color as string, borderRadius: 4, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ width: 20, textAlign: 'right', fontWeight: 700, fontSize: 14 }}>{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>⚡ Быстрые действия</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_LINKS.map(l => (
                <Link key={l.to} to={l.to} className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: 10 }}>
                  <span>{l.icon}</span> {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))' }}>
            <div className="card-title" style={{ marginBottom: 12 }}>💡 Напоминания</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['5 заявок ожидают ответа более 7 дней', '3 воспитанника не проходили мед. осмотр', 'Не хватает школьных рюкзаков (15 шт.)'].map(r => (
                <div key={r} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span>⚠️</span> <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
