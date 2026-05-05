import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi, InventoryItem } from '../api/inventoryApi'

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: '🍎 Питание', MEDICINE: '💊 Медикаменты', CLOTHING: '👕 Одежда',
  FURNITURE: '🪑 Мебель', EDUCATIONAL: '📚 Учебное', HYGIENE: '🧼 Гигиена',
  SPORTS: '⚽ Спорт', DONATION: '🎁 Пожертвования', OTHER: '📦 Прочее',
}

const STATUS_BADGE: Record<string, string> = {
  IN_STOCK: 'badge-in-stock', LOW_STOCK: 'badge-low-stock',
  OUT_OF_STOCK: 'badge-out-stock', EXPIRED: 'badge-rejected', WRITTEN_OFF: 'badge-transferred',
}

const STATUS_LABELS: Record<string, string> = {
  IN_STOCK: 'В наличии', LOW_STOCK: 'Мало', OUT_OF_STOCK: 'Нет в наличии',
  EXPIRED: 'Просрочено', WRITTEN_OFF: 'Списано',
}

export default function InventoryPage() {
  const [page, setPage] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['inventory', page, categoryFilter],
    queryFn: () =>
      categoryFilter
        ? inventoryApi.getByCategory(categoryFilter, page).then(r => r.data)
        : inventoryApi.getAll(page).then(r => r.data),
  })

  const adjust = useMutation({
    mutationFn: ({ id, delta }: { id: number; delta: number }) =>
      inventoryApi.adjustQuantity(id, delta),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }),
  })

  const items = data?.content ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Склад и снабжение</div>
          <div className="page-subtitle">{data?.totalElements ?? 0} позиций</div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <select
            id="inventory-category-filter"
            className="select"
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setPage(0) }}
          >
            <option value="">Все категории</option>
            {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state"><span className="icon">📦</span><p>Позиции не найдены</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Категория</th>
                <th>Количество</th>
                <th>Цена за ед.</th>
                <th>Поставщик</th>
                <th>Статус</th>
                <th>Срок годности</th>
                <th>Движение</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: InventoryItem) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td style={{ fontSize: 13 }}>{CATEGORY_LABELS[item.category] ?? item.category}</td>
                  <td>
                    <span style={{ color: item.isLowStock ? '#fbbf24' : '#e2e8f0', fontWeight: 600 }}>
                      {item.quantity} {item.unit ?? ''}
                    </span>
                  </td>
                  <td style={{ color: '#8892a4' }}>
                    {item.unitPrice ? `${item.unitPrice} ₽` : '—'}
                  </td>
                  <td style={{ color: '#8892a4', fontSize: 13 }}>{item.supplier ?? '—'}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[item.status]}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td style={{ color: '#8892a4', fontSize: 13 }}>
                    {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('ru-RU') : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        id={`inventory-${item.id}-minus`}
                        className="btn btn-ghost btn-sm"
                        disabled={adjust.isPending}
                        onClick={() => adjust.mutate({ id: item.id, delta: -1 })}
                      >−</button>
                      <button
                        id={`inventory-${item.id}-plus`}
                        className="btn btn-ghost btn-sm"
                        disabled={adjust.isPending}
                        onClick={() => adjust.mutate({ id: item.id, delta: 1 })}
                      >+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <span>Страница {page + 1} из {data?.totalPages ?? 1}</span>
          <div className="pagination-btns">
            <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Назад</button>
            <button className="btn btn-ghost btn-sm" disabled={page + 1 >= (data?.totalPages ?? 1)} onClick={() => setPage(p => p + 1)}>Вперёд →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
