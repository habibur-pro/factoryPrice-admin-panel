import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  ExternalLink,
  Send,
  Paperclip,
  X,
  Fullscreen,
} from "lucide-react";
import { ChatMessageData } from "./chatData";

interface ChatMessageProps {
  message: ChatMessageData;
  onReply: (messageId: string, replyText: string, files?: File[]) => void;
  onFullscreen: () => void;
}

const ChatMessage = ({ message, onReply, onFullscreen }: ChatMessageProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReply = () => {
    if (replyText.trim() || attachedFiles.length > 0) {
      onReply(message.id, replyText, attachedFiles);
      setReplyText("");
      setAttachedFiles([]);
      setIsReplying(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMarkAsRead = () => {
    console.log("Marking message as read:", message.id);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{message.customerName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{message.timestamp}</span>
              <Badge
                variant={
                  message.status === "unread" ? "destructive" : "secondary"
                }
              >
                {message.status}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onFullscreen}>
            <Fullscreen className="h-4 w-4" />
          </Button>
        </div>

        {message.product && (
          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🛒</span>
                <span className="font-semibold">Product Preview</span>
              </div>
              <div className="flex gap-3">
                <img
                  src={message.product.image}
                  alt={message.product.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{message.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    SKU: {message.product.sku}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={message.product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Product
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              {message.product.description && (
                <p className="text-xs text-muted-foreground mt-2">
                  {message.product.description}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="bg-white border rounded-lg p-3 mb-3">
          <h4 className="font-medium mb-2">Customer Message:</h4>
          <p className="text-gray-700">{message.content}</p>
          {message.files && message.files.length > 0 && (
            <div className="mt-3 space-y-2">
              <h5 className="text-sm font-medium">Attachments:</h5>
              {message.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm bg-gray-100 p-2 rounded"
                >
                  <Paperclip className="h-3 w-3" />
                  <span>{file.name}</span>
                  <span className="text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {message.replies && message.replies.length > 0 && (
          <div className="space-y-2 mb-3">
            {message.replies.map((reply, index) => (
              <div
                key={index}
                className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-800">Admin</span>
                    <span className="text-xs text-blue-600">
                      {reply.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-blue-900">{reply.content}</p>
                {reply.files && reply.files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {reply.files.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className="flex items-center gap-2 text-xs bg-blue-100 p-1 rounded"
                      >
                        <Paperclip className="h-2 w-2" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isReplying && (
          <div className="mb-3 space-y-2">
            <Textarea
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[80px]"
            />

            {attachedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Attached Files:</div>
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-3 w-3" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleReply}
                disabled={!replyText.trim() && attachedFiles.length === 0}
              >
                <Send className="h-3 w-3 mr-1" />
                Send Reply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-3 w-3 mr-1" />
                Attach
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>
          <Button size="sm" variant="outline" onClick={handleMarkAsRead}>
            Mark as Read
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default ChatMessage;
