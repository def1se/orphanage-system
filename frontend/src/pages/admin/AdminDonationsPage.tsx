import { useState } from 'react'
import { createStore } from '../../store/localStorage'

// ── Тот же ключ, что и в HowToHelpPage ──────────────────────────────────────
const donationsStore = createStore<any>('donations', [])

const PAYMENT_LABELS: Record<string, string> = {
  CARD: '💳 Банковская карта',
  SBP: '📱 СБП',
  TRANSFER: '🏦 Перевод',
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'badge-green',
  PENDING: 'badge-yellow',
  FAILED: 'badge-red',
}
const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Выполнено',
  PENDING: 'В обработке',
  FAILED: 'Ошибка',
}

// ── PDF-генерация через window.print (не требует внешних зависимостей) ────────
function generatePdfReport(donations: any[]) {
  const now = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const totalAmount = donations.reduce((s, d) => s + (Number(d.amount) || 0), 0)
  const completed = donations.filter(d => d.status === 'COMPLETED')
  const completedAmount = completed.reduce((s, d) => s + (Number(d.amount) || 0), 0)

  const rows = donations.map((d, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${i + 1}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${escHtml(d.userName || 'Аноним')}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${escHtml(d.userEmail || '—')}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;color:#7c3aed">
        ${Number(d.amount || 0).toLocaleString('ru-RU')} ₽
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${PAYMENT_LABELS[d.paymentMethod] || d.paymentMethod || '—'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">
        <span style="
          padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;
          background:${d.status === 'COMPLETED' ? '#dcfce7' : d.status === 'PENDING' ? '#fef9c3' : '#fee2e2'};
          color:${d.status === 'COMPLETED' ? '#166534' : d.status === 'PENDING' ? '#713f12' : '#991b1b'}
        ">${STATUS_LABELS[d.status] || d.status}</span>
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b">
        ${escHtml(d.createdAt || '—')}
      </td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Отчёт о пожертвованиях — ЦССВ «Светлый путь»</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #7c3aed; }
    .logo { font-size: 22px; font-weight: 800; color: #7c3aed; }
    .logo span { display: block; font-size: 13px; font-weight: 400; color: #64748b; margin-top: 2px; }
    .meta { text-align: right; font-size: 13px; color: #64748b; }
    .meta strong { display: block; font-size: 15px; color: #1e293b; margin-bottom: 4px; }
    .summary { display: flex; gap: 20px; margin-bottom: 28px; }
    .summary-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; }
    .summary-card .val { font-size: 24px; font-weight: 800; color: #7c3aed; margin-bottom: 4px; }
    .summary-card .lbl { font-size: 13px; color: #64748b; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead tr { background: #7c3aed; color: #fff; }
    thead th { padding: 10px 12px; text-align: left; font-weight: 600; }
    tbody tr:hover { background: #f8fafc; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
    @media print {
      body { padding: 16px; }
      .no-print { display: none !important; }
      thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .summary-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🏡 ЦССВ «Светлый путь»
      <span>Центр содействия семейному воспитанию</span>
    </div>
    <div class="meta">
      <strong>Отчёт о пожертвованиях</strong>
      Сформирован: ${now}
    </div>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="val">${donations.length}</div>
      <div class="lbl">Всего транзакций</div>
    </div>
    <div class="summary-card">
      <div class="val">${completed.length}</div>
      <div class="lbl">Успешных</div>
    </div>
    <div class="summary-card">
      <div class="val">${totalAmount.toLocaleString('ru-RU')} ₽</div>
      <div class="lbl">Общая сумма</div>
    </div>
    <div class="summary-card">
      <div class="val">${completedAmount.toLocaleString('ru-RU')} ₽</div>
      <div class="lbl">Сумма успешных</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>ФИО / Имя</th>
        <th>Email</th>
        <th style="text-align:right">Сумма</th>
        <th>Способ оплаты</th>
        <th>Статус</th>
        <th>Дата</th>
      </tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="7" style="padding:20px;text-align:center;color:#94a3b8">Пожертвований ещё нет</td></tr>'}</tbody>
  </table>

  <div class="footer">
    ЦССВ «Светлый путь» · г. Москва, ул. Примерная, д. 1 · info@svetly-put.ru · +7 (495) 000-00-00
  </div>

  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=1100,height=750')
  if (!win) {
    alert('Откройте доступ к всплывающим окнам в браузере и попробуйте ещё раз.')
    return
  }
  win.document.write(html)
  win.document.close()
}

function escHtml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDonationsPage() {
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const donations: any[] = donationsStore.getAll()

  const filtered = donations.filter(d => {
    const q = search.toLowerCase()
    if (q && !String(d.userName || '').toLowerCase().includes(q) && !String(d.userEmail || '').toLowerCase().includes(q)) return false
    if (statusFilter && d.status !== statusFilter) return false
    return true
  })

  const totalAmount = donations.reduce((s, d) => s + (Number(d.amount) || 0), 0)
  const completedAmount = donations
    .filter(d => d.status === 'COMPLETED')
    .reduce((s, d) => s + (Number(d.amount) || 0), 0)

  const removeDonation = (idx: number) => {
    if (!confirm('Удалить запись о пожертвовании?')) return
    const all = donationsStore.getAll()
    const updated = all.filter((_: any, i: number) => i !== idx)
    // Перезаписываем через reset + add
    localStorage.setItem('donations', JSON.stringify(updated))
    refresh()
  }

  return (
    <div>
      <div className="admin-header">
        <h2>💰 Пожертвования</h2>
        <p>Все финансовые взносы пользователей · Всего транзакций: <strong>{donations.length}</strong></p>
      </div>

      {/* Итоговые карточки */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { icon: '💳', label: 'Всего транзакций', value: String(donations.length), color: '#7c3aed' },
          { icon: '✅', label: 'Успешных', value: String(donations.filter(d => d.status === 'COMPLETED').length), color: '#10b981' },
          { icon: '💰', label: 'Общая сумма', value: `${totalAmount.toLocaleString('ru-RU')} ₽`, color: '#06b6d4' },
          { icon: '✔️', label: 'Сумма успешных', value: `${completedAmount.toLocaleString('ru-RU')} ₽`, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="card stat-card" style={{ border: `1px solid ${s.color}30` }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            className="search-input"
            placeholder="Поиск по ФИО / email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Все статусы</option>
            <option value="COMPLETED">✅ Выполнено</option>
            <option value="PENDING">⏳ В обработке</option>
            <option value="FAILED">❌ Ошибка</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => generatePdfReport(donations)}
          title="Сформировать PDF-отчёт и открыть диалог печати"
        >
          📄 Скачать отчёт (PDF)
        </button>
      </div>

      {/* Таблица */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ФИО / Имя</th>
                <th>Email</th>
                <th style={{ textAlign: 'right' }}>Сумма</th>
                <th>Способ оплаты</th>
                <th>Статус</th>
                <th>Дата</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                    {search || statusFilter ? 'По вашему запросу ничего не найдено' : 'Пожертвований ещё нет'}
                  </td>
                </tr>
              ) : (
                filtered.map((d: any, i: number) => {
                  // Ищем реальный индекс для удаления
                  const realIdx = donations.indexOf(d)
                  return (
                    <tr key={i}>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{realIdx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{d.userName || 'Аноним'}</div>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d.userEmail || '—'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary-light)', fontSize: 15 }}>
                        {Number(d.amount || 0).toLocaleString('ru-RU')} ₽
                      </td>
                      <td style={{ fontSize: 13 }}>{PAYMENT_LABELS[d.paymentMethod] || d.paymentMethod || '—'}</td>
                      <td>
                        <span className={`badge ${STATUS_COLORS[d.status] || 'badge-gray'}`}>
                          {STATUS_LABELS[d.status] || d.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.createdAt || '—'}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          title="Удалить запись"
                          onClick={() => removeDonation(realIdx)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)', textAlign: 'right' }}>
          Показано: {filtered.length} из {donations.length}
        </div>
      )}
    </div>
  )
}
