'use client';
import { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { useGetConversationByIdQuery } from '@/store/api/aiApi';
import { showToast } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  conversationId?: string;
  onConversationCreated?: (id: string) => void;
}

export default function ChatWindow({ conversationId, onConversationCreated }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch full conversation history if loading an existing chat session
  const { data: historyData, isLoading: isHistoryLoading } = useGetConversationByIdQuery(
    conversationId!,
    { skip: !conversationId }
  );

  // Sync historical messages when the selected conversation shifts
  useEffect(() => {
    if (historyData?.conversation) {
      setMessages(historyData.conversation.messages);
      setSuggestions([]);
    } else if (!conversationId) {
      setMessages([]);
      setSuggestions([]);
    }
  }, [historyData, conversationId]);

  // Keep window scrolled to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim() || streaming) return;

    const userMessage: Message = { role: 'user', content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setStreaming(true);
    setSuggestions([]);

    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: messageContent }),
        credentials: 'include', // CRITICAL: Includes JWT auth cookies
      });

      if (!res.ok) {
        throw new Error('Server returned error status');
      }

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.chunk || data.content) {
                const textChunk = data.chunk || data.content;
                setMessages((prev) =>
                  prev.map((msg, idx) =>
                    idx === prev.length - 1 && msg.role === 'assistant'
                      ? { ...msg, content: msg.content + textChunk }
                      : msg
                  )
                );
              }
              
              if (data.suggestions) {
                setSuggestions(data.suggestions);
              }
              
              if (data.conversationId && onConversationCreated && !conversationId) {
                onConversationCreated(data.conversationId);
              }

              if (data.error) {
                setMessages((prev) =>
                  prev.map((msg, idx) =>
                    idx === prev.length - 1 && msg.role === 'assistant'
                      ? { ...msg, content: data.error }
                      : msg
                  )
                );
                setStreaming(false);
              }

              if (data.done) {
                setStreaming(false);
              }
            } catch { /* skip parser errors */ }
          }
        }
      }
      setStreaming(false);
    } catch {
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 && msg.role === 'assistant'
            ? { ...msg, content: 'Sorry, I encountered an issue generating a response. Please check your connection and try again.' }
            : msg
        )
      );
      setStreaming(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  if (conversationId && isHistoryLoading) {
    return (
      <div className="flex h-full flex-col justify-center items-center p-8 space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-gray-500">Loading conversation history...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50/50">
      {/* Messages area */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-display">Chat with ServiceHive AI</h3>
            <p className="text-sm text-gray-500">
              I can help you search local services, check your reservations, recommend providers, or navigate pages. Ask me anything!
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex gap-3 max-w-[80%] items-start">
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 21l8.904-4.474L19 21l3-10-10 3z" />
                  </svg>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-white font-medium rounded-tr-none'
                    : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                }`}
              >
                {msg.content}
                {msg.role === 'assistant' && streaming && i === messages.length - 1 && !msg.content && (
                  <span className="flex gap-1 items-center py-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                  </span>
                )}
                {msg.role === 'assistant' && streaming && i === messages.length - 1 && msg.content && (
                  <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Follow-Ups */}
      {suggestions.length > 0 && !streaming && (
        <div className="px-6 py-2 bg-gray-50/50 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s)}
              className="rounded-full border border-primary/10 bg-primary/5 hover:bg-primary/10 px-4 py-1.5 text-xs text-primary font-medium transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input panel */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Search providers or ask 'what are my bookings?'..."
            disabled={streaming}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || streaming}
            className="h-11 px-6"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
