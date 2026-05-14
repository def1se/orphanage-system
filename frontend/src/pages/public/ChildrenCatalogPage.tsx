import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { childrenApi } from '../../api/childrenApi'
import { childrenStore } from '../../store/dataStore'

const GENDERS: Record<string, string> = { MALE: 'Мальчик', FEMALE: 'Девочка' }
const STATUSES: Record<string, string> = {
  IN_SHELTER: 'В учреждении', UNDER_GUARDIANSHIP: 'Под опекой',
  ADOPTED: 'Усыновлён', RETURNED: 'Возвращён'
}
const STATUS_COLORS: Record<string, string> = {
  IN_SHELTER: 'badge-blue', UNDER_GUARDIANSHIP: 'badge-yellow',
  ADOPTED: 'badge-green', RETURNED: 'badge-red'
}

// Уникальные градиенты для карточек детей
const CARD_GRADIENTS = [
  'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.3))',
  'linear-gradient(135deg, rgba(236,72,153,0.4), rgba(124,58,237,0.3))',
  'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(6,182,212,0.3))',
  'linear-gradient(135deg, rgba(245,158,11,0.4), rgba(239,68,68,0.3))',
  'linear-gradient(135deg, rgba(6,182,212,0.4), rgba(16,185,129,0.3))',
  'linear-gradient(135deg, rgba(239,68,68,0.35), rgba(245,158,11,0.3))',
]

const CHILD_EMOJIS_MALE = ['👦', '🧒', '👦🏻', '👦🏼', '🧑']
const CHILD_EMOJIS_FEMALE = ['👧', '👧🏻', '👧🏼', '🧒‍♀️', '👩‍🎤']

