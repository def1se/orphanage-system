import { useQuery } from '@tanstack/react-query'
import { childrenApi } from '../api/childrenApi'
import { staffApi } from '../api/staffApi'
import { adoptionApi } from '../api/adoptionApi'
import { inventoryApi } from '../api/inventoryApi'

export default function DashboardPage() {
  const { data: children } = useQuery({
    queryKey: ['children'],
    queryFn: () => childrenApi.getAll(0, 1).then(r => r.data),
  })
  const { data: staff } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffApi.getAll(0, 1).then(r => r.data),
  })
  const { data: adoptions } = useQuery({
    queryKey: ['adoptions'],
    queryFn: () => adoptionApi.getAll(0).then(r => r.data),
  })
  const { data: lowStock } = useQuery({
    queryKey: ['inventory-low'],
    queryFn: () => inventoryApi.getLowStock().then(r => r.data),
  })

  const stats = [
    { label: 'Всего Воспитанников',    value: children?.totalElements ?? '—', color: '#6c8eff', icon: '👶' },
    { label: 'Штат Сотрудников',        value: staff?.totalElements ?? '—',    color: '#ff7eb3', icon: '👥' },
    { label: 'Кандидаты (Усынов.)',  value: adoptions?.totalElements ?? '—',color: '#4ade80', icon: '💝' },
    { label: 'Дефицит на складе',  value: lowStock?.length ?? '—',        color: '#fbbf24', icon: '📦', warn: true },
  ]

  // Mock data for the new complex V4 modules (since backend APIs are pending)
  const legalStatuses = [
    { id: 1, child: 'Смирнов А.', status: 'Лишение прав', court: 'Решение №123', alimony: 'Счет открыт' },
    { id: 2, child: 'Козлова Е.', status: 'Ограничение', court: 'В процессе', alimony: 'Нет данных' }
  ];

  const adoptionPipeline = [
    { id: 1, applicant: 'Смирнов С.И.', stage: 'Подбор ребенка (Matching)', psychScore: 85, ready: true },
    { id: 2, applicant: 'Козлова А.С.', stage: 'ШПР (Обучение)', psychScore: 60, ready: false }
  ];

  const procurements = [
    { id: 1, req: 'Завхоз', item: 'Матрасы (15 шт)', status: 'Одобрено', budget: '50 000 ₽' },
    { id: 2, req: 'Медсестра', item: 'Витамины', status: 'Ожидает', budget: '15 000 ₽' }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Панель Управления Директора</div>
          <div className="page-subtitle">Комплексный мониторинг процессов детского дома (ЦССВ)</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ '--accent-color': s.color } as React.CSSProperties}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.warn ? '⚠️ ' : ''}{s.label}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Legal & Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        
        <div className="table-wrapper" style={{ marginTop: 0 }}>
          <div className="table-toolbar">
            <span style={{ fontWeight: 600, color: '#334155' }}>⚖️ Социально-правовой статус (Мониторинг судов)</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Воспитанник</th>
                <th>Статус родителей</th>
                <th>Суд</th>
                <th>Алименты</th>
              </tr>
            </thead>
            <tbody>
              {legalStatuses.map(ls => (
                <tr key={ls.id}>
                  <td style={{ fontWeight: 500 }}>{ls.child}</td>
                  <td><span className="badge badge-low-stock">{ls.status}</span></td>
                  <td>{ls.court}</td>
                  <td>{ls.alimony}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-wrapper" style={{ marginTop: 0 }}>
          <div className="table-toolbar">
            <span style={{ fontWeight: 600, color: '#334155' }}>🔄 Воронка кандидатов в опекуны (Pipeline)</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Кандидат</th>
                <th>Этап воронки</th>
                <th>Балл ШПР</th>
              </tr>
            </thead>
            <tbody>
              {adoptionPipeline.map(ap => (
                <tr key={ap.id}>
                  <td style={{ fontWeight: 500 }}>{ap.applicant}</td>
                  <td>
                    <span className={`badge ${ap.ready ? 'badge-active' : ''}`}>{ap.stage}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3 }}>
                        <div style={{ width: `${ap.psychScore}%`, height: '100%', background: ap.psychScore > 70 ? '#4ade80' : '#fbbf24', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12 }}>{ap.psychScore}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Row 2: Procurement & Low Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        
        <div className="table-wrapper" style={{ marginTop: 0 }}>
          <div className="table-toolbar">
            <span style={{ fontWeight: 600, color: '#334155' }}>🛒 Заявки на закупку (Бюджетирование)</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Инициатор</th>
                <th>Предмет</th>
                <th>Бюджет</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {procurements.map(p => (
                <tr key={p.id}>
                  <td>{p.req}</td>
                  <td style={{ fontWeight: 500 }}>{p.item}</td>
                  <td>{p.budget}</td>
                  <td><span className={`badge ${p.status === 'Одобрено' ? 'badge-active' : 'badge-low-stock'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {lowStock && lowStock.length > 0 ? (
          <div className="table-wrapper" style={{ marginTop: 0 }}>
            <div className="table-toolbar">
              <span style={{ fontWeight: 600, color: '#fbbf24' }}>⚠️ Критичный дефицит на складе</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th>Остаток</th>
                  <th>Минимум</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.slice(0, 4).map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td style={{ color: '#f87171', fontWeight: 600 }}>{item.quantity} {item.unit}</td>
                    <td style={{ color: '#8892a4' }}>{item.minQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-wrapper" style={{ marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#8892a4' }}>Склад в норме</span>
          </div>
        )}
      </div>

    </div>
  )
}

