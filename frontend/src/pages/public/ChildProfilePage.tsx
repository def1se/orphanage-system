import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import keycloak from '../../keycloak'
import { useAuth } from '../../hooks/useAuth'
import { childrenStore, requestsStore } from '../../store/dataStore'

const GENDERS: Record<string, string> = { MALE: 'Мальчик', FEMALE: 'Девочка' }
const STATUSES: Record<string, string> = {
  IN_SHELTER: 'В учреждении', UNDER_GUARDIANSHIP: 'Под опекой',
  ADOPTED: 'Усыновлён', RETURNED: 'Возвращён'
}
const STATUS_COLORS: Record<string, string> = {
  IN_SHELTER: 'badge-blue', UNDER_GUARDIANSHIP: 'badge-yellow',
  ADOPTED: 'badge-green', RETURNED: 'badge-red'
}

const getAge = (birthDate: string) => {
  if (!birthDate) return null
  const d = new Date(birthDate), today = new Date()
  const age = today.getFullYear() - d.getFullYear() -
    (today < new Date(today.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0)
  return age
}

const getAgeLabel = (age: number | null) => {
  if (age === null) return '—'
  if (age >= 11 && age <= 14) return `${age} лет`
  const last = age % 10
  if (last === 1) return `${age} год`
  if (last >= 2 && last <= 4) return `${age} года`
  return `${age} лет`
}

// Расширенные данные для каждого ребёнка
const EXTRA_INFO: Record<number, any> = {
  1: {
    placementOptions: ['Усыновление', 'Опека (попечительство)'],
    siblings: false,
    healthGroup: 'I',
    region: 'Москва',
    personality: 'Алёша — открытый, весёлый и очень добрый мальчик. Любит рисовать, собирать конструкторы и мечтает стать художником. Хорошо ладит со взрослыми, легко идёт на контакт. Очень привязывается к близким людям и ценит семейное тепло.',
    interests: ['Рисование', 'Конструкторы', 'Мультфильмы'],
    bgGradient: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))',
  },
  2: {
    placementOptions: ['Усыновление', 'Опека'],
    siblings: false,
    healthGroup: 'I',
    region: 'Москва',
    personality: 'Катя — умная, любознательная и ответственная девочка. Отличница, обожает читать книги и участвовать в олимпиадах. Мечтает стать врачом. Спокойная и уравновешенная, находит общий язык с ровесниками.',
    interests: ['Чтение', 'Математика', 'Рисование', 'Природа'],
    bgGradient: 'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(124,58,237,0.2))',
  },
  3: {
    placementOptions: ['Усыновление', 'Опека', 'Патронат'],
    siblings: false,
    healthGroup: 'II',
    region: 'Московская обл.',
    personality: 'Миша — тихий и добрый малыш. Очень любит животных — кошек, собак, птиц. Любознательный, задаёт много вопросов об окружающем мире. Любит слушать сказки и смотреть познавательные передачи.',
    interests: ['Животные', 'Природа', 'Сказки', 'Мультики'],
    bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.2))',
  },
  4: {
    placementOptions: ['Усыновление', 'Опека'],
    siblings: false,
    healthGroup: 'I',
    region: 'Москва',
    personality: 'Аня — творческая и очень талантливая девочка. Занимается танцами уже 4 года, участвует в конкурсах. Общительная, весёлая, любит быть в центре внимания. Мечтает выступать на большой сцене.',
    interests: ['Танцы', 'Музыка', 'Рисование', 'Театр'],
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(239,68,68,0.2))',
  },
  5: {
    placementOptions: ['Усыновление', 'Опека'],
    siblings: false,
    healthGroup: 'I',
    region: 'Москва',
    personality: 'Дима — активный и технически мыслящий мальчик. Обожает собирать роботов и разбираться в том, как всё устроено. Спортивный, любит футбол. Целеустремлённый — всегда доводит дела до конца.',
    interests: ['Роботика', 'Конструкторы', 'Футбол', 'Компьютеры'],
    bgGradient: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(16,185,129,0.2))',
  },
  6: {
    placementOptions: ['Усыновление', 'Опека', 'Патронат'],
    siblings: false,
    healthGroup: 'I',
    region: 'Москва',
    personality: 'Настя — нежная, добрая и очень заботливая девочка. Любит помогать взрослым по хозяйству, ухаживать за цветами. Обожает готовить вместе с воспитателями. Мечтает о большой дружной семье.',
    interests: ['Кулинария', 'Цветы', 'Рисование', 'Куклы'],
    bgGradient: 'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(245,158,11,0.2))',
  },
}

