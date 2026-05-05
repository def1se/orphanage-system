import { useState } from 'react'
import keycloak from '../../keycloak'

const MOCK_NEEDS = [
  { id: 1, itemName: 'Детские куртки (зима)', category: 'CLOTHING', quantityNeeded: 30, quantityCurrent: 8, priority: 'HIGH', price: 2500 },
  { id: 2, itemName: 'Школьные рюкзаки', category: 'EDUCATION', quantityNeeded: 20, quantityCurrent: 5, priority: 'HIGH', price: 1500 },
  { id: 3, itemName: 'Постельное бельё', category: 'HOUSEHOLD', quantityNeeded: 50, quantityCurrent: 20, priority: 'MEDIUM', price: 800 },
  { id: 4, itemName: 'Спортивная обувь', category: 'CLOTHING', quantityNeeded: 25, quantityCurrent: 12, priority: 'MEDIUM', price: 1200 },
  { id: 5, itemName: 'Витамины и БАДы', category: 'HEALTH', quantityNeeded: 100, quantityCurrent: 40, priority: 'HIGH', price: 300 },
  { id: 6, itemName: 'Художественные принадлежности', category: 'EDUCATION', quantityNeeded: 15, quantityCurrent: 3, priority: 'LOW', price: 500 },
]
const CATEGORIES: Record<string, string> = { CLOTHING: '👕 Одежда', EDUCATION: '📚 Учёба', HOUSEHOLD: '🏠 Быт', HEALTH: '💊 Здоровье', FOOD: '🍎 Питание' }
const PRIORITIES: Record<string, string> = { HIGH: 'Срочно', MEDIUM: 'Нужно', LOW: 'Желательно' }
const PRIORITY_COLORS: Record<string, string> = { HIGH: 'badge-red', MEDIUM: 'badge-yellow', LOW: 'badge-blue' }
const AMOUNTS = [100, 300, 500, 1000, 2000, 5000]

