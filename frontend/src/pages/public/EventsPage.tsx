import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../../api/staffApi';

export default function EventsPage() {
  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: () => staffApi.getEvents().then(r => r.data),
  });

  const [registeringEventId, setRegisteringEventId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleDownloadPdf = async () => {
    try {
      const response = await staffApi.downloadEventsPdf();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'events_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Ошибка при скачивании PDF');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEventId) return;
    try {
      await staffApi.registerForEvent(registeringEventId, { name, email });
      alert('Вы успешно записаны как волонтер!');
      setRegisteringEventId(null);
      setName('');
      setEmail('');
      refetch();
    } catch (e) {
      alert('Ошибка при записи на мероприятие');
    }
  };

  return (
    <div className="public-container" style={{ padding: '40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="section-title" style={{ margin: 0 }}>События и Мероприятия</h1>
        <button className="btn-secondary" onClick={handleDownloadPdf}>📄 Скачать PDF отчет</button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', color: '#64748b' }}>Загрузка мероприятий...</div>
      ) : (
        <div className="events-grid" style={{ display: 'grid', gap: 24 }}>
          {events?.map(ev => (
            <div key={ev.id} style={{ display: 'flex', padding: 24, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-active" style={{ marginBottom: 8, display: 'inline-block' }}>{ev.type}</span>
                <h3 style={{ fontSize: 20, margin: '0 0 8px 0' }}>{ev.title}</h3>
                <p style={{ color: '#64748b', margin: 0 }}>📅 {ev.eventDate}</p>
              </div>
              <div>
                {ev.openForVolunteers ? (
                  registeringEventId === ev.id ? (
                    <form onSubmit={handleRegister} style={{ display: 'flex', gap: 8 }}>
                      <input type="text" placeholder="Имя" required value={name} onChange={e => setName(e.target.value)} className="input-field" style={{ padding: '6px 12px' }} />
                      <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field" style={{ padding: '6px 12px' }} />
                      <button type="submit" className="btn-primary" style={{ padding: '6px 12px' }}>Отправить</button>
                      <button type="button" onClick={() => setRegisteringEventId(null)} className="btn-secondary" style={{ padding: '6px 12px' }}>Отмена</button>
                    </form>
                  ) : (
                    <button className="btn-primary" onClick={() => setRegisteringEventId(ev.id)}>Записаться волонтером</button>
                  )
                ) : (
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>Набор закрыт</span>
                )}
              </div>
            </div>
          ))}
          {(!events || events.length === 0) && (
            <div style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Мероприятий пока нет.</div>
          )}
        </div>
      )}
    </div>
  );
}
