import { useState } from 'react'
import { needsStore } from '../../store/dataStore'

const CATS = ['CLOTHING', 'EDUCATION', 'HOUSEHOLD', 'HEALTH', 'FOOD', 'OTHER']
const PRIORITIES: Record<string, string> = { HIGH: 'Срочно', MEDIUM: 'Нужно', LOW: 'Желательно' }
const P_COLORS: Record<string, string> = { HIGH: 'badge-red', MEDIUM: 'badge-yellow', LOW: 'badge-blue' }
const EMPTY = { itemName: '', category: 'CLOTHING', quantityNeeded: 10, quantityCurrent: 0, priority: 'MEDIUM', price: 0 }

const ORDERS_KEY = 'material_orders'
const readOrders = (): any[] => {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') } catch { return [] }
}
const writeOrders = (items: any[]) => localStorage.setItem(ORDERS_KEY, JSON.stringify(items))

export default function AdminNeedsPage() {
  const [needsTick, setNeedsTick] = useState(0)
  const [orders, setOrders] = useState<any[]>(() => readOrders())
  const [activeTab, setActiveTab] = useState<'needs' | 'orders'>('needs')
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)

  const needs = needsStore.getAll()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (modal === 'create') needsStore.add(form)
    else needsStore.update(editing.id, form)
    setNeedsTick(n => n + 1)
    setModal(null)
  }

  const removeOrder = (idx: number) => {
    const updated = orders.filter((_, i) => i !== idx)
    writeOrders(updated)
    setOrders([...updated])
  }

  const updateOrderStatus = (idx: number, status: string) => {
    const updated = orders.map((o, i) => i === idx ? { ...o, status } : o)
    writeOrders(updated)
    setOrders(updated)
  }

  const pendingCount = orders.filter(o => o.status === 'PENDING').length

  return (
    <div key={needsTick}>
      <div className="admin-header">
        <h2>📦 Потребности детского дома</h2>
        <p>Управление списком необходимых вещей и предметов</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}>
          <button className={`tab ${activeTab === 'needs' ? 'active' : ''}`} onClick={() => setActiveTab('needs')}>📦 Справочник потребностей</button>
          <button className={`tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>🚚 Заказы помощи ({pendingCount} нов.)</button>
        </div>
        {activeTab === 'needs' && (
          <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal('create') }}>+ Добавить позицию</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* ─── TAB: NEEDS ─── */}
        {activeTab === 'needs' && needs.length === 0 && (
          <div className="empty-state"><div className="empty-icon">📦</div><div className="empty-title">Список потребностей пуст</div></div>
        )}

        {activeTab === 'needs' && needs.map((n: any) => {
          const pct = n.quantityNeeded > 0 ? Math.round((n.quantityCurrent / n.quantityNeeded) * 100) : 0
          return (
            <div key={n.id} className={`card ${n.priority === 'HIGH' ? 'priority-high' : n.priority === 'MEDIUM' ? 'priority-medium' : ''}`} style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span className="tag">{n.category}</span>
                    <span className={`badge ${P_COLORS[n.priority]}`}>{PRIORITIES[n.priority]}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{n.itemName}</div>
                  <div style={{ display: 'flex', gap: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
                    <span>Есть: {n.quantityCurrent} шт.</span>
                    <span>Нужно: {n.quantityNeeded} шт.</span>
                    <span>Цена: {(n.price || 0).toLocaleString()} ₽/шт.</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: 8, width: 300 }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{pct}% обеспечено</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(n); setForm({ ...n }); setModal('edit') }}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => { if (confirm('Удалить?')) { needsStore.remove(n.id); setNeedsTick(t => t + 1) } }}>🗑️</button>
                </div>
              </div>
            </div>
          )
        })}

        {/* ─── TAB: ORDERS ─── */}
        {activeTab === 'orders' && orders.length === 0 && (
          <div className="empty-state"><div className="empty-icon">📭</div><div className="empty-title">Заказов пока нет</div></div>
        )}

        {activeTab === 'orders' && orders.map((o: any, idx: number) => (
          <div key={idx} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Заказ #{String(o.id).slice(-6)}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{o.createdAt}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select
                  className="form-control"
                  style={{ padding: '4px 8px', fontSize: 13, height: 'auto', minWidth: 140 }}
                  value={o.status}
                  onChange={e => updateOrderStatus(idx, e.target.value)}
                >
                  <option value="PENDING">⏳ В обработке</option>
                  <option value="CONFIRMED">🤝 Подтверждён</option>
                  <option value="DELIVERED">✅ Доставлен</option>
                  <option value="CANCELLED">❌ Отменён</option>
                </select>
                <button className="btn btn-danger btn-sm" onClick={() => removeOrder(idx)}>🗑️</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 16, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Заказчик:</div>
                <div style={{ fontSize: 14 }}>{o.userName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{o.userEmail}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Способ:</div>
                <div style={{ fontSize: 14 }}>{o.deliveryMethod === 'DELIVERY' ? '🚚 Доставка' : '🚶 Самовывоз'}</div>
                {o.address && <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{o.address}</div>}
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Сумма:</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary-light)' }}>{(o.totalAmount || 0).toLocaleString()} ₽</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Состав заказа:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(o.items || []).map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>{item.itemName}</span>
                    <span style={{ fontWeight: 600 }}>{item.quantity} шт.</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal === 'create' ? '➕ Новая позиция' : '✏️ Редактировать'}</div>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Название *</label>
                <input className="form-control" required value={form.itemName} onChange={e => setForm((f: any) => ({ ...f, itemName: e.target.value }))} placeholder="Напр.: Зимние куртки" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Категория</label>
                  <select className="form-control" value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Приоритет</label>
                  <select className="form-control" value={form.priority} onChange={e => setForm((f: any) => ({ ...f, priority: e.target.value }))}>
                    {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Текущее кол-во</label>
                  <input className="form-control" type="number" min="0" value={form.quantityCurrent} onChange={e => setForm((f: any) => ({ ...f, quantityCurrent: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Необходимо</label>
                  <input className="form-control" type="number" min="1" value={form.quantityNeeded} onChange={e => setForm((f: any) => ({ ...f, quantityNeeded: parseInt(e.target.value) || 1 }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Цена (₽/шт.)</label>
                  <input className="form-control" type="number" min="0" value={form.price} onChange={e => setForm((f: any) => ({ ...f, price: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary">{modal === 'create' ? 'Добавить' : 'Сохранить'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
