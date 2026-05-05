import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { childrenApi, Child } from '../api/childrenApi'

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'В детском доме',
  UNDER_GUARDIANSHIP: 'Под опекой',
  ADOPTED: 'Усыновлён',
  GRADUATED: 'Выпускник',
  TRANSFERRED: 'Переведён',
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'badge-active',
  UNDER_GUARDIANSHIP: 'badge-guardianship',
  ADOPTED: 'badge-adopted',
  GRADUATED: 'badge-transferred',
  TRANSFERRED: 'badge-transferred',
}

export default function ChildrenPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const queryKey = search
    ? ['children-search', search, page]
    : statusFilter
    ? ['children-status', statusFilter, page]
    : ['children', page]

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => {
      if (search) return childrenApi.search(search, page).then(r => r.data)
      if (statusFilter) return childrenApi.getByStatus(statusFilter, page).then(r => r.data)
      return childrenApi.getAll(page).then(r => r.data)
    },
  })

  const children = data?.content ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Дети</div>
          <div className="page-subtitle">
            {data?.totalElements ?? 0} записей в реестре
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <input
            id="children-search"
            className="search-input"
            placeholder="Поиск по имени или фамилии..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
          <select
            id="children-status-filter"
            className="select"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(0) }}
          >
            <option value="">Все статусы</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : children.length === 0 ? (
          <div className="empty-state">
            <span className="icon">👶</span>
            <p>Записи не найдены</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Возраст</th>
                <th>Пол</th>
                <th>Статус</th>
                <th>Комната</th>
                <th>Дата поступления</th>
              </tr>
            </thead>
            <tbody>
              {children.map((child: Child) => (
                <tr key={child.id}>
                  <td style={{ fontWeight: 600 }}>
                    {child.lastName} {child.firstName} {child.middleName ?? ''}
                  </td>
                  <td>{child.age} лет</td>
                  <td>{child.gender === 'MALE' ? '♂ Муж.' : '♀ Жен.'}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[child.status]}`}>
                      {STATUS_LABELS[child.status] ?? child.status}
                    </span>
                  </td>
                  <td style={{ color: '#8892a4' }}>{child.roomNumber ?? '—'}</td>
                  <td style={{ color: '#8892a4' }}>
                    {new Date(child.admissionDate).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <span>Страница {page + 1} из {totalPages}</span>
          <div className="pagination-btns">
            <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Назад</button>
            <button className="btn btn-ghost btn-sm" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Вперёд →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
