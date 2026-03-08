import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore, useMessageStore } from '../store';
import { messageService } from '../services/api';
import socketService from '../services/socket';

function ChatSection() {
  const { user } = useAuthStore();
  const { messages, selectedConversation, setMessages, setSelectedConversation } = useMessageStore();
  const [conversations, setConversations] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    setupSocketListeners();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await messageService.getConversations();
      setConversations(response.conversations || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setIsLoading(false);
    }
  };

  const fetchMessages = async (recipientId) => {
    try {
      const response = await messageService.getMessages(recipientId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const setupSocketListeners = () => {
    socketService.on('message:receive', (data) => {
      setMessages(prev => [...prev, {
        _id: data.messageId,
        senderId: data.senderId,
        content: data.content,
        createdAt: data.timestamp,
      }]);
    });

    socketService.on('typing:indicator', (data) => {
      console.log(`${data.senderName} is typing...`);
    });
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation._id);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim() || !selectedConversation) return;

    try {
      await messageService.sendMessage(selectedConversation._id, messageText);
      socketService.emit('message:send', {
        senderId: user._id,
        recipientId: selectedConversation._id,
        content: messageText,
        roomId: 'default',
      });
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-slate-900">
      {/* Conversations List */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto">
        <div className="p-4">
          <h3 className="font-semibold text-slate-100 mb-4">💬 Conversations</h3>
          <div className="space-y-2">
            {conversations.map(conv => (
              <button
                key={conv._id}
                onClick={() => selectConversation(conv.user)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedConversation?._id === conv._id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <p className="font-medium">{conv.user.fullName}</p>
                <p className="text-sm text-slate-400 truncate">
                  {conv.lastMessage.content.substring(0, 30)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-700 p-4">
              <p className="font-semibold text-slate-100">{selectedConversation.fullName}</p>
              <p className="text-sm text-slate-400">@{selectedConversation.username}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-900">
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className={`mb-4 flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === user._id
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                        : 'bg-slate-800 border border-slate-700 text-slate-100'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="bg-slate-800 border-t border-slate-700 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-semibold shadow-lg glow-effect"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSection;
