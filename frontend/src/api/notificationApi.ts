import api from './axiosClient';

export const notificationApi = {
  sendEmail: (data: { to: string, subject: string, text: string }) => api.post('/notifications/email', data),
};
