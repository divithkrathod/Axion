import React, { useEffect, useState } from 'react';
import { useAuthStore, useUIStore } from '../store';
import { authService } from '../services/api';
import socketService from '../services/socket';
import Sidebar from '../components/Sidebar';
import VideoSection from '../components/VideoSection';
import ChatSection from '../components/ChatSection';

function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen } = useUIStore();
  const [activeTab, setActiveTab] = useState('calls');

  useEffect(() => {
    if (user) {
      socketService.connect(user._id);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg border-b border-slate-700">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {activeTab === 'calls' && '📞 Video Calls'}
              {activeTab === 'messages' && '💬 Messages'}
              {activeTab === 'contacts' && '👥 Contacts'}
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg glow-effect"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'calls' && <VideoSection />}
          {activeTab === 'messages' && <ChatSection />}
          {activeTab === 'contacts' && <div className="p-6"><p className="text-slate-400">Contacts section</p></div>}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
