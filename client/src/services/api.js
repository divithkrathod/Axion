import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: async (username, email, password, fullName) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      fullName,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  validateToken: async () => {
    const response = await api.get('/auth/validate');
    return response.data;
  },
};

// User Service
export const userService = {
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  searchUsers: async (query, limit = 20) => {
    const response = await api.get('/users/search', {
      params: { query, limit },
    });
    return response.data;
  },

  getOnlineUsers: async () => {
    const response = await api.get('/users/online');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/users/settings', settings);
    return response.data;
  },
};

// Call Service
export const callService = {
  initiateCall: async (recipientId, callType = 'video') => {
    const response = await api.post('/calls/initiate', {
      recipientId,
      callType,
    });
    return response.data;
  },

  endCall: async (callId) => {
    const response = await api.put(`/calls/${callId}/end`);
    return response.data;
  },

  getCallDetails: async (callId) => {
    const response = await api.get(`/calls/${callId}`);
    return response.data;
  },

  getCallHistory: async (limit = 50, skip = 0) => {
    const response = await api.get('/calls', {
      params: { limit, skip },
    });
    return response.data;
  },

  updateCallStatus: async (callId, status) => {
    const response = await api.put(`/calls/${callId}/status`, {
      status,
      startTime: new Date(),
    });
    return response.data;
  },
};

// Message Service
export const messageService = {
  sendMessage: async (recipientId, content, messageType = 'text', fileData = null) => {
    const response = await api.post('/messages/send', {
      recipientId,
      content,
      messageType,
      fileData,
    });
    return response.data;
  },

  getMessages: async (recipientId, limit = 50, skip = 0) => {
    const response = await api.get('/messages', {
      params: { recipientId, limit, skip },
    });
    return response.data;
  },

  markAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },

  getConversations: async (limit = 20) => {
    const response = await api.get('/messages/conversations', {
      params: { limit },
    });
    return response.data;
  },
};

export default api;
