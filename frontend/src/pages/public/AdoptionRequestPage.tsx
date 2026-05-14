import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import keycloak from '../../keycloak'
import { requestsStore, childrenStore } from '../../store/dataStore'

export default function AdoptionRequestPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    childId: '', requestType: 'ACQUAINTANCE', message: '',
    firstName: '', lastName: '', phone: '', email: ''
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!keycloak.authenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔐</div>
        <h2 style={{ marginBottom: 8 }}>Требуется авторизация</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Для подачи заявки необходимо войти в аккаунт
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => keycloak.login()}>Войти</button>
          <Link to="/children" className="btn btn-secondary btn-lg">← Назад к каталогу</Link>
        </div>
      </div>
    )
  }

  const parsed = keycloak.tokenParsed as any
  const userId: string = parsed?.sub ?? ''
  const children = childrenStore.getAll()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const selectedChild = children.find((c: any) => String(c.id) === form.childId)
    requestsStore.add({
      userId,           // ← привязываем к текущему пользователю!
      applicantFirstName: form.firstName || parsed?.given_name || '',
      applicantLastName: form.lastName || parsed?.family_name || '',
      applicantPhone: form.phone,
      applicantEmail: form.email || parsed?.email || '',
      requestType: form.requestType,
      childId: form.childId ? parseInt(form.childId) : null,
      childName: selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : null,
      status: 'NEW',
      message: form.message,
      adminComment: '',
      createdAt: new Date().toLocaleDateString('ru-RU'),
    })

    setLoading(false)
    setSuccess(true)
  }

  if (success) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <h2 style={{ marginBottom: 12 }}>Заявка успешно подана!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
        Наши сотрудники свяжутся с вами в течение 3 рабочих дней.
        Статус заявки можно отслеживать в личном кабинете.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate('/profile')}>Личный кабинет</button>
        <Link to="/children" className="btn btn-secondary">← К каталогу детей</Link>
      </div>
    </div>
  )

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>📋 Заявка на знакомство / опеку</h1>
          <p>Заполните форму — наши специалисты свяжутся с вами в течение 3 рабочих дней.</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="alert alert-info" style={{ marginBottom: 24 }}>
            ℹ️ Подача заявки не накладывает на вас юридических обязательств. Это первый шаг — знакомство и консультация.
          </div>
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Тип заявки *</label>
                <select className="form-control" value={form.requestType}
                  onChange={e => setForm(f => ({ ...f, requestType: e.target.value }))}>
                  <option value="ACQUAINTANCE">👋 Знакомство с ребёнком</option>
                  <option value="GUARDIANSHIP">🤝 Опека/попечительство</option>
                  <option value="ADOPTION">❤️ Усыновление/удочерение</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Конкретный ребёнок (необязательно)</label>
                <select className="form-control" value={form.childId}
                  onChange={e => setForm(f => ({ ...f, childId: e.target.value }))}>
                  <option value="">— Не указан (рассмотрим всех подходящих) —</option>
                  {children
                    .filter((c: any) => c.status === 'IN_SHELTER')
                    .map((c: any) => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                    ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Имя *</label>
                  <input className="form-control" required
                    value={form.firstName || parsed?.given_name || ''}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    placeholder="Иван" />
                </div>
                <div className="form-group">
                  <label className="form-label">Фамилия *</label>
                  <input className="form-control" required
                    value={form.lastName || parsed?.family_name || ''}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    placeholder="Иванов" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Телефон *</label>
                  <input className="form-control" required value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+7 (900) 000-00-00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-control" type="email" required
                    value={form.email || parsed?.email || ''}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Сопроводительное письмо *</label>
                <textarea className="form-control" rows={5} required value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Расскажите немного о себе, своей семье и причинах обращения..." />
              </div>
              <div className="alert alert-warning" style={{ marginBottom: 20 }}>
                ⚠️ Убедитесь, что данные заполнены верно.
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Отправляем...' : '📩 Подать заявку'}
                </button>
                <Link to="/children" className="btn btn-secondary btn-lg">Отмена</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
