
import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';
import { askGemini } from '../services/geminiService';

export const Assistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: '你好！我是你的手工皂製作助理。有任何關於配方、製作過程或問題排除的問題嗎？' }
  ]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askGemini(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: response || '我現在有點累，請稍後再試。' }]);
    setLoading(false);
  };

  return (
    <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-inner flex flex-col h-[500px]">
      <div className="p-4 bg-amber-50 rounded-t-2xl flex items-center gap-2 border-b border-amber-100">
        <Bot className="w-5 h-5 text-amber-600" />
        <span className="font-bold text-amber-900">AI 手作導師</span>
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-amber-600 text-white rounded-tr-none' 
                : 'bg-white text-stone-700 border border-stone-100 rounded-tl-none shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-stone-100 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="例如：橄欖油配方怎麼調？"
            className="flex-1 p-2 bg-stone-100 rounded-lg outline-none focus:ring-2 focus:ring-amber-300 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
