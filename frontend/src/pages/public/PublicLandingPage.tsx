import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { childrenApi } from '../../api/childrenApi';

export default function PublicLandingPage() {
  const { data: publicChildren, isLoading } = useQuery({
    queryKey: ['public-children'],
    queryFn: () => childrenApi.getPublicChildren().then(r => r.data),
  });

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="public-container hero-content">
          <h1 className="hero-title">Подари тепло тем, кто в нем нуждается</h1>
          <p className="hero-subtitle">Детский дом "Светлый Путь" — это место, где дети находят поддержку, заботу и шанс на любящую семью.</p>
          <div className="hero-actions">
            <Link to="/help" className="btn-primary">Помочь сейчас</Link>
            <Link to="/events" className="btn-secondary">Стать волонтером</Link>
          </div>
        </div>
      </section>

      <section className="stories-section public-container">
        <h2 className="section-title">Истории наших детей</h2>
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#64748b' }}>Загрузка профилей...</div>
        ) : (
          <div className="stories-grid">
            {publicChildren?.content?.slice(0, 3).map((child: any) => (
              <div className="story-card" key={child.id}>
                <div className="story-image" style={{ background: child.gender === 'MALE' ? '#e0e7ff' : '#fce7f3' }}>
                  {child.photoUrl ? <img src={child.photoUrl} alt="child" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} /> : (child.gender === 'MALE' ? '👦' : '👧')}
                </div>
                <h3>{child.firstName}, {child.age} лет</h3>
                <p>{child.shortDescription || 'Добрый и ласковый ребенок, который ищет заботливую семью.'}</p>
              </div>
            ))}
            {(!publicChildren?.content || publicChildren.content.length === 0) && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b' }}>Нет открытых анкет на данный момент.</div>
            )}
          </div>
        )}
      </section>

      <section className="articles-section bg-light">
        <div className="public-container">
          <h2 className="section-title">Полезные статьи</h2>
          <div className="articles-grid">
            <div className="article-card">
              <h4>Как подготовиться к усыновлению?</h4>
              <p>Психологические аспекты и советы от экспертов Школы приемных родителей.</p>
              <a href="#">Читать далее →</a>
            </div>
            <div className="article-card">
              <h4>Мифы о детях из детских домов</h4>
              <p>Развеиваем популярные стереотипы и рассказываем правду.</p>
              <a href="#">Читать далее →</a>
            </div>
            <div className="article-card">
              <h4>Как правильно общаться с сиротами</h4>
              <p>Гайд для волонтеров: что можно и чего нельзя говорить детям.</p>
              <a href="#">Читать далее →</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
