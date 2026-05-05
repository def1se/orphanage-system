import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adoptionApi, AdoptionRequest } from '../api/adoptionApi'

const TYPE_LABELS: Record<string, string> = {
  ADOPTION: 'Усыновление', GUARDIANSHIP: 'Опека', FOSTER_CARE: 'Патронат',
}

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'Подана', UNDER_REVIEW: 'На рассмотрении',
  APPROVED: 'Одобрена', REJECTED: 'Отклонена',
  COMPLETED: 'Завершена', WITHDRAWN: 'Отозвана',
}

const STATUS_BADGE: Record<string, string> = {
  SUBMITTED: 'badge-submitted', UNDER_REVIEW: 'badge-review',
  APPROVED: 'badge-approved', REJECTED: 'badge-rejected',
  COMPLETED: 'badge-active', WITHDRAWN: 'badge-transferred',
}

const NEXT_STATUSES: Record<string, string[]> = {
  SUBMITTED: ['UNDER_REVIEW', 'WITHDRAWN'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED'],
  APPROVED: ['COMPLETED'],
  REJECTED: [], COMPLETED: [], WITHDRAWN: [],
}

export default function AdoptionPage() {
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['adoptions', page, statusFilter],
    queryFn: () =>
      statusFilter
        ? adoptionApi.getByStatus(statusFilter, page).then(r => r.data)
        : adoptionApi.getAll(page).then(r => r.data),
  })

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adoptionApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adoptions'] }),
  })

  const requests = data?.content ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Усыновление и опека</div>
          <div className="page-subtitle">{data?.totalElements ?? 0} заявок</div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <select
            id="adoption-status-filter"
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
        ) : requests.length === 0 ? (
          <div className="empty-state"><span className="icon">💝</span><p>Заявки не найдены</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Заявитель</th>
                <th>Email</th>
                <th>Тип</th>
                <th>ID ребёнка</th>
                <th>Статус</th>
                <th>Дата подачи</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: AdoptionRequest) => (
                <tr key={r.id}>
                  <td style={{ color: '#8892a4', fontFamily: 'monospace' }}>#{r.id}</td>
                  <td style={{ fontWeight: 600 }}>
                    {r.applicantLastName} {r.applicantFirstName}
                  </td>
                  <td style={{ color: '#8892a4', fontSize: 13 }}>{r.applicantEmail ?? '—'}</td>
                  <td>{TYPE_LABELS[r.requestType]}</td>
                  <td style={{ color: '#6c8eff' }}>#{r.childId}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td style={{ color: '#8892a4' }}>
                    {new Date(r.submissionDate).toLocaleDateString('ru-RU')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(NEXT_STATUSES[r.status] ?? []).map(ns => (
                        <button
                          key={ns}
                          id={`adoption-${r.id}-${ns}`}
                          className="btn btn-ghost btn-sm"
                          disabled={changeStatus.isPending}
                          onClick={() => changeStatus.mutate({ id: r.id, status: ns })}
                        >
                          {STATUS_LABELS[ns]}
                        </button>
                      ))}
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