const getAge = (birthDate: string) => {
  if (!birthDate) return null
  const d = new Date(birthDate), today = new Date()
  return today.getFullYear() - d.getFullYear() -
    (today < new Date(today.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0)
}

const getAgeLabel = (age: number | null, fromField?: number) => {
  const a = age ?? fromField ?? null
  if (a === null) return '—'
  if (a >= 11 && a <= 14) return `${a} лет`
  const last = a % 10
  if (last === 1) return `${a} год`
  if (last >= 2 && last <= 4) return `${a} года`
  return `${a} лет`
}

export default function ChildrenCatalogPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const { isError } = useQuery({
    queryKey: ['public-children'],
    queryFn: () => childrenApi.getPublic({ size: 50 }),
    retry: false,
  })

  // Всегда используем локальный store для консистентности
  const allChildren = childrenStore.getAll()

  const children = allChildren.filter((c: any) => {
    const name = `${c.firstName} ${c.lastName ?? ''}`.toLowerCase()
    if (search && !name.includes(search.toLowerCase())) return false
    if (genderFilter && c.gender !== genderFilter) return false
    const age = c.birthDate ? getAge(c.birthDate) : (c.age ?? null)
    if (ageMin && (age ?? 0) < parseInt(ageMin)) return false
    if (ageMax && (age ?? 0) > parseInt(ageMax)) return false
    return true
  })

  return (
    <>
      <div className="page-hero" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 70%)' }}>
        <div className="container">
          <div className="hero-badge">Поиск ребёнка</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Познакомьтесь с нашими детьми</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600 }}>
            Каждый ребёнок уникален и ждёт свою семью. Нажмите на карточку, чтобы узнать больше о ребёнке.
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {/* Search & Filters */}
          <div className="card" style={{ marginBottom: 40, padding: 24 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                className="search-input"
                placeholder="Поиск по имени..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 2, minWidth: 200 }}
              />
              <select className="filter-select" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
                <option value="">Все (пол)</option>
                <option value="MALE">👦 Мальчики</option>
                <option value="FEMALE">👧 Девочки</option>
              </select>
              <input
                className="search-input" style={{ maxWidth: 110 }}
                placeholder="Возраст от" type="number" min="0" max="18"
                value={ageMin} onChange={e => setAgeMin(e.target.value)}
              />
              <input
                className="search-input" style={{ maxWidth: 90 }}
                placeholder="до" type="number" min="0" max="18"
                value={ageMax} onChange={e => setAgeMax(e.target.value)}
              />
              {(search || genderFilter || ageMin || ageMax) && (
                <button className="btn btn-secondary" onClick={() => {
                  setSearch(''); setGenderFilter(''); setAgeMin(''); setAgeMax('')
                }}>
                  ✕ Сбросить
                </button>
              )}
            </div>
          </div>

          {isError && (
            <div className="alert alert-info" style={{ marginBottom: 32 }}>
              ℹ️ Показаны демонстрационные данные. Для реальных данных запустите бэкенд.
            </div>
          )}

          {children.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <div className="empty-title">Ничего не найдено</div>
              <div className="empty-text">Попробуйте изменить параметры поиска</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  Найдено детей: <strong style={{ color: 'var(--text)' }}>{children.length}</strong>
                </p>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                  Нажмите на карточку для просмотра анкеты
                </span>
              </div>

              {/* Photo grid — like ДетиЖдут style */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 24,
              }}>
                {children.map((child: any, idx: number) => {
                  const age = child.birthDate ? getAge(child.birthDate) : null
                  const ageLabel = getAgeLabel(age, child.age)
                  const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length]
                  const emoji = child.gender === 'MALE'
                    ? CHILD_EMOJIS_MALE[idx % CHILD_EMOJIS_MALE.length]
                    : CHILD_EMOJIS_FEMALE[idx % CHILD_EMOJIS_FEMALE.length]
                  const isHovered = hoveredId === child.id

                  return (
                    <div
                      key={child.id}
                      onClick={() => navigate(`/children/${child.id}`)}
                      onMouseEnter={() => setHoveredId(child.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        position: 'relative',
                        borderRadius: 20,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid var(--border)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                        boxShadow: isHovered ? '0 24px 60px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.2)',
                      }}
                    >
                      {/* Photo area */}
                      <div style={{
                        height: 260,
                        background: gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 100,
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        {child.imageUrl && !imgErrors[child.id] ? (
                          <img
                            src={child.imageUrl}
                            alt={`${child.firstName} ${child.lastName ?? ''}`}
                            style={{
                              width: '100%', height: '100%',
                              objectFit: 'cover', objectPosition: 'top center',
                              transition: 'transform 0.4s ease',
                              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                            }}
                            onError={() => setImgErrors(prev => ({ ...prev, [child.id]: true }))}
                          />
                        ) : (
                          <div style={{
                            transition: 'transform 0.3s',
                            transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                          }}>
                            {emoji}
                          </div>
                        )}

                        {/* Overlay on hover */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: isHovered ? 1 : 0,
                          transition: 'opacity 0.3s',
                        }}>
                          <span style={{
                            background: 'var(--primary)',
                            color: '#fff',
                            padding: '10px 24px',
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: 15,
                          }}>
                            Посмотреть анкету →
                          </span>
                        </div>

                        {/* Status badge */}
                        <div style={{ position: 'absolute', top: 12, right: 12 }}>
                          <span className={`badge ${STATUS_COLORS[child.status] ?? 'badge-gray'}`}
                            style={{ fontSize: 11, backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.5)' }}>
                            {STATUSES[child.status] ?? child.status}
                          </span>
                        </div>
                      </div>

                      {/* Info bar */}
                      <div style={{
                        background: 'var(--bg-surface)',
                        borderTop: '1px solid var(--border)',
                        padding: '16px 20px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                              {child.firstName} {child.lastName ?? ''}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 13, display: 'flex', gap: 10 }}>
                              <span>🎂 {ageLabel}</span>
                              <span>•</span>
                              <span>{GENDERS[child.gender] ?? child.gender}</span>
                            </div>
                          </div>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'rgba(124,58,237,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18, transition: 'all 0.2s',
                            ...(isHovered ? { background: 'var(--primary)', color: '#fff' } : {}),
                          }}>
                            →
                          </div>
                        </div>
                        {(child.shortDescription ?? child.description) && (
                          <p style={{
                            color: 'var(--text-muted)', fontSize: 13, marginTop: 10,
                            lineHeight: 1.5, display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {child.shortDescription ?? child.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* CTA */}
              <div style={{ marginTop: 60, textAlign: 'center' }}>
                <div className="card" style={{
                  maxWidth: 600, margin: '0 auto',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))',
                }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>💛</div>
                  <h3 style={{ marginBottom: 8 }}>Хотите помочь ребёнку найти семью?</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
                    Зарегистрируйтесь, чтобы оставить заявку на знакомство или задать вопросы специалисту.
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/help" className="btn btn-outline">📦 Помочь материально</Link>
                    <Link to="/volunteer" className="btn btn-primary">🤝 Стать волонтёром</Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
