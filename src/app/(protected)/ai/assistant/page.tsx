'use client';
import { useState } from 'react';
import ConversationSidebar from '@/components/ai/ConversationSidebar';
import ChatWindow from '@/components/ai/ChatWindow';
import { aiApi } from '@/store/api/aiApi';
import { useDispatch } from 'react-redux';

export default function AIAssistantPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleNewConversation = () => {
    setSelectedConversationId(undefined);
  };

  const handleConversationCreated = (id: string) => {
    setSelectedConversationId(id);
    // Force invalidating RTK query cache so the sidebar updates its lists
    dispatch(aiApi.util.invalidateTags(['Conversations']));
  };

  return (
    <main className="flex h-[calc(100vh-4.1rem)] border-t border-gray-100 overflow-hidden">
      {/* Sidebar: persistent chat links */}
      <div className="hidden md:block w-72 flex-shrink-0">
        <ConversationSidebar
          currentId={selectedConversationId}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
        />
      </div>

      {/* Main chat interface panel */}
      <div className="flex-1 h-full">
        <ChatWindow
          conversationId={selectedConversationId}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </main>
  );
}
