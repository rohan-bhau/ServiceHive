'use client';
import { useGetConversationsQuery } from '@/store/api/aiApi';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

interface ConversationSidebarProps {
  currentId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export default function ConversationSidebar({ currentId, onSelect, onNew }: ConversationSidebarProps) {
  const { data: conversations, isLoading } = useGetConversationsQuery(undefined);

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="p-4">
        <Button onClick={onNew} size="sm" className="w-full">
          + New Conversation
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {isLoading && (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} height="48px" />)}
          </div>
        )}
        {conversations?.map((conv: any) => (
          <button
            key={conv._id}
            onClick={() => onSelect(conv._id)}
            className={cn(
              'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
              currentId === conv._id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-700 hover:bg-gray-100',
            )}
          >
            <span className="line-clamp-1">{conv.title}</span>
            <span className="text-xs text-gray-400">{new Date(conv.updatedAt).toLocaleDateString()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
