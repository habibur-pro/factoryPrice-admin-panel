import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import ChatInbox from "./ChatInbox";
import ChatConversation from "./ChatConversation";
import { useGetSessionsQuery } from "@/redux/api/chatSessionApi";
import { useReplayMutation } from "@/redux/api/chatApi";
import { IChatSession } from "@/types";

const ChatPanel = () => {
  const [replay, { isLoading: isSending }] = useReplayMutation();
  const { data: sessionRes } = useGetSessionsQuery("");
  const sessions: Array<IChatSession> = sessionRes?.data;

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const selectedSession = sessions?.find(
    (session) => session.id === selectedSessionId
  );
  const handleSendMessage = async (
    chatId: string,
    content: string,
    files?: File[],
    replyToId?: string
  ) => {
    console.log({ chatId, content, files, replyToId });
    const newReply = {
      content,
      files: files
        ? files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
            file: file, // store actual file too for uploading
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

    const formData = new FormData();

    formData.append("content", newReply.content);
    // if (newReply.replyTo) {
    //   formData.append("replyToId", newReply.replyTo.id);
    //   formData.append("replyToContent", newReply.replyTo.content);
    //   formData.append("replyToSender", newReply.replyTo.sender);
    // }

    if (newReply.files && newReply?.files?.length > 0) {
      newReply.files.forEach(({ file }) => {
        formData.append("attachments", file); // multiple files allowed
      });
    }
    const payload = { chatId, data: formData };

    try {
      await replay(payload).unwrap();
    } catch (error) {
      console.log(error);
    }
    // send to backend for
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
                  isSending={isSending}
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
