import React, { useState, useRef, useEffect } from 'react';
import { Disease } from '../types';
import { Send, Bot, User, MessageSquare } from 'lucide-react';

interface AIConsultChatProps {
  disease?: Disease;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIConsultChat: React.FC<AIConsultChatProps> = ({ disease }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: disease
        ? `Hello! I am your AI Medical Assistant. I see you're reviewing **${disease.name}**. Feel free to ask me anything about how this disease works, how to take its medications, side effects, or dietary precautions!`
        : `Hello! I am your AI Medical Assistant. Ask me any question regarding symptoms, diseases, dosage directions, or medication precautions.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = disease
    ? [
        `What is the best time of day to take ${disease.medications[0]?.name || 'the medicine'}?`,
        `Can I exercise while recovering from ${disease.name}?`,
        `What foods should I strictly avoid with this condition?`,
        `When should I call my doctor if symptoms don't improve?`
      ]
    : [
        'How does acid reflux differ from a heart attack?',
        'Can I take Ibuprofen on an empty stomach?',
        'What are the first warning signs of diabetes?',
        'What helps stop a migraine fast at home?'
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/medical-consult-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          diseaseContext: disease ? { name: disease.name, medications: disease.medications.map(m => m.name) } : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.reply || 'Please follow up with your doctor for comprehensive in-person medical care.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Regarding "${query}": Generally, always follow the dosage prescribed on your medicine label, take oral medicines with a full glass of water, and avoid taking NSAIDs or steroids on an empty stomach. If you develop chest pain, shortness of breath, or sudden high fever, seek emergency medical care immediately.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-consult-chat-block" className="bg-[#E0E5EC] rounded-3xl p-6 sm:p-7 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 space-y-4 flex flex-col h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60 flex items-center justify-center text-blue-600">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Dr. AI Clinical Medical Assistant</h3>
            <p className="text-[11px] text-slate-500 font-medium">Powered by Gemini AI • Context-Aware Medical Q&A</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DEF7EC] text-emerald-800 shadow-[inset_1px_1px_2px_#b8cfc3,inset_-1px_-1px_2px_#ffffff] border border-emerald-300">
          Online
        </span>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-shrink-0">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#b8b9be,-1px_-1px_3px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/60 text-xs text-slate-700 font-medium whitespace-nowrap transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 p-3 bg-[#E0E5EC] rounded-2xl shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border border-white/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-[#E0E5EC] shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] border border-white/50 flex items-center justify-center flex-shrink-0 text-blue-600 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] rounded-br-none font-medium'
                  : 'bg-[#E0E5EC] text-slate-800 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60 rounded-bl-none font-medium'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className={`block text-[10px] mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
            <Bot className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Consulting clinical literature...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2.5 pt-1 flex-shrink-0"
      >
        <input
          id="input-chat-query"
          type="text"
          placeholder="Ask a question regarding medications, timing, or side effects..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl transition cursor-pointer shadow-[0_4px_12px_rgba(37,99,235,0.35)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