export default function HowToHelpPage() {
  const [tab, setTab] = useState<'donation' | 'material'>('donation')
  const [amount, setAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donating, setDonating] = useState(false)
  const [donationSuccess, setDonationSuccess] = useState(false)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [materialForm, setMaterialForm] = useState({ name: '', email: '' })
  const [materialSuccess, setMaterialSuccess] = useState(false)

  const isAuth = keycloak.authenticated
  const parsed = keycloak.tokenParsed as any
  const finalAmount = customAmount ? parseInt(customAmount) : amount

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuth) { keycloak.login(); return }
    setDonating(true)
    await new Promise(r => setTimeout(r, 1000))
    setDonating(false)
    setDonationSuccess(true)
  }

  const handleMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuth) { keycloak.login(); return }
    await new Promise(r => setTimeout(r, 800))
    setMaterialSuccess(true)
  }

  const totalInCart = Object.values(cart).reduce((a, b) => a + b, 0)

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>💛 Как помочь детскому дому</h1>
          <p>Выберите удобный способ — любая помощь имеет значение для наших детей.</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="tabs" style={{ maxWidth: 400 }}>
            <button className={`tab ${tab === 'donation' ? 'active' : ''}`} onClick={() => setTab('donation')}>💰 Денежный взнос</button>
            <button className={`tab ${tab === 'material' ? 'active' : ''}`} onClick={() => setTab('material')}>📦 Вещи и предметы</button>
          </div>

          {tab === 'donation' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
              <div>
                {donationSuccess ? (
                  <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                    <h3 style={{ marginBottom: 8 }}>Спасибо за пожертвование!</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                      Квитанция на сумму <strong>{finalAmount} ₽</strong> отправлена на <strong>{donorEmail || parsed?.email}</strong>
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Вы помогаете детям обрести лучшую жизнь 💛</p>
                    <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={() => setDonationSuccess(false)}>Сделать ещё один взнос</button>
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-header"><div className="card-title">💳 Сделать пожертвование</div></div>
                    <form onSubmit={handleDonate}>
                      <div className="form-group">
                        <label className="form-label">Выберите сумму (₽)</label>
                        <div className="donation-amounts">
                          {AMOUNTS.map(a => (
                            <button key={a} type="button" className={`amount-btn ${amount === a && !customAmount ? 'selected' : ''}`}
                              onClick={() => { setAmount(a); setCustomAmount('') }}>
                              {a.toLocaleString()} ₽
                            </button>
                          ))}
                        </div>
                        <input className="form-control" type="number" placeholder="Или введите свою сумму..." value={customAmount}
                          onChange={e => setCustomAmount(e.target.value)} min="10" />
                      </div>
                      {!isAuth && (
                        <>
                          <div className="form-group">
                            <label className="form-label">Ваше имя *</label>
                            <input className="form-control" required value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Иванов Иван Иванович" />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Email для квитанции *</label>
                            <input className="form-control" type="email" required value={donorEmail} onChange={e => setDonorEmail(e.target.value)} placeholder="example@mail.ru" />
                          </div>
                        </>
                      )}
                      <div className="alert alert-info">
                        📧 Квитанция будет отправлена на {isAuth ? parsed?.email : 'указанный email'}
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={donating}>
                        {donating ? 'Обработка...' : `Пожертвовать ${(finalAmount || 0).toLocaleString()} ₽`}
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card">
                  <div className="card-title" style={{ marginBottom: 16 }}>На что идут средства?</div>
                  {[['🍽️', 'Питание', '40%', 'Сбалансированное питание всех воспитанников'],
                    ['🎓', 'Образование', '25%', 'Кружки, учебники, канцелярия'],
                    ['🏥', 'Медицина', '20%', 'Лечение, профилактика, витамины'],
                    ['🎨', 'Досуг', '15%', 'Творческие занятия и мероприятия'],
                  ].map(([icon, name, pct, desc]) => (
                    <div key={name} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 24 }}>{icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{name}</span>
                          <span className="badge badge-purple">{pct}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{desc}</div>
                        <div className="progress-bar" style={{ marginTop: 6 }}>
                          <div className="progress-fill" style={{ width: pct }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'material' && (
            materialSuccess ? (
              <div className="card" style={{ textAlign: 'center', padding: '48px 32px', maxWidth: 500, margin: '0 auto' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <h3 style={{ marginBottom: 8 }}>Заявка принята!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Мы свяжемся с вами в ближайшее время для организации передачи.</p>
                <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={() => { setMaterialSuccess(false); setCart({}) }}>Отлично</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }}>
                <div>
                  <h3 style={{ marginBottom: 20 }}>Актуальные потребности</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {MOCK_NEEDS.map(need => {
                      const pct = Math.round((need.quantityCurrent / need.quantityNeeded) * 100)
                      return (
                        <div key={need.id} className={`card need-card ${need.priority === 'HIGH' ? 'priority-high' : need.priority === 'MEDIUM' ? 'priority-medium' : ''}`} style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                <span className="tag">{CATEGORIES[need.category] ?? need.category}</span>
                                <span className={`badge ${PRIORITY_COLORS[need.priority]}`}>{PRIORITIES[need.priority]}</span>
                              </div>
                              <div style={{ fontWeight: 600, marginBottom: 4 }}>{need.itemName}</div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Есть: {need.quantityCurrent} / Нужно: {need.quantityNeeded} шт.</div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${pct}%` }} />
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}% обеспечено</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                              <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{need.price.toLocaleString()} ₽/шт.</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <button className="btn btn-secondary btn-sm" style={{ padding: '4px 10px' }}
                                  onClick={() => setCart(c => ({ ...c, [need.id]: Math.max(0, (c[need.id] ?? 0) - 1) }))}>−</button>
                                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{cart[need.id] ?? 0}</span>
                                <button className="btn btn-primary btn-sm" style={{ padding: '4px 10px' }}
                                  onClick={() => setCart(c => ({ ...c, [need.id]: (c[need.id] ?? 0) + 1 }))}>+</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="card" style={{ position: 'sticky', top: 80 }}>
                  <div className="card-title" style={{ marginBottom: 16 }}>📦 Ваш список помощи</div>
                  {totalInCart === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                      <div>Добавьте позиции из списка</div>
                    </div>
                  ) : (
                    <>
                      {MOCK_NEEDS.filter(n => (cart[n.id] ?? 0) > 0).map(n => (
                        <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                          <div>{n.itemName}</div>
                          <div style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{cart[n.id]} шт.</div>
                        </div>
                      ))}
                      <div className="divider" />
                      <form onSubmit={handleMaterial}>
                        <div className="form-group">
                          <label className="form-label">Ваше имя *</label>
                          <input className="form-control" required value={materialForm.name} onChange={e => setMaterialForm(f => ({ ...f, name: e.target.value }))} placeholder="Иванов И.И." />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Телефон/Email *</label>
                          <input className="form-control" required value={materialForm.email} onChange={e => setMaterialForm(f => ({ ...f, email: e.target.value }))} placeholder="Для связи с вами" />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Отправить заявку</button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </>
  )
}
