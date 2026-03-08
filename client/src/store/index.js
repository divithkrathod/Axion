import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),

  login: (user, token) => set({
    user,
    token,
    isAuthenticated: true,
  }),

  logout: () => set({
    user: null,
    token: null,
    isAuthenticated: false,
  }),
}));

export const useCallStore = create((set) => ({
  currentCall: null,
  callHistory: [],
  isCallActive: false,
  callDuration: 0,

  setCurrentCall: (call) => set({ currentCall: call }),
  setCallHistory: (history) => set({ callHistory: history }),
  setIsCallActive: (isActive) => set({ isCallActive: isActive }),
  setCallDuration: (duration) => set({ callDuration: duration }),

  addToHistory: (call) => set((state) => ({
    callHistory: [call, ...state.callHistory],
  })),
}));

export const useMessageStore = create((set) => ({
  messages: [],
  conversations: [],
  selectedConversation: null,

  setMessages: (messages) => set({ messages }),
  setConversations: (conversations) => set({ conversations }),
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),

  clearMessages: () => set({ messages: [] }),
}));

export const useUserStore = create((set) => ({
  onlineUsers: [],
  users: [],
  selectedUser: null,

  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  updateUserStatus: (userId, status) => set((state) => ({
    onlineUsers: state.onlineUsers.map(u => 
      u._id === userId ? { ...u, status } : u
    ),
  })),
}));

export const useMediaStore = create((set) => ({
  localStream: null,
  remoteStream: null,
  isAudioEnabled: true,
  isVideoEnabled: true,
  isScreenSharing: false,

  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setIsAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  setIsVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),
  setIsScreenSharing: (sharing) => set({ isScreenSharing: sharing }),
}));

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  activeTab: 'calls',
  showNotification: false,
  notification: null,

  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowNotification: (show) => set({ showNotification: show }),
  setNotification: (notification) => set({ notification }),

  showToast: (message, type = 'info') => set({
    showNotification: true,
    notification: { message, type },
  }),
}));
