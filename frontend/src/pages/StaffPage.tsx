import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { staffApi, StaffMember } from '../api/staffApi'

const POSITION_LABELS: Record<string, string> = {
  DIRECTOR: 'Директор', DEPUTY_DIRECTOR: 'Зам. директора',
  EDUCATOR: 'Воспитатель', SENIOR_EDUCATOR: 'Ст. воспитатель',
  DOCTOR: 'Врач', NURSE: 'Медсестра',
  PSYCHOLOGIST: 'Психолог', SOCIAL_WORKER: 'Соц. работник',
  ACCOUNTANT: 'Бухгалтер', SECURITY: 'Охрана',
  COOK: 'Повар', CLEANER: 'Уборщик',
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'badge-active',
  ON_LEAVE: 'badge-submitted',
  DISMISSED: 'badge-rejected',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Работает', ON_LEAVE: 'В отпуске', DISMISSED: 'Уволен',
}

export default function StaffPage() {
  const [page, setPage] = useState(0)
  const [positionFilter, setPositionFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['staff', page, positionFilter],
    queryFn: () =>
      positionFilter
        ? staffApi.getByPosition(positionFilter, page).then(r => r.data)
        : staffApi.getAll(page).then(r => r.data),
  })

  const members = data?.content ?? []

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Персонал</div>
          <div className="page-subtitle">{data?.totalElements ?? 0} сотрудников</div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <select
            id="staff-position-filter"
            className="select"
            value={positionFilter}
            onChange={e => { setPositionFilter(e.target.value); setPage(0) }}
          >
            <option value="">Все должности</option>
            {Object.entries(POSITION_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : members.length === 0 ? (
          <div className="empty-state"><span className="icon">👥</span><p>Записи не найдены</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Должность</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Статус</th>
                <th>Дата приёма</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m: StaffMember) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>
                    {m.lastName} {m.firstName} {m.middleName ?? ''}
                  </td>
                  <td>{POSITION_LABELS[m.position] ?? m.position}</td>
                  <td style={{ color: '#8892a4', fontSize: 13 }}>{m.email ?? '—'}</td>
                  <td style={{ color: '#8892a4', fontSize: 13 }}>{m.phone ?? '—'}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[m.status]}`}>
                      {STATUS_LABELS[m.status] ?? m.status}
                    </span>
                  </td>
                  <td style={{ color: '#8892a4' }}>
                    {new Date(m.hireDate).toLocaleDateString('ru-RU')}
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
