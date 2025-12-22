import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chat';
import { ChatMessage } from '../types';
import { Link } from 'react-router-dom';

export const Forum: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    if (user) {
      setMessages([]); 

      chatService.connect(user.username).then(() => {
        setIsConnected(true);
      });
      
      const unsubscribe = chatService.onMessage((msg) => {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) {
            return prev; // Ha már létezik, nem változtatunk
          }
          return [...prev, msg];
        });
      });

      return () => {
        unsubscribe(); 
        chatService.disconnect();
        setIsConnected(false);
      };
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    chatService.send(input.trim(), user);
    setInput('');
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Forum</h2>
            <p className="text-gray-600 mb-6">Join the conversation! You need to be logged in to chat with other customers.</p>
            <Link to="/login" className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition">
                Login to Chat
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold text-gray-800">Community Chat</h1>
                <p className="text-xs text-gray-500">Live discussion about products and orders</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isConnected ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                {isConnected ? 'Connected' : 'Connecting...'}
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.length === 0 && (
             <div className="text-center text-gray-400 mt-10">No messages yet. Say hello!</div>
          )}
          {messages.map((msg) => {
            const isMe = String(msg.userId) === String(user.id);
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  isMe ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}>
                  <div className={`text-xs mb-1 font-bold ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.username} <span className="font-normal opacity-75 ml-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={!isConnected}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!isConnected || !input.trim()}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
