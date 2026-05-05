import { useState } from 'react'
import { Link } from 'react-router-dom'
import keycloak from '../../keycloak'

const MOCK_STORIES = [
  { id: 1, name: 'Алёша', age: 7, storyText: 'Алёша попал в нашу семью три года назад в возрасте 4 лет. Мы долго ждали и наконец решились. Сейчас он учится во втором классе, обожает рисовать и занимается в секции по плаванию. Каждый день он удивляет нас своей добротой и открытостью. Мы не можем представить нашу жизнь без него.', family: 'Семья Петровых', year: 2023, isAnonymous: false },
  { id: 2, name: 'Сестрёнки', age: 0, storyText: 'Мы взяли двух сестёр — Машу и Дашу. Поначалу было непросто, но любовь и терпение творят чудеса. Сейчас девочки расцвели, стали общительными и счастливыми. Старшая готовится к выпускным экзаменам, младшая мечтает стать ветеринаром.', family: 'Семья Ивановых', year: 2022, isAnonymous: false },
  { id: 3, name: 'Антон', age: 14, storyText: 'Антон пришёл к нам подростком — это непростой возраст. Мы много разговаривали, поддерживали его интерес к программированию. Сейчас он студент технического колледжа, участвует в олимпиадах. Горжусь им бесконечно.', family: 'Семья Соколовых', year: 2021, isAnonymous: false },
  { id: 4, name: '—', age: 0, storyText: 'Когда мы впервые увидели нашего сына в детском доме, он прятался в углу и не хотел общаться. Прошло два года — и я не узнаю этого улыбчивого, активного мальчика. Благодарим весь персонал «Светлого Пути» за работу и поддержку.', family: 'Анонимная семья', year: 2024, isAnonymous: true },
  { id: 5, name: 'Вика', age: 6, storyText: 'Виктория сразу покорила наши сердца своей улыбкой. Мы думали, что готовимся к трудностям — но она так легко вошла в нашу жизнь, словно всегда была с нами. Сейчас она ходит в первый класс и уже читает лучше всех в классе!', family: 'Семья Козловых', year: 2024, isAnonymous: false },
  { id: 6, name: 'Братья', age: 0, storyText: 'Три брата — Коля, Серёжа и Ваня. Мы не могли разлучить их. Да, это вызов — воспитывать троих сразу. Но их привязанность друг к другу и к нам делает наш дом настоящим живым и тёплым местом.', family: 'Семья Морозовых', year: 2023, isAnonymous: false },
]

export default function HappyStoriesPage() {
  const [selected, setSelected] = useState<any>(null)

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>💛 Истории счастливых семей</h1>
          <p>Дети нашего детского дома, которые уже обрели любящие семьи. Публикуются с согласия семей и воспитанников.</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="alert alert-info" style={{ marginBottom: 32 }}>
            💡 Хотите тоже стать частью такой истории? <Link to="/children" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Познакомьтесь с нашими детьми →</Link>
          </div>
          <div className="grid-3">
            {MOCK_STORIES.map(s => (
              <div key={s.id} className="card story-card" style={{ cursor: 'pointer' }} onClick={() => setSelected(s)}>
                <div className="quote">"</div>
                <p style={{ WebkitLineClamp: 4, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {s.storyText}
                </p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="author">{s.isAnonymous ? 'Анонимная семья' : s.family}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{s.year} год</div>
                    </div>
                    {!s.isAnonymous && s.name !== '—' && <span className="tag">{s.name}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingBottom: 80 }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '48px 40px', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.08))' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
            <h2 style={{ marginBottom: 12 }}>Готовы написать свою историю?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
              Начните с знакомства — это ни к чему не обязывает. Просто познакомьтесь с ребёнком.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/children" className="btn btn-primary btn-lg">👶 Каталог детей</Link>
              {!keycloak.authenticated && (
                <button className="btn btn-secondary btn-lg" onClick={() => keycloak.login()}>Зарегистрироваться</button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Story Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">История семьи</div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ fontSize: 36, color: 'var(--primary-light)', marginBottom: 16 }}>"</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>{selected.storyText}</p>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{selected.isAnonymous ? 'Анонимная семья' : selected.family}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{selected.year} год</div>
              </div>
              <Link to="/adoption-request" className="btn btn-primary btn-sm" onClick={() => setSelected(null)}>
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
