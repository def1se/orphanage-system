import { useState } from 'react'
import keycloak from '../../keycloak'
import { needsStore } from '../../store/dataStore'
import { createStore } from '../../store/localStorage'
import { materialOrdersStore } from '../../store/materialOrdersStore'

const CATEGORIES: Record<string, string> = { CLOTHING: '👕 Одежда', EDUCATION: '📚 Учёба', HOUSEHOLD: '🏠 Быт', HEALTH: '💊 Здоровье', FOOD: '🍎 Питание' }
const PRIORITIES: Record<string, string> = { HIGH: 'Срочно', MEDIUM: 'Нужно', LOW: 'Желательно' }
const PRIORITY_COLORS: Record<string, string> = { HIGH: 'badge-red', MEDIUM: 'badge-yellow', LOW: 'badge-blue' }
const AMOUNTS = [100, 300, 500, 1000, 2000, 5000]

const donationsStore = createStore<any>('donations', [])

async function sendEmailReceipt(email: string, subject: string, text: string) {
  try {
    await fetch('/api/v1/notifications/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(keycloak.token ? { Authorization: `Bearer ${keycloak.token}` } : {})
      },
      body: JSON.stringify({ to: email, subject, text })
    })
  } catch (err) {
    console.error('Failed to send email:', err)
  }
}

async function sendDonationReceipt(email: string, amount: number) {
  const subject = `Квитанция о пожертвовании — ${amount} ₽`
  const body = `Уважаемый жертвователь!\n\nСпасибо за ваше пожертвование в размере ${amount} ₽ в пользу ЦССВ «Светлый путь».\n\nВаш вклад поможет детям обрести лучшую жизнь 💛\n\nС уважением,\nКоманда ЦССВ «Светлый путь»\ninfo@svetly-put.ru`
  await sendEmailReceipt(email, subject, body)
}

