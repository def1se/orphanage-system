import { useState } from 'react';
import keycloak from '../../keycloak';

export default function ProfilePage() {
  if (!keycloak.authenticated) {
    return <div className="public-container" style={{ padding: '60px 0', textAlign: 'center' }}>Пожалуйста, войдите в систему.</div>;
  }

  const parsed = keycloak.tokenParsed as any;
  const [formData, setFormData] = useState({
    firstName: parsed?.given_name || '',
    lastName: parsed?.family_name || '',
    email: parsed?.email || '',
    phone: '+7 '
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальной системе здесь будет вызов API для обновления профиля в Keycloak/Базе
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="public-container" style={{ padding: '40px 0' }}>
      <h2 className="section-title" style={{ textAlign: 'left' }}>Личный Кабинет</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40 }}>
        <div className="profile-form-card">
          <h3>Мои данные</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Имя</label>
              <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="input-field" />
            </div>
            <div className="form-group">
              <label>Фамилия</label>
              <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="input-field" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" disabled />
              <small>Email привязан к аккаунту и не может быть изменен напрямую.</small>
            </div>
            <div className="form-group">
              <label>Телефон</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-field" />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>Сохранить изменения</button>
            {saved && <span style={{ color: '#10b981', marginLeft: 16 }}>Данные успешно сохранены!</span>}
          </form>
        </div>

        <div className="profile-sidebar">
          <div className="status-card">
            <h3>Статус заявок</h3>
            <p>У вас пока нет активных заявок на усыновление или волонтерство.</p>
            <button className="btn-secondary" style={{ width: '100%', marginTop: 16 }}>Подать заявку</button>
          </div>
        </div>
      </div>
    </div>
  );
}