export default function ChildProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [imgError, setImgError] = useState(false)

  const { isAuth, name: authName, email: authEmail } = useAuth()
  const parsed = keycloak.tokenParsed as any
  const userId: string = parsed?.sub ?? ''

  const allChildren = childrenStore.getAll()
  const child = allChildren.find((c: any) => String(c.id) === String(id))

  if (!child) {
    return (
      <div className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="empty-icon">📂</div>
          <div className="empty-title">Ребёнок не найден</div>
          <div className="empty-text" style={{ marginBottom: 24 }}>Запись не существует или была удалена</div>
          <Link to="/children" className="btn btn-primary">← Вернуться к поиску</Link>
        </div>
      </div>
    )
  }

  const extra = EXTRA_INFO[child.id] || {
    placementOptions: ['Усыновление', 'Опека'],
    siblings: false,
    healthGroup: 'I',
    region: 'Москва',
    personality: child.description || 'Добрый и общительный ребёнок, ищет любящую семью.',
    interests: [],
    bgGradient: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))',
  }

  const age = child.birthDate ? getAge(child.birthDate) : (child.age ?? null)
  const ageLabel = getAgeLabel(age)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Укажите ваше имя'
    if (!form.email.trim()) errs.email = 'Укажите email'
    if (!form.phone.trim()) errs.phone = 'Телефон обязателен'
    if (!form.message.trim()) errs.message = 'Напишите сопроводительное сообщение'
    return errs
  }

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))

    // ✅ Реально сохраняем заявку в store (появится в профиле!)
    requestsStore.add({
      userId,
      applicantFirstName: form.name.split(' ')[0] || form.name,
      applicantLastName: form.name.split(' ').slice(1).join(' ') || '',
      applicantPhone: form.phone,
      applicantEmail: form.email,
      requestType: 'ACQUAINTANCE',
      childId: child.id,
      childName: `${child.firstName} ${child.lastName ?? ''}`.trim(),
      status: 'NEW',
      message: form.message,
      adminComment: '',
      createdAt: new Date().toLocaleDateString('ru-RU'),
    })

    setLoading(false)
    setRequestSent(true)
    setTimeout(() => { setRequestSent(false); setShowRequestModal(false) }, 3000)
  }

  const openRequest = () => {
    if (!isAuth) { keycloak.login(); return }
    setErrors({})
    setForm({ name: authName || parsed?.name || '', email: authEmail || parsed?.email || '', phone: '', message: '' })
    setShowRequestModal(true)
  }

  const photoUrl = child.imageUrl && !imgError ? child.imageUrl : null

  return (
    <>
      <div style={{ background: extra.bgGradient, padding: '64px 0 48px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <Link to="/children" style={{ color: 'var(--text-secondary)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Назад к поиску
          </Link>
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 40, alignItems: 'start' }}>
            {/* Avatar / Photo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                width: 280, height: 320, borderRadius: 20,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 100,
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={`${child.firstName} ${child.lastName ?? ''}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span style={{ fontSize: 100 }}>
                    {child.gender === 'MALE' ? '👦' : '👧'}
                  </span>
                )}
              </div>
              {/* Interests as tags */}
              {extra.interests.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {extra.interests.map((interest: string) => (
                    <span key={interest} className="tag" style={{ padding: '6px 12px', fontSize: 13 }}>
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <span className={`badge ${STATUS_COLORS[child.status] ?? 'badge-gray'}`}>
                  {STATUSES[child.status] ?? child.status}
                </span>
                {age !== null && <span className="badge badge-purple">🎂 {ageLabel}</span>}
                <span className="badge badge-blue">{GENDERS[child.gender] ?? child.gender}</span>
              </div>
              <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 8 }}>
                {child.firstName} {child.lastName ?? ''}
              </h1>
              {child.middleName && <div style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 16 }}>{child.middleName}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {[
                  ['📍 Регион', extra.region],
                  ['🏥 Группа здоровья', extra.healthGroup],
                  ['👫 Братья/сёстры', extra.siblings ? 'Есть' : 'Нет'],
                  ['🏠 Формы устройства', extra.placementOptions.join(', ')],
                ].map(([label, value]) => (
                  <div key={label as string} className="card" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {child.status === 'IN_SHELTER' && (
                  <button className="btn btn-primary btn-lg" onClick={openRequest}>
                    💛 Оставить заявку на знакомство
                  </button>
                )}
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>← Назад</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile details */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }}>
            {/* Main content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="card">
                <div className="card-title" style={{ marginBottom: 16 }}>📝 О ребёнке</div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: 16 }}>
                  {extra.personality}
                </p>
              </div>

              {extra.interests.length > 0 && (
                <div className="card">
                  <div className="card-title" style={{ marginBottom: 16 }}>⭐ Интересы и увлечения</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {extra.interests.map((interest: string) => (
                      <span key={interest} className="tag" style={{ padding: '8px 16px', fontSize: 14 }}>{interest}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="card">
                <div className="card-title" style={{ marginBottom: 16 }}>🏠 Формы устройства</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {extra.placementOptions.map((opt: string) => (
                    <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'var(--success)', fontSize: 16 }}>✓</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))' }}>
                <div className="card-title" style={{ marginBottom: 16 }}>📋 Основные сведения</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['Имя', `${child.firstName} ${child.lastName ?? ''}`],
                    ['Возраст', ageLabel],
                    ['Пол', GENDERS[child.gender] ?? child.gender],
                    ['Статус', STATUSES[child.status] ?? child.status],
                    ['Группа здоровья', extra.healthGroup],
                    ['Регион', extra.region],
                    ...(child.roomNumber ? [['Комната', child.roomNumber]] : []),
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {child.status === 'IN_SHELTER' && (
                <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05))' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>💛</div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{child.firstName} ждёт семью</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
                    Свяжитесь с нами, чтобы познакомиться с ребёнком
                  </p>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={openRequest}>
                    Оставить заявку
                  </button>
                </div>
              )}

              <div className="card">
                <div className="card-title" style={{ marginBottom: 12 }}>📞 Контакты</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>📍 г. Москва, ул. Примерная, д. 1</span>
                  <span>📞 +7 (495) 000-00-00</span>
                  <span>✉️ info@svetly-put.ru</span>
                  <span>🕐 Пн–Пт 9:00–18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => { if (!loading) setShowRequestModal(false) }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            {requestSent ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 72, marginBottom: 16, animation: 'pop 0.4s ease' }}>✅</div>
                <h3 style={{ marginBottom: 8 }}>Заявка подана!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Заявка на знакомство с <strong>{child.firstName}</strong> успешно отправлена.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  Статус заявки можно отслеживать в{' '}
                  <Link to="/profile" style={{ color: 'var(--primary)' }} onClick={() => setShowRequestModal(false)}>
                    личном кабинете
                  </Link>.
                </p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-title">💛 Заявка на знакомство с {child.firstName}</div>
                  <button className="modal-close" onClick={() => setShowRequestModal(false)}>✕</button>
                </div>
                <div className="alert alert-info" style={{ marginBottom: 16 }}>
                  ℹ️ После подачи заявки наши специалисты свяжутся с вами в течение 2–3 рабочих дней.
                </div>
                <form onSubmit={handleRequest} noValidate>
                  <div className="form-group">
                    <label className="form-label">Ваше полное имя *</label>
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
                    <label className="form-label">Сопроводительное письмо *</label>
                    <textarea className={`form-control${errors.message ? ' is-invalid' : ''}`} rows={4} value={form.message}
                      onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(x => ({ ...x, message: '' })) }}
                      placeholder="Расскажите немного о себе, своей семье и причинах обращения..." />
                    {errors.message && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>⚠ {errors.message}</div>}
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? (
                      <span>⏳ Отправляем...</span>
                    ) : (
                      <span>📩 Подать заявку</span>
                    )}
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
