import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, X, ExternalLink, LoaderCircle } from "lucide-react";
import ChatImage from "./ChatImage";
import ChatFileComponent from "./ChatFile";
import MessageReply from "./MessageReplay";
import Image from "next/image";
import { useGetChatQuery } from "@/redux/api/chatApi";
import { IChat, IChatSession } from "@/types";
import { getSmartTimeAgo } from "@/utils/getSmartTimeAgo";
import Link from "next/link";

interface ChatConversationProps {
  selectedSession: IChatSession;
  isSending: boolean;
  onSendMessage: (
    userId: string,
    content: string,
    files?: File[],
    replyToId?: string
  ) => void;
}

const ChatConversation = ({
  selectedSession,
  isSending,

  onSendMessage,
}: ChatConversationProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    content: string;
    sender: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: chatRes } = useGetChatQuery(selectedSession?.id, {
    skip: !selectedSession.id,
    pollingInterval: 3000,
  });
  const chats: Array<IChat> = chatRes?.data;
  console.log("chat from admin panel", chats);
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [chats]);
  const handleSend = () => {
    if (newMessage.trim() || attachedFiles.length > 0) {
      const lastChat = chats[chats.length - 1];
      onSendMessage(lastChat.id, newMessage, attachedFiles, replyingTo?.id);
      setNewMessage("");
      setAttachedFiles([]);
      setReplyingTo(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isImageFile = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(filename);
  };

  const renderFileAttachment = (file: {
    filename: string;
    extension: string;
    size: number;
    url: string;
  }) => {
    if (isImageFile(file.filename)) {
      return (
        <ChatImage
          src={file.url}
          alt={file.filename}
          fileName={file.filename}
          className="mt-2"
        />
      );
    } else {
      return <ChatFileComponent key={file.url} file={file} className="mt-2" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
        <div className="relative">
          <Avatar className="h-10 w-10">
            {/* <AvatarImage
              src={selectedSession.user.photo}
              alt={selectedSession.user.firstName}
            /> */}
            <AvatarFallback className="uppercase">
              {selectedSession.senderName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {/* {selectedSession.id && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )} */}
        </div>
        <div>
          <h3 className="font-medium">{selectedSession.senderName}</h3>
          {/* <p className="text-sm text-gray-500">
            {selectedSession.id ? "Online" : "Offline"}
          </p> */}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4  max-h-[60vh]">
        <div className="space-y-4  ">
          {chats?.length > 0 &&
            chats.map((message) => (
              <div key={message.id} className="space-y-3">
                {/* Product preview if exists */}
                {message.product && (
                  <div className="bg-gray-50 rounded-lg p-3 border max-w-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🛒</span>
                      <span className="font-medium text-sm">
                        Product Inquiry
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Image
                        src={message.product.image}
                        alt={message.product.productName}
                        width={100}
                        height={100}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {message.product.productName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          SKU: {message.product.sku}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="mt-1 h-6 text-xs"
                        >
                          <Link
                            href={`/products/${message?.product?.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-2 w-2 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer message */}
                {/* show content  */}
                {message?.content && (
                  <div className="flex gap-3 group">
                    <Avatar className="h-8 w-8">
                      {/* <AvatarImage
                        src={selectedSession.user.photo}
                        alt={selectedSession.user.firstName}
                      /> */}
                      <AvatarFallback className="uppercase">
                        {selectedSession.senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-md relative">
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {getSmartTimeAgo(message.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
                {/* show file  */}
                {message?.files && (
                  <div className="flex gap-3 group">
                    <Avatar className="h-8 w-8">
                          {/* <AvatarImage
                            src={selectedSession.user.photo}
                            alt={selectedSession.user.firstName}
                          /> */}
                      <AvatarFallback className="uppercase">
                        {selectedSession.senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-md relative">
                        {message.files && message.files.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.files.map((file) =>
                              renderFileAttachment(file)
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {getSmartTimeAgo(message.createdAt)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {message.replies &&
                  message.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`flex gap-3 group ${
                        // reply.sender. === "admin" ? "justify-end" : ""
                        "justify-end"
                      }`}
                    >
                      <div className="flex-1 max-w-md">
                        <div
                          className="rounded-lg p-3 relative bg-blue-500 text-white ml-auto "
                          // className={`rounded-lg p-3 relative ${
                          //   reply.sender === "admin"
                          //     ? "bg-blue-500 text-white ml-auto"
                          //     : "bg-gray-100"
                          // }`}
                        >
                          <p className="text-sm">{reply.content}</p>
                          {reply.files && reply.files?.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {reply.files.map((file) =>
                                renderFileAttachment(file)
                              )}
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-xs text-gray-500 mt-1 block  text-right`}
                          // className={`text-xs text-gray-500 mt-1 block ${
                          //   reply.sender === "admin" ? "text-right" : ""
                          // }`}
                        ></span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 border-t bg-gray-50">
        <MessageReply
          replyingTo={replyingTo}
          onClearReply={() => setReplyingTo(null)}
        />

        {attachedFiles.length > 0 && (
          <div className="mb-3 space-y-2">
            {attachedFiles.map((file, index) => (
              <div
                key={`${file.name}_${index}`}
                className="flex items-center justify-between bg-white p-2 rounded border"
              >
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
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
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={
                isSending || (!newMessage.trim() && attachedFiles.length === 0)
              }
            >
              {isSending ? (
                <LoaderCircle className="animate-spin h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
          className="hidden"
        />
      </div>
    </div>
  );
};
export default ChatConversation;
