import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../../api/inventoryApi';
import { notificationApi } from '../../api/notificationApi';

export default function HelpPage() {
  const [amount, setAmount] = useState(1000);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Получаем дефицит из бэкенда!
  const { data: lowStock } = useQuery({
    queryKey: ['inventory-low'],
    queryFn: () => inventoryApi.getLowStock().then(r => r.data),
  });

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await notificationApi.sendEmail({
        to: email,
        subject: `Пожертвование ${amount} ₽ для ЦССВ Светлый Путь`,
        text: `Спасибо за ваше пожертвование в размере ${amount} рублей! Электронный чек прикреплен к этому письму.`
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (e) {
      alert('Произошла ошибка при обработке платежа или отправке письма.');
    }
  };

  return (
    <div className="public-container" style={{ padding: '40px 0' }}>
      <h1 className="section-title">Как вы можете помочь</h1>
      <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: 40 }}>Даже небольшой вклад меняет жизни.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        
        {/* Финансовая помощь */}
        <div className="help-card">
          <h3>💳 Финансовая помощь</h3>
          <p style={{ color: '#64748b', marginBottom: 20 }}>Ваши пожертвования идут на закупку оборудования, лечение и праздники для детей.</p>
          
          <form onSubmit={handleDonation}>
            <div className="donation-amounts">
              {[500, 1000, 3000, 5000].map(val => (
                <button 
                  type="button" 
                  key={val} 
                  className={`amt-btn ${amount === val ? 'active' : ''}`}
                  onClick={() => setAmount(val)}
                >
                  {val} ₽
                </button>
              ))}
            </div>
            
            <div className="form-group" style={{ marginTop: 20 }}>
              <label>Другая сумма (₽)</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="input-field" min="100" />
            </div>

            <div className="form-group">
              <label>Ваш Email (для квитанции)</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="example@mail.ru" />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Пожертвовать {amount} ₽</button>
            {showSuccess && (
              <div className="alert-success" style={{ marginTop: 16 }}>
                Спасибо за вашу помощь! Квитанция и отчет отправлены на {email}.
              </div>
            )}
          </form>
        </div>

        {/* Материальная помощь (Связь со складом) */}
        <div className="help-card">
          <h3>📦 Материальная помощь</h3>
          <p style={{ color: '#64748b', marginBottom: 20 }}>Вы можете купить и привезти вещи, которые сейчас находятся в дефиците на нашем складе.</p>
          
          <div className="deficit-list">
            <h4 style={{ marginBottom: 12 }}>Текущие потребности (Интеграция со складом):</h4>
            {lowStock && lowStock.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {lowStock.map((item: any) => (
                  <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', marginBottom: 8, borderRadius: 8 }}>
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                    <span style={{ color: '#ef4444' }}>Осталось: {item.quantity} {item.unit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ padding: 20, background: '#f0fdf4', color: '#166534', borderRadius: 8 }}>
                На данный момент склад полностью укомплектован! Спасибо нашим спонсорам.
              </div>
            )}
          </div>

          <div style={{ marginTop: 24, padding: 16, background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
            <strong>Куда привозить:</strong> г. Москва, ул. Примерная, 10. Пн-Пт с 9:00 до 18:00.
          </div>
        </div>

      </div>
    </div>
  );
}
