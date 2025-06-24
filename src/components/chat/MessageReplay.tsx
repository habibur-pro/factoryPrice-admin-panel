import React from "react";
import { Button } from "@/components/ui/button";
import { X, Reply } from "lucide-react";

interface MessageReplyProps {
  replyingTo: {
    id: string;
    content: string;
    sender: string;
  } | null;
  onClearReply: () => void;
}

const MessageReply = ({ replyingTo, onClearReply }: MessageReplyProps) => {
  if (!replyingTo) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3 rounded">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Reply className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-700">
              Replying to {replyingTo.sender}
            </p>
            <p className="text-sm text-blue-800 truncate">
              {replyingTo.content}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearReply}
          className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
export default MessageReply;
