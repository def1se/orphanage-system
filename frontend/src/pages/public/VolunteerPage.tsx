import { useState } from 'react'
import keycloak from '../../keycloak'
import { Link } from 'react-router-dom'

const SKILLS_OPTIONS = ['Обучение/репетиторство', 'Спорт и активный отдых', 'Музыка и творчество', 'Психологическая поддержка', 'Организация мероприятий', 'Медицина', 'IT и технологии', 'Кулинария', 'Другое']
const DAYS_OPTIONS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

export default function VolunteerPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', skills: [] as string[], availableDays: [] as string[], experience: '' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const isAuth = keycloak.authenticated
  const parsed = keycloak.tokenParsed as any

  const toggleArr = (arr: string[], val: string) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuth) { keycloak.login(); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSuccess(true)
  }

  if (success) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ marginBottom: 12 }}>Спасибо за желание помочь!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
        Ваша анкета волонтёра принята. Мы свяжемся с вами в течение 5 рабочих дней.
      </p>
      <Link to="/" className="btn btn-primary">На главную</Link>
    </div>
  )

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>🤝 Стать волонтёром</h1>
          <p>Помогите детям — поделитесь временем, навыками и теплом. Каждый час волонтёрства меняет чью-то жизнь.</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 24 }}>📝 Анкета волонтёра</div>
            {!isAuth && <div className="alert alert-warning">⚠️ Для подачи заявки необходимо <button style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} onClick={() => keycloak.login()}>войти в аккаунт</button></div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Имя *</label>
                  <input className="form-control" required value={form.firstName || parsed?.given_name || ''} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Иван" />
                </div>
                <div className="form-group">
                  <label className="form-label">Фамилия *</label>
                  <input className="form-control" required value={form.lastName || parsed?.family_name || ''} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Иванов" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-control" type="email" required value={form.email || parsed?.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Телефон *</label>
                  <input className="form-control" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+7 (900) 000-00-00" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Навыки и сферы помощи</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {SKILLS_OPTIONS.map(s => (
                    <button key={s} type="button" onClick={() => setForm(f => ({ ...f, skills: toggleArr(f.skills, s) }))}
                      className={`btn btn-sm ${form.skills.includes(s) ? 'btn-primary' : 'btn-secondary'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Удобные дни</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {DAYS_OPTIONS.map(d => (
                    <button key={d} type="button" onClick={() => setForm(f => ({ ...f, availableDays: toggleArr(f.availableDays, d) }))}
                      className={`btn btn-sm ${form.availableDays.includes(d) ? 'btn-primary' : 'btn-secondary'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Опыт работы с детьми</label>
                <textarea className="form-control" rows={3} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="Расскажите о вашем опыте работы с детьми, педагогическом образовании или других навыках..." />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Отправляем...' : '🤝 Подать заявку волонтёра'}
              </button>
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>Что даёт волонтёрство?</div>
              {[['💛', 'Изменить жизнь ребёнка к лучшему'], ['📚', 'Получить опыт работы с детьми'], ['🤝', 'Найти единомышленников'], ['🎓', 'Получить сертификат волонтёра'], ['📅', 'Гибкий график участия']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <span>{icon}</span> <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{text}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>Как это работает?</div>
              {[['1', 'Заполните анкету'], ['2', 'Пройдите собеседование'], ['3', 'Пройдите инструктаж'], ['4', 'Начните помогать!']].map(([n, step]) => (
                <div key={n} style={{ display: 'flex', gap: 12, padding: '8px 0', alignItems: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'var(--primary-light)', flexShrink: 0 }}>{n}</div>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
