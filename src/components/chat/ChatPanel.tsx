import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { mockChatUsers, ChatUser } from "./chatData";
import ChatInbox from "./ChatInbox";
import ChatConversation from "./ChatConversation";
import { useGetSessionsQuery } from "@/redux/api/chatSessionApi";
import LoadingSkeletion from "../LoadingSkeletion";
const sessions = [
  {
    _id: "6854d8bb9b91984e846061f1",
    socketId: "fdsfdsf",
    userId: "7FAEAB5B",
    user: {
      isEmailVerified: false,
      companyName: null,
      address: null,
      photo: null,
      _id: "68202829ea3d63746d5f4446",
      firstName: "Shofikul",
      lastName: "Islam",
      phoneNumber: "01974297726",
      email: "shofik@gmail.com",
      password: "$2b$12$OZDj.6TO/8/Q9bif6XJSleAkPPcX/elZPdoCPAm2GxtvZKpef/dN.",
      country: "Bangladesh",
      status: "active",
      role: "68202819ea3d63746d5f4442",
      id: "7FAEAB5B",
      createdAt: "2025-05-11T04:31:38.042Z",
      updatedAt: "2025-05-11T04:31:38.042Z",
      __v: 0,
    },
    productId: "B799253F",
    product: "68344153a16f090931669c13",
    lastMessage: "hi",
    lastMessageTime: "2025-06-20T03:42:51.479Z",
    unreadCount: 10,
    id: "A0DFC556",
    createdAt: "2025-06-20T03:42:51.479Z",
    updatedAt: "2025-06-20T03:42:51.479Z",
    __v: 0,
  },
];
const ChatPanel = () => {
  const [users, setUsers] = useState<ChatUser[]>(mockChatUsers);
  // const { data: sessionRes } = useGetSessionsQuery("");
  // const sessions = sessionRes?.data;
  console.log("sess", sessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const adminId = "B9E8D39D";
  const selectedSession = sessions.find(
    (user) => user.id === selectedSessionId
  );
  const handleSendMessage = (
    userId: string,
    content: string,
    files?: File[],
    replyToId?: string
  ) => {
    console.log({ userId });
    const newReply = {
      content,
      timestamp: "just now",
      receiver: userId,
      sender: adminId,
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

    console.log("replay", newReply);

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

  const handleSelectUser = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const handleCloseModal = () => {
    setSelectedSessionId(null);
  };

  return (
    <>
      {/* Only Inbox - full width */}
      <div className="h-full  bg-white rounded-lg  border">
        <ChatInbox
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          onSelectUser={handleSelectUser}
        />
      </div>

      {/* Fullscreen Modal for Conversation */}
      <Dialog open={!!selectedSessionId} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-full  lg:min-w-7xl h-[90vh] p-0">
          <DialogTitle className="sr-only">Chat Conversation</DialogTitle>
          <div className="h-full flex">
            <div className="w-80 flex-shrink-0 border-r">
              <ChatInbox
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelectUser={handleSelectUser}
              />
            </div>
            <div className="flex-1 min-w-0">
              {selectedSession && (
                <ChatConversation
                  selectedSessionId={selectedSessionId}
                  selectedSession={selectedSession}
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
