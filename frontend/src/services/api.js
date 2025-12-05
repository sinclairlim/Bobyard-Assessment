import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const commentAPI = {
  getAllComments: () => api.get('/comments/'),

  getComment: (id) => api.get(`/comments/${id}/`),

  createComment: (text) => api.post('/comments/', { text }),

  updateComment: (id, text) => api.patch(`/comments/${id}/`, { text }),

  deleteComment: (id) => api.delete(`/comments/${id}/`),
};

export default api;
