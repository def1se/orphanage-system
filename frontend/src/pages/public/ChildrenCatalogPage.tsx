import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { childrenApi } from '../../api/childrenApi'

const GENDERS: Record<string, string> = { MALE: 'Мальчик', FEMALE: 'Девочка' }
const STATUSES: Record<string, string> = {
  IN_SHELTER: 'В учреждении', UNDER_GUARDIANSHIP: 'Под опекой',
  ADOPTED: 'Усыновлён', RETURNED: 'Возвращён'
}
const STATUS_COLORS: Record<string, string> = {
  IN_SHELTER: 'badge-blue', UNDER_GUARDIANSHIP: 'badge-yellow',
  ADOPTED: 'badge-green', RETURNED: 'badge-red'
}

// Mock data for when API is unavailable
const MOCK_CHILDREN = [
  { id: 1, firstName: 'Алёша', age: 7, gender: 'MALE', status: 'IN_SHELTER', shortDescription: 'Добрый и весёлый мальчик. Любит рисовать и играть в футбол.' },
  { id: 2, firstName: 'Катя', age: 10, gender: 'FEMALE', status: 'IN_SHELTER', shortDescription: 'Умная и активная девочка. Отлично учится, любит читать книги.' },
  { id: 3, firstName: 'Миша', age: 5, gender: 'MALE', status: 'IN_SHELTER', shortDescription: 'Маленький и любознательный. Интересуется животными.' },
  { id: 4, firstName: 'Аня', age: 12, gender: 'FEMALE', status: 'IN_SHELTER', shortDescription: 'Творческая и талантливая. Занимается танцами.' },
  { id: 5, firstName: 'Дима', age: 9, gender: 'MALE', status: 'IN_SHELTER', shortDescription: 'Спортивный и энергичный. Любит конструкторы.' },
  { id: 6, firstName: 'Настя', age: 6, gender: 'FEMALE', status: 'IN_SHELTER', shortDescription: 'Нежная и добрая. Любит помогать взрослым.' },
]

export default function ChildrenCatalogPage() {
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-children'],
    queryFn: () => childrenApi.getPublic({ size: 50 }),
    retry: false,
  })

  const children = (data?.content ?? MOCK_CHILDREN).filter((c: any) => {
    const name = `${c.firstName} ${c.lastName ?? ''}`.toLowerCase()
    if (search && !name.includes(search.toLowerCase())) return false
    if (genderFilter && c.gender !== genderFilter) return false
    if (ageMin && (c.age ?? 0) < parseInt(ageMin)) return false
    if (ageMax && (c.age ?? 0) > parseInt(ageMax)) return false
    return true
  })

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>👶 Познакомьтесь с нашими детьми</h1>
          <p>Каждый ребёнок уникален и ждёт свою семью. Персональные данные защищены согласно законодательству.</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {/* Search & Filters */}
          <div className="card" style={{ marginBottom: 32, padding: 20 }}>
            <div className="search-bar" style={{ marginBottom: 0 }}>
              <input className="search-input" placeholder="🔍 Поиск по имени..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="filter-select" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
                <option value="">Все (пол)</option>
                <option value="MALE">Мальчики</option>
                <option value="FEMALE">Девочки</option>
              </select>
              <input className="search-input" style={{ maxWidth: 100 }} placeholder="Возраст от" type="number" value={ageMin} onChange={e => setAgeMin(e.target.value)} />
              <input className="search-input" style={{ maxWidth: 100 }} placeholder="до" type="number" value={ageMax} onChange={e => setAgeMax(e.target.value)} />
              {(search || genderFilter || ageMin || ageMax) && (
                <button className="btn btn-secondary" onClick={() => { setSearch(''); setGenderFilter(''); setAgeMin(''); setAgeMax('') }}>
                  Сбросить
                </button>
              )}
            </div>
          </div>

          {isError && (
            <div className="alert alert-info" style={{ marginBottom: 24 }}>
              ℹ️ Показаны демонстрационные данные. Подключите бэкенд для получения реальных данных.
            </div>
          )}

          {isLoading ? (
            <div className="loading"><div className="spinner" /><p>Загрузка...</p></div>
          ) : children.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Ничего не найдено</div>
              <div className="empty-text">Попробуйте изменить параметры поиска</div>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>
                Найдено: {children.length} {children.length === 1 ? 'ребёнок' : 'детей'}
              </p>
              <div className="grid-3">
                {children.map((child: any) => (
                  <div key={child.id} className="card child-card">
                    <div className="child-card-img-placeholder">
                      {child.gender === 'MALE' ? '👦' : '👧'}
                    </div>
                    <h3>{child.firstName} {child.lastName ?? ''}</h3>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 6 }}>
                      {child.age !== undefined && <span className="tag">🎂 {child.age} лет</span>}
                      {child.gender && <span className="tag">{GENDERS[child.gender] ?? child.gender}</span>}
                      {child.status && <span className={`badge ${STATUS_COLORS[child.status] ?? 'badge-gray'}`}>{STATUSES[child.status] ?? child.status}</span>}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>
                      {child.shortDescription ?? child.description ?? 'Информация о ребёнке доступна после регистрации.'}
                    </p>
                    <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                      <Link to="/adoption-request" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                        Оставить заявку
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
