'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function AIAssistantPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setMessage('');
    setSending(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you with ServiceHive today?' }]);
      setSending(false);
    }, 1000);
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">AI Assistant</h1>
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-sm">
        {messages.length === 0 && (
          <p className="text-center text-gray-500">Ask me anything about ServiceHive!</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {sending && <div className="text-gray-500">Typing...</div>}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={handleSend} disabled={!message.trim() || sending}>Send</Button>
      </div>
    </main>
  );
}
