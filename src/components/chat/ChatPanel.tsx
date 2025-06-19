import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { mockChatUsers, ChatUser } from "./chatData";
import ChatInbox from "./ChatInbox";
import ChatConversation from "./ChatConversation";

const ChatPanel = () => {
  const [users, setUsers] = useState<ChatUser[]>(mockChatUsers);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const selectedUser = users.find((user) => user.id === selectedUserId);

  const handleSendMessage = (
    userId: string,
    content: string,
    files?: File[],
    replyToId?: string
  ) => {
    const newReply = {
      content,
      timestamp: "just now",
      sender: "admin" as const,
      files: files
        ? files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
          }))
        : undefined,
      replyTo: replyToId
        ? {
            id: replyToId,
            content:
              content.substring(0, 50) + (content.length > 50 ? "..." : ""),
            sender: "customer",
          }
        : undefined,
    };

    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          const updatedMessages = user.messages.map((message) => ({
            ...message,
            replies: [...(message.replies || []), newReply],
          }));

          return {
            ...user,
            messages: updatedMessages,
            lastMessage: content,
            lastMessageTime: "just now",
          };
        }
        return user;
      })
    );
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
  };

  return (
    <>
      {/* Only Inbox - full width */}
      <div className="h-full  bg-white rounded-lg  border">
        <ChatInbox
          users={users}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
        />
      </div>

      {/* Fullscreen Modal for Conversation */}
      <Dialog open={!!selectedUserId} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-full  lg:min-w-7xl h-[90vh] p-0">
          <DialogTitle className="sr-only">Chat Conversation</DialogTitle>
          <div className="h-full flex">
            <div className="w-80 flex-shrink-0 border-r">
              <ChatInbox
                users={users}
                selectedUserId={selectedUserId}
                onSelectUser={handleSelectUser}
              />
            </div>
            <div className="flex-1 min-w-0">
              {selectedUser && (
                <ChatConversation
                  user={selectedUser}
                  onSendMessage={handleSendMessage}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ChatPanel;
