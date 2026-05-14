import { useState } from 'react'
import keycloak from '../../keycloak'
import { Link } from 'react-router-dom'
import { childrenStore, eventsStore, requestsStore, volunteersStore, needsStore } from '../../store/dataStore'

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

  // Живые данные из stores
  const children = childrenStore.getAll()
  const events = eventsStore.getAll()
  const requests = requestsStore.getAll()
  const volunteers = volunteersStore.getAll()
  const needs = needsStore.getAll()

  const inShelter = children.filter((c: any) => c.status === 'IN_SHELTER').length
  const newRequests = requests.filter((r: any) => r.status === 'NEW').length
  const pendingVolunteers = volunteers.filter((v: any) => v.status === 'PENDING').length
  const activeVolunteers = volunteers.filter((v: any) => v.status === 'ACTIVE').length
  const urgentNeeds = needs.filter((n: any) => n.priority === 'HIGH').length
  const upcomingEvents = events.filter((e: any) => new Date(e.eventDate) > new Date()).length

  const STATS = [
    { icon: '👶', label: 'Воспитанников', value: String(inShelter), sub: `Всего: ${children.length}`, color: '#7c3aed', to: '/admin/children' },
    { icon: '📋', label: 'Новых заявок', value: String(newRequests), sub: `Всего заявок: ${requests.length}`, color: '#06b6d4', to: '/admin/applications' },
    { icon: '🤝', label: 'Активных волонтёров', value: String(activeVolunteers), sub: `${pendingVolunteers} ожидают одобрения`, color: '#10b981', to: '/admin/volunteers' },
    { icon: '📦', label: 'Срочных потребностей', value: String(urgentNeeds), sub: `Предстоящих событий: ${upcomingEvents}`, color: '#f59e0b', to: '/admin/needs' },
  ]

  // Данные для графика заявок
  const reviewRequests = requests.filter((r: any) => r.status === 'REVIEW').length
  const approvedRequests = requests.filter((r: any) => r.status === 'APPROVED').length
  const rejectedRequests = requests.filter((r: any) => r.status === 'REJECTED').length
  const totalReq = Math.max(requests.length, 1)

  const reminders = [
    newRequests > 0 && `${newRequests} заявок ожидают первичного рассмотрения`,
    pendingVolunteers > 0 && `${pendingVolunteers} волонтёров ожидают одобрения`,
    urgentNeeds > 0 && `${urgentNeeds} позиций помечены как срочные потребности`,
  ].filter(Boolean) as string[]

  return (
    <div>
      <div className="admin-header">
        <h2>📊 Дашборд</h2>
        <p>Добро пожаловать, <strong>{username}</strong>! Обзор системы в реальном времени.</p>
      </div>

      {/* Live stats */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        {STATS.map(s => (
          <Link key={s.label} to={s.to} className="card stat-card"
            style={{ border: `1px solid ${s.color}30`, textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{s.label}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.sub}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Recent actions */}
          <div className="card">
            <div className="card-header"><div className="card-title">🕐 Последние события</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {RECENT_ACTIONS.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '12px 0',
                  borderBottom: i < RECENT_ACTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'flex-start',
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {ICONS[a.type]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>{a.text}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requests chart */}
          <div className="card">
            <div className="card-header"><div className="card-title">📈 Заявки по статусам</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Новые', newRequests, '#06b6d4'],
                ['На рассмотрении', reviewRequests, '#f59e0b'],
                ['Одобрены', approvedRequests, '#10b981'],
                ['Отклонены', rejectedRequests, '#ef4444'],
              ].map(([label, count, color]) => (
                <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 120, fontSize: 14, color: 'var(--text-secondary)' }}>{label}</div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 20, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.max(2, ((count as number) / totalReq) * 100)}%`,
                      height: '100%', background: color as string,
                      borderRadius: 4, transition: 'width 0.5s',
                    }} />
                  </div>
                  <div style={{ width: 24, textAlign: 'right', fontWeight: 700, fontSize: 14 }}>{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Events overview */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📅 Ближайшие мероприятия</div>
              <Link to="/admin/events" className="btn btn-secondary btn-sm">Все →</Link>
            </div>
            {events.filter((e: any) => new Date(e.eventDate) > new Date()).slice(0, 3).map((ev: any) => {
              const pct = ev.maxParticipants > 0 ? Math.round(((ev.registered ?? 0) / ev.maxParticipants) * 100) : 0
              return (
                <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {new Date(ev.eventDate).toLocaleDateString('ru-RU')} · {ev.location}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600 }}>{ev.registered ?? 0}/{ev.maxParticipants}</div>
                    <div style={{ fontSize: 11, color: pct >= 90 ? 'var(--danger)' : 'var(--text-muted)' }}>{pct}%</div>
                  </div>
                </div>
              )
            })}
            {upcomingEvents === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: 16 }}>Нет предстоящих мероприятий</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick actions */}
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

          {/* Reminders */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))' }}>
            <div className="card-title" style={{ marginBottom: 12 }}>💡 Требует внимания</div>
            {reminders.length === 0 ? (
              <div style={{ color: 'var(--success)', fontSize: 14 }}>✅ Всё в порядке!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {reminders.map(r => (
                  <div key={r} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span>⚠️</span> <span>{r}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Needs summary */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📦 Потребности</div>
              <Link to="/admin/needs" className="btn btn-secondary btn-sm">Все →</Link>
            </div>
            {needs.filter((n: any) => n.priority === 'HIGH').slice(0, 3).map((n: any) => {
              const pct = n.quantityNeeded > 0 ? Math.round((n.quantityCurrent / n.quantityNeeded) * 100) : 0
              return (
                <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{n.itemName}</span>
                    <span className="badge badge-red" style={{ fontSize: 10 }}>Срочно</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: 2 }} />
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{n.quantityCurrent}/{n.quantityNeeded} шт.</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
