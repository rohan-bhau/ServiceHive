'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ChatWindow from './ChatWindow';
import { useAuth } from '@/lib/auth';
import { useGetConversationsQuery } from '@/store/api/aiApi';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'history'>('chat');
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const { isAuthenticated } = useAuth();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Fetch histories only if authenticated
  const { data: conversationsData, isLoading: isHistoryLoading, refetch } = useGetConversationsQuery(
    undefined,
    { skip: !isAuthenticated || !isOpen }
  );

  const conversations = conversationsData?.conversations || [];

  // Refetch history when widget opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refetch();
    }
  }, [isOpen, isAuthenticated, refetch]);

  // Close popup if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
    setActiveView('chat');
  };

  const handleStartNewChat = () => {
    setActiveConversationId(undefined);
    setActiveView('chat');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={widgetRef}>
      {/* Slide-up Chat Panel Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="mb-4 h-[560px] w-[380px] sm:w-[420px] rounded-2xl bg-white border border-gray-100 shadow-2xl overflow-hidden flex flex-col origin-bottom-right"
          >
            {/* Widget header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center shadow-md">
              <div>
                <h3 className="font-bold text-base font-display">ServiceHive Assistant</h3>
                <p className="text-xs text-white/80">Ready to help you 24/7</p>
              </div>

              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <button
                    onClick={() => setActiveView((prev) => (prev === 'chat' ? 'history' : 'chat'))}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
                    title={activeView === 'chat' ? 'Show History' : 'Back to Chat'}
                  >
                    {activeView === 'chat' ? (
                      <span className="flex items-center gap-1 text-xs font-semibold">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        History
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Chat
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Widget body */}
            <div className="flex-1 overflow-hidden">
              {activeView === 'history' ? (
                /* Past Conversations selection List */
                <div className="h-full overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Past Chats</h4>
                    <button
                      onClick={handleStartNewChat}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      + Start New
                    </button>
                  </div>
                  {isHistoryLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => <Skeleton key={i} height="52px" className="rounded-xl" />)}
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">
                      No conversations found. Start chatting to save histories!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conversations.map((conv: any) => (
                        <button
                          key={conv._id}
                          onClick={() => handleConversationSelect(conv._id)}
                          className="w-full text-left rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:border-primary/20 transition-all flex justify-between items-center group"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-primary transition-colors">
                              {conv.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(conv.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-gray-300 group-hover:text-primary transition-colors pr-1">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Chat Window workspace */
                <ChatWindow
                  conversationId={activeConversationId}
                  onConversationCreated={(id) => {
                    setActiveConversationId(id);
                    if (isAuthenticated) {
                      refetch();
                    }
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-gray-800 text-white' : 'bg-primary text-white hover:bg-primary/95'
        }`}
        title={isOpen ? 'Close Chat' : 'Ask AI Assistant'}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