function exportNeedsPdf(needs: any[]) {
  const now = new Date().toLocaleDateString('ru-RU')
  const rows = needs.map((n, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${n.itemName}</td>
      <td>${CATEGORIES[n.category] ?? n.category}</td>
      <td>${PRIORITIES[n.priority] ?? n.priority}</td>
      <td style="text-align:right">${n.quantityCurrent} / ${n.quantityNeeded}</td>
      <td style="text-align:right">${Number(n.price).toLocaleString('ru-RU')} ₽</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">
  <title>Список потребностей</title>
  <style>
    body{font-family:Arial,sans-serif;padding:28px;color:#1e293b}
    h1{color:#7c3aed;margin-bottom:4px}
    .sub{color:#64748b;font-size:13px;margin-bottom:24px}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{background:#7c3aed;color:#fff;padding:9px 12px;text-align:left}
    td{padding:8px 12px;border-bottom:1px solid #e2e8f0}
    tr:nth-child(even) td{background:#f8fafc}
    .footer{margin-top:24px;font-size:12px;color:#94a3b8;text-align:center}
    @media print{thead{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <h1>🏡 ЦССВ «Светлый путь»</h1>
  <div class="sub">Список актуальных потребностей · Дата: ${now}</div>
  <table>
    <thead><tr><th>#</th><th>Наименование</th><th>Категория</th><th>Приоритет</th><th>Наличие/Нужно</th><th>Цена</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">г. Москва, ул. Примерная, д. 1 · info@svetly-put.ru · +7 (495) 000-00-00</div>
  <script>window.onload=function(){window.print()}<\/script>
  </body></html>`

  const win = window.open('', '_blank', 'width=900,height=650')
  if (!win) { alert('Разрешите всплывающие окна в браузере'); return }
  win.document.write(html)
  win.document.close()
}

async function sendOrderReceipt(email: string, items: any[], total: number, method: string) {
  const itemLines = items.map(i => `  • ${i.itemName} — ${i.quantity} шт. × ${i.price} ₽`).join('\n')
  const subject = 'Подтверждение заказа — ЦССВ «Светлый путь»'
  const body = `Ваш заказ принят!\n\nСостав заказа:\n${itemLines}\n\nИтого: ${total.toLocaleString('ru-RU')} ₽\nСпособ: ${method === 'DELIVERY' ? 'Доставка через сервис детдома' : 'Самовывоз'}\n\nСтатус можно отследить в личном кабинете.\n\nСпасибо! ЦССВ «Светлый путь»`
  await sendEmailReceipt(email, subject, body)
}

export default function HowToHelpPage() {
  const [tab, setTab] = useState<'donation' | 'material'>('donation')
  const [amount, setAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CARD')
  const [donating, setDonating] = useState(false)
  const [donationSuccess, setDonationSuccess] = useState(false)
  const [receiptSent, setReceiptSent] = useState(false)

  const [cart, setCart] = useState<Record<number, number>>({})
  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'SELF'>('DELIVERY')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isAuth = keycloak.authenticated
  const parsed = keycloak.tokenParsed as any
  const finalAmount = customAmount ? parseInt(customAmount) : amount
  const recipientEmail = donorEmail || parsed?.email || ''

  const needs = needsStore.getAll()
  const cartItems = needs.filter((n: any) => (cart[n.id] ?? 0) > 0)
  const totalInCart = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalCost = cartItems.reduce((s: number, n: any) => s + (cart[n.id] ?? 0) * n.price, 0)

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuth && !donorEmail) { keycloak.login(); return }
    setDonating(true)
    await new Promise(r => setTimeout(r, 1200))
    donationsStore.add({
      userId: parsed?.sub ?? null,
      userEmail: recipientEmail,
      userName: donorName || parsed?.name || 'Аноним',
      amount: finalAmount,
      paymentMethod,
      status: 'COMPLETED',
      createdAt: new Date().toLocaleString('ru-RU'),
    })
    if (recipientEmail) {
      try { await sendDonationReceipt(recipientEmail, finalAmount); setReceiptSent(true) }
      catch { setReceiptSent(false) }
    }
    setDonating(false)
    setDonationSuccess(true)
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuth) { keycloak.login(); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))

    const items = cartItems.map((n: any) => ({ itemName: n.itemName, quantity: cart[n.id], price: n.price }))
    const email = contactEmail || parsed?.email || ''
    const name = contactName || parsed?.name || 'Аноним'

    materialOrdersStore.add({
      userId: parsed?.sub ?? '',
      userName: name,
      userEmail: email,
      items,
      totalAmount: totalCost,
      deliveryMethod,
      status: 'PENDING',
      address: deliveryMethod === 'DELIVERY' ? deliveryAddress : 'Самовывоз',
      createdAt: new Date().toLocaleString('ru-RU'),
    })

    if (email) await sendOrderReceipt(email, items, totalCost, deliveryMethod)

    setSubmitting(false)
    setOrderSuccess(true)
  }

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
                      Квитанция на сумму <strong>{finalAmount} ₽</strong> отправлена на <strong>{recipientEmail}</strong>
                    </p>
                    {receiptSent ? (
                      <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ Письмо отправлено</div>
                    ) : (
                      <div className="alert alert-info" style={{ marginBottom: 16 }}>
                        <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={async () => { await sendDonationReceipt(recipientEmail, finalAmount); setReceiptSent(true) }}>
                          📧 Отправить квитанцию на почту
                        </button>
                      </div>
                    )}
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Вы помогаете детям обрести лучшую жизнь 💛</p>
                    <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={() => { setDonationSuccess(false); setReceiptSent(false) }}>Сделать ещё один взнос</button>
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
                      <div className="form-group">
                        <label className="form-label">Способ оплаты</label>
                        <select className="form-control" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                          <option value="CARD">💳 Банковская карта</option>
                          <option value="SBP">📱 СБП</option>
                          <option value="TRANSFER">🏦 Банковский перевод</option>
                        </select>
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
                      {isAuth && (
                        <div className="alert alert-info" style={{ marginBottom: 16 }}>
                          📧 Квитанция будет отправлена на <strong>{parsed?.email}</strong>
                        </div>
                      )}
                      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={donating || !finalAmount || finalAmount < 10}>
                        {donating ? <span>⏳ Обрабатываем...</span> : <span>💛 Пожертвовать {(finalAmount || 0).toLocaleString()} ₽</span>}
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card">
                  <div className="card-title" style={{ marginBottom: 16 }}>На что идут средства?</div>
                  {[['🍽️', 'Питание', '40%'], ['🎓', 'Образование', '25%'], ['🏥', 'Медицина', '20%'], ['🎨', 'Досуг', '15%']].map(([icon, name, pct]) => (
                    <div key={name} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                      <div style={{ fontSize: 24 }}>{icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{name}</span>
                          <span className="badge badge-purple">{pct}</span>
                        </div>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: pct }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'material' && (
            orderSuccess ? (
              <div className="card" style={{ textAlign: 'center', padding: '48px 32px', maxWidth: 520, margin: '0 auto' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <h3 style={{ marginBottom: 8 }}>Заказ принят!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Квитанция и данные о заказе отправлены на вашу почту.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                  Статус заказа можно отслеживать в <a href="/profile?tab=orders" style={{ color: 'var(--primary)' }}>личном кабинете</a>.
                </p>
                <button className="btn btn-secondary" onClick={() => { setOrderSuccess(false); setCart({}) }}>Оформить ещё один заказ</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3>Актуальные потребности</h3>
                    <button className="btn btn-secondary btn-sm" onClick={() => exportNeedsPdf(needs)}>
                      📄 Скачать список (PDF)
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {needs.map((need: any) => {
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
                              <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
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
                      {cartItems.map((n: any) => (
                        <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                          <div>{n.itemName}</div>
                          <div style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{cart[n.id]} шт. · {(cart[n.id] * n.price).toLocaleString()} ₽</div>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700 }}>
                        <span>Итого:</span>
                        <span style={{ color: 'var(--primary-light)' }}>{totalCost.toLocaleString()} ₽</span>
                      </div>
                      <div className="divider" />
                      <form onSubmit={handleOrder}>
                        <div className="form-group">
                          <label className="form-label">Способ передачи *</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 12px', borderRadius: 8, border: `2px solid ${deliveryMethod === 'DELIVERY' ? 'var(--primary)' : 'var(--border)'}`, background: deliveryMethod === 'DELIVERY' ? 'rgba(124,58,237,0.08)' : 'transparent' }}>
                              <input type="radio" name="delivery" value="DELIVERY" checked={deliveryMethod === 'DELIVERY'} onChange={() => setDeliveryMethod('DELIVERY')} />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>🚚 Доставка через сервис детдома</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Курьер заберёт у вас</div>
                              </div>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 12px', borderRadius: 8, border: `2px solid ${deliveryMethod === 'SELF' ? 'var(--primary)' : 'var(--border)'}`, background: deliveryMethod === 'SELF' ? 'rgba(124,58,237,0.08)' : 'transparent' }}>
                              <input type="radio" name="delivery" value="SELF" checked={deliveryMethod === 'SELF'} onChange={() => setDeliveryMethod('SELF')} />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>🚶 Привезу самостоятельно</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>г. Москва, ул. Примерная, д. 1</div>
                              </div>
                            </label>
                          </div>
                        </div>
                        {deliveryMethod === 'DELIVERY' && (
                          <div className="form-group">
                            <label className="form-label">Адрес для забора *</label>
                            <input className="form-control" required value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="г. Москва, ул. ..., д. ..." />
                          </div>
                        )}
                        {!isAuth && (
                          <>
                            <div className="form-group">
                              <label className="form-label">Ваше имя *</label>
                              <input className="form-control" required value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Иванов И.И." />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Email *</label>
                              <input className="form-control" type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="example@mail.ru" />
                            </div>
                          </>
                        )}
                        {isAuth && (
                          <div className="alert alert-info" style={{ marginBottom: 12 }}>
                            📧 Квитанция на <strong>{parsed?.email}</strong>
                          </div>
                        )}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                          {submitting ? '⏳ Оформляем...' : '✅ Оформить заказ'}
                        </button>
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
