import { useState } from 'react'
import keycloak from '../../keycloak'

const MOCK_EVENTS = [
  { id: 1, title: 'День открытых дверей', description: 'Приглашаем всех желающих познакомиться с нашим учреждением, воспитанниками и педагогами. Экскурсия по корпусам, встреча с психологом.', eventDate: '2026-06-15T10:00:00', location: 'ЦССВ «Светлый Путь», главный корпус', maxParticipants: 50, registered: 23 },
  { id: 2, title: 'Благотворительный концерт', description: 'Воспитанники детского дома покажут театральную постановку. Сбор средств на летний лагерь. Вход свободный, принимаются добровольные пожертвования.', eventDate: '2026-06-20T18:00:00', location: 'ДК «Россия», зал №1', maxParticipants: 200, registered: 145 },
  { id: 3, title: 'Мастер-класс по рисованию', description: 'Совместный мастер-класс для детей и потенциальных опекунов. Отличная возможность познакомиться с воспитанниками в непринуждённой обстановке.', eventDate: '2026-07-05T12:00:00', location: 'Арт-студия ЦССВ', maxParticipants: 20, registered: 8 },
  { id: 4, title: 'Спортивный праздник', description: 'Ежегодный день спорта. Эстафеты, конкурсы, весёлые старты. Волонтёры-инструкторы помогают организовать командные игры.', eventDate: '2026-07-12T10:00:00', location: 'Стадион ЦССВ', maxParticipants: 100, registered: 34 },
]

export default function EventsPage() {
  const [registering, setRegistering] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const isAuth = keycloak.authenticated
  const parsed = keycloak.tokenParsed as any

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setRegistering(null); setForm({ name: '', email: '', phone: '', notes: '' }) }, 2000)
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const spotsLeft = (e: any) => e.maxParticipants - (e.registered ?? 0)

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>📅 Мероприятия</h1>
          <p>Присоединяйтесь к событиям нашего детского дома — каждое мероприятие это возможность помочь и познакомиться с детьми.</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {MOCK_EVENTS.map(ev => {
              const left = spotsLeft(ev)
              const pct = Math.round(((ev.registered ?? 0) / ev.maxParticipants) * 100)
              return (
                <div key={ev.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
                  <div>
                    <div className="event-date">📅 {formatDate(ev.eventDate)}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0' }}>{ev.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>{ev.description}</p>
                    <div className="event-meta">
                      <span>📍 {ev.location}</span>
                      <span>👥 {ev.registered}/{ev.maxParticipants} участников</span>
                    </div>
                    <div className="need-card" style={{ margin: '12px 0 0', background: 'none', border: 'none', padding: 0 }}>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div style={{ fontSize: 12, color: left <= 5 ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {left <= 0 ? '🔴 Мест нет' : left <= 5 ? `⚠️ Осталось ${left} мест` : `✅ Свободно ${left} мест`}
                      </div>
                    </div>
                  </div>
                  <div style={{ minWidth: 160 }}>
                    {left > 0 ? (
                      <button className="btn btn-primary" onClick={() => {
                        if (!isAuth) { keycloak.login(); return }
                        setRegistering(ev.id)
                        setForm(f => ({ ...f, name: parsed?.name ?? '', email: parsed?.email ?? '' }))
                      }}>
                        Записаться
                      </button>
                    ) : (
                      <div className="badge badge-red">Мест нет</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {registering && (
        <div className="modal-overlay" onClick={() => setRegistering(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h3 style={{ marginBottom: 8 }}>Вы успешно записаны!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Подтверждение будет отправлено на вашу почту.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-title">Запись на мероприятие</div>
                  <button className="modal-close" onClick={() => setRegistering(null)}>✕</button>
                </div>
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label className="form-label">Ваше имя *</label>
                    <input className="form-control" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Иванов Иван Иванович" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-control" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="example@mail.ru" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Телефон</label>
                    <input className="form-control" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+7 (900) 000-00-00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Примечания</label>
                    <textarea className="form-control" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Особые пожелания или вопросы..." />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Записываем...' : 'Подтвердить запись'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
