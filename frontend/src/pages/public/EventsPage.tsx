import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import keycloak from '../../keycloak'
import { useAuth } from '../../hooks/useAuth'
import { eventsStore } from '../../store/dataStore'
import { eventRegistrationsStore } from '../../store/eventRegistrationsStore'

export default function EventsPage() {
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)
  const navigate = useNavigate()

  const [registering, setRegistering] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const { isAuth } = useAuth()
  const parsed = keycloak.tokenParsed as any
  const userId: string = parsed?.sub ?? ''

  const events = eventsStore.getAll()

  // Читаем все регистрации этого пользователя
  const myRegistrations = eventRegistrationsStore.getAll().filter(r => r.userId === userId)
  const myEventIds = new Set(myRegistrations.map(r => r.eventId))

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Укажите имя'
    if (!form.email.trim()) errs.email = 'Укажите email'
    if (!form.phone.trim()) errs.phone = 'Телефон обязателен'
    return errs
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registering === null) return
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    // 1. Обновляем счётчик мест
    const ev = eventsStore.getAll().find((e: any) => e.id === registering)
    if (ev) {
      eventsStore.update(registering, { registered: (ev.registered ?? 0) + 1 })
    }

    // 2. ✅ Сохраняем регистрацию в store (видна в профиле!)
    eventRegistrationsStore.add({
      eventId: registering,
      userId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      notes: form.notes,
      registeredAt: new Date().toLocaleDateString('ru-RU'),
      eventTitle: ev?.title ?? '',
    })

    setLoading(false)
    setSuccess(true)
    refresh()

    setTimeout(() => {
      setSuccess(false)
      setRegistering(null)
      setForm({ name: '', email: '', phone: '', notes: '' })
    }, 2800)
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const spotsLeft = (e: any) => Math.max(0, e.maxParticipants - (e.registered ?? 0))

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <div className="hero-badge">📅 Мероприятия</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Мероприятия</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600 }}>
            Присоединяйтесь к событиям нашего детского дома — каждое мероприятие это возможность помочь и познакомиться с детьми.
          </p>
          {isAuth && myRegistrations.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/profile?tab=events')}>
                📋 Мои записи ({myRegistrations.length}) →
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {events.map((ev: any) => {
              const left = spotsLeft(ev)
              const pct = ev.maxParticipants > 0
                ? Math.min(100, Math.round(((ev.registered ?? 0) / ev.maxParticipants) * 100))
                : 0
              const alreadyRegistered = myEventIds.has(ev.id)

              return (
                <div key={ev.id} className="card" style={{
                  display: 'grid', gridTemplateColumns: '1fr auto',
                  gap: 24, alignItems: 'start',
                  transition: 'all 0.2s ease',
                  ...(alreadyRegistered ? { borderColor: 'rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.04)' } : {}),
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span className="event-date">📅 {formatDate(ev.eventDate)}</span>
                      {alreadyRegistered && (
                        <span className="badge badge-green">✓ Вы записаны</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{ev.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>{ev.description}</p>
                    <div className="event-meta" style={{ marginBottom: 12 }}>
                      <span>📍 {ev.location}</span>
                      <span>👥 <strong>{ev.registered ?? 0}</strong>/{ev.maxParticipants} участников</span>
                      <span style={{ color: left <= 0 ? 'var(--danger)' : left <= 5 ? 'var(--accent)' : 'var(--success)' }}>
                        {left <= 0 ? '🔴 Мест нет' : left <= 5 ? `⚠️ Осталось ${left}` : `✅ Свободно ${left}`}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', width: '100%' }}>
                      <div style={{
                        height: '100%', borderRadius: 3, transition: 'width 0.5s',
                        width: `${pct}%`,
                        background: pct >= 90 ? 'linear-gradient(90deg, var(--danger), #f97316)'
                          : pct >= 60 ? 'linear-gradient(90deg, var(--accent), var(--success))'
                          : 'linear-gradient(90deg, var(--primary), var(--secondary))',
                      }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{pct}% заполнено</div>
                  </div>

                  <div style={{ minWidth: 160, textAlign: 'center' }}>
                    {left <= 0 ? (
                      <div className="badge badge-red" style={{ padding: '8px 16px', fontSize: 13 }}>Мест нет</div>
                    ) : alreadyRegistered ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                        <div className="badge badge-green" style={{ padding: '8px 16px', fontSize: 13 }}>✓ Записан</div>
                      </div>
                    ) : (
                      <button className="btn btn-primary" onClick={() => {
                        if (!isAuth) { keycloak.login(); return }
                        setRegistering(ev.id)
                        setErrors({})
                        setForm(f => ({ ...f, name: parsed?.name ?? '', email: parsed?.email ?? '' }))
                      }}>
                        Записаться
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {events.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <div className="empty-title">Нет активных мероприятий</div>
              <div className="empty-text">Следите за обновлениями — скоро появятся новые события</div>
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {registering !== null && (
        <div className="modal-overlay" onClick={() => { if (!loading) setRegistering(null) }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
                <h3 style={{ marginBottom: 8 }}>Вы успешно записаны!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Запись сохранена и отображается в вашем{' '}
                  <span
                    style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => { setRegistering(null); navigate('/profile') }}
                  >
                    личном кабинете
                  </span>.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  Количество мест обновлено автоматически.
                </p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-title">📅 Запись на мероприятие</div>
                  <button className="modal-close" onClick={() => setRegistering(null)}>✕</button>
                </div>
                {(() => {
                  const ev = events.find((e: any) => e.id === registering)
                  return ev && (
                    <div className="alert alert-info" style={{ marginBottom: 16 }}>
                      <strong>{ev.title}</strong><br />
                      📅 {formatDate(ev.eventDate)} · 📍 {ev.location}
                    </div>
                  )
                })()}
                <form onSubmit={handleRegister} noValidate>
                  <div className="form-group">
                    <label className="form-label">Ваше имя *</label>
                    <input className={`form-control${errors.name ? ' is-invalid' : ''}`} value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(x => ({ ...x, name: '' })) }}
                      placeholder="Иванов Иван Иванович" />
                    {errors.name && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>⚠ {errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className={`form-control${errors.email ? ' is-invalid' : ''}`} type="email" value={form.email}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(x => ({ ...x, email: '' })) }}
                      placeholder="example@mail.ru" />
                    {errors.email && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>⚠ {errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Телефон *</label>
                    <input className={`form-control${errors.phone ? ' is-invalid' : ''}`} value={form.phone}
                      onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(x => ({ ...x, phone: '' })) }}
                      placeholder="+7 (900) 000-00-00" />
                    {errors.phone && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>⚠ {errors.phone}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Примечания</label>
                    <textarea className="form-control" value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Особые пожелания или вопросы..." />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? '⏳ Записываем...' : '✓ Подтвердить запись'}
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
