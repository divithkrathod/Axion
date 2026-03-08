import React from 'react';
import { useAuthStore, useUserStore, useUIStore } from '../store';
import { FiMenu, FiHome, FiMessageSquare, FiUsers, FiSettings } from 'react-icons/fi';

function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuthStore();
  const { setIsSidebarOpen } = useUIStore();

  const tabs = [
    { id: 'calls', label: 'Calls', icon: '📞' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'contacts', label: 'Contacts', icon: '👥' },
  ];

  return (
    <aside className="w-64 bg-slate-800 shadow-lg border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-100">{user?.fullName}</p>
            <p className="text-sm text-slate-400">@{user?.username}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg glow-effect'
                : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-slate-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors">
          <span className="text-xl">⚙️</span>
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
