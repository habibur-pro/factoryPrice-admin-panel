import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, X, ExternalLink, Reply } from "lucide-react";
import { ChatUser, ChatFile } from "./chatData";
import ChatImage from "./ChatImage";
import ChatFileComponent from "./ChatFile";
import MessageReply from "./MessageReplay";
import Image from "next/image";
// import { useGetChatQuery } from "@/redux/api/chatApi";
import { IChatSession } from "@/types";
const chats = [
  {
    _id: "6854e74bb28c023e15292685",
    sessionId: "A0DFC556",
    senderId: "7FAEAB5B",
    sender: "68202829ea3d63746d5f4446",
    receiverId: "B9E8D39D",
    receiver: "6854208248cb62e350d11faf",
    content: "Hello World!",
    files: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlndpwDalSNF8TzBG6T7kGv73l0IOReNJpKw&s",
    ],
    replyTo: null,
    replies: [
      {
        _id: "685556d8613d31b9746148a8",
        sessionId: "A0DFC556",
        senderId: "7FAEAB5B",
        sender: {
          isEmailVerified: false,
          companyName: null,
          address: null,
          _id: "68202829ea3d63746d5f4446",
          firstName: "Shofikul",
          lastName: "Islam",
          phoneNumber: "01974297726",
          email: "shofik@gmail.com",
          password:
            "$2b$12$OZDj.6TO/8/Q9bif6XJSleAkPPcX/elZPdoCPAm2GxtvZKpef/dN.",
          country: "Bangladesh",
          status: "active",
          role: "68202819ea3d63746d5f4442",
          id: "7FAEAB5B",
          createdAt: "2025-05-11T04:31:38.042Z",
          updatedAt: "2025-05-11T04:31:38.042Z",
          __v: 0,
          photo:
            "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg",
        },
        receiverId: "B9E8D39D",
        receiver: "6854208248cb62e350d11faf",
        content: "Hello replay",
        files: [],
        replyTo: "6854e74bb28c023e15292685",
        product: null,
        id: "F3C1F210",
        createdAt: "2025-06-20T12:40:56.863Z",
        updatedAt: "2025-06-20T12:40:56.863Z",
        __v: 0,
      },
    ],
    product: {
      productId: "88D6DA3E",
      productName: "Men's Cotton T-Shirt",
      image:
        "https://res.cloudinary.com/dbqoevq35/image/upload/v1748510459/uploads/dcob5sjqgewkerghisay.jpg",
      slug: "men's-cotton-t-shirt",
      sku: "T-58",
    },
    id: "9A111E9B",
    createdAt: "2025-06-20T04:44:59.685Z",
    updatedAt: "2025-06-20T04:44:59.685Z",
    __v: 0,
  },
];
interface ChatConversationProps {
  selectedSessionId: string;
  selectedSession: IChatSession;
  user: ChatUser;
  onSendMessage: (
    userId: string,
    content: string,
    files?: File[],
    replyToId?: string
  ) => void;
}

const ChatConversation = ({
  user,
  selectedSessionId,
  selectedSession,
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
  // const { data: chatRes } = useGetChatQuery(selectedSessionId);
  // const chats = chatRes?.data;
  console.log("chats", chats);
  const handleSend = () => {
    if (newMessage.trim() || attachedFiles.length > 0) {
      onSendMessage(user.id, newMessage, attachedFiles, replyingTo?.id);
      setNewMessage("");
      setAttachedFiles([]);
      setReplyingTo(null);
    }

    // Ensure scroll to bottom after new message renders
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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

  const handleReply = (messageId: string, content: string, sender: string) => {
    setReplyingTo({ id: messageId, content, sender });
  };

  const renderFileAttachment = (file: ChatFile, index: number) => {
    if (isImageFile(file.name)) {
      return (
        <ChatImage
          key={index}
          src={file.url || ""}
          alt={file.name}
          fileName={file.name}
          className="mt-2"
        />
      );
    } else {
      return <ChatFileComponent key={index} file={file} className="mt-2" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={selectedSession.user.photo}
              alt={selectedSession.user.firstName}
            />
            <AvatarFallback>
              {selectedSession.user.firstName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {selectedSession.id && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div>
          <h3 className="font-medium">{selectedSession.user.firstName}</h3>
          <p className="text-sm text-gray-500">
            {selectedSession.id ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4  max-h-[60vh]">
        <div className="space-y-4  ">
          {chats.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* Product preview if exists */}
              {message.product && (
                <div className="bg-gray-50 rounded-lg p-3 border max-w-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🛒</span>
                    <span className="font-medium text-sm">Product Inquiry</span>
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
                        <a href={``} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-2 w-2 mr-1" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer message */}
              <div className="flex gap-3 group">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={selectedSession.user.photo}
                    alt={selectedSession.user.firstName}
                  />
                  <AvatarFallback>
                    {selectedSession.user.firstName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-md relative">
                    {/* {message.replyTo && (
                      <div className="bg-gray-200 p-2 rounded mb-2 text-xs">
                        <p className="text-gray-600 truncate">
                          ↳ {message.replyTo.content}
                        </p>
                      </div>
                    )} */}
                    <p className="text-sm">{message.content}</p>
                    {/* {message.files && message.files.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.files.map((file, index) =>
                          renderFileAttachment(file, index)
                        )}
                      </div>
                    )} */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleReply(message.id, message.content, user.name)
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-8 top-2 h-6 w-6 p-0"
                    >
                      <Reply className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {message.createdAt}
                  </span>
                </div>
              </div>

              {/* Replies */}
              {message.replies &&
                message.replies.map((reply, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 group ${
                      // reply.sender. === "admin" ? "justify-end" : ""
                      "justify-end"
                    }`}
                  >
                    {/* {reply.sender === "customer" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )} */}
                    <div className="flex-1 max-w-md">
                      <div
                        className="rounded-lg p-3 relative bg-blue-500 text-white ml-auto "
                        // className={`rounded-lg p-3 relative ${
                        //   reply.sender === "admin"
                        //     ? "bg-blue-500 text-white ml-auto"
                        //     : "bg-gray-100"
                        // }`}
                      >
                        {/* {reply.replyTo && (
                          <div
                            className={`p-2 rounded mb-2 text-xs ${
                              reply.sender === "admin"
                                ? "bg-blue-400"
                                : "bg-gray-200"
                            }`}
                          >
                            <p
                              className={`truncate ${
                                reply.sender === "admin"
                                  ? "text-blue-100"
                                  : "text-gray-600"
                              }`}
                            >
                              ↳ {reply.replyTo.content}
                            </p>
                          </div>
                        )} */}
                        <p className="text-sm">{reply.content}</p>
                        {reply.files && reply.files?.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {reply.files.map((file, fileIndex) =>
                              renderFileAttachment(file, fileIndex)
                            )}
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-xs text-gray-500 mt-1 block  text-right`}
                        // className={`text-xs text-gray-500 mt-1 block ${
                        //   reply.sender === "admin" ? "text-right" : ""
                        // }`}
                      >
                        {/* {reply.timestamp} */}
                      </span>
                    </div>
                    {/* {reply.sender === "admin" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    )} */}
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
                key={index}
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
              disabled={!newMessage.trim() && attachedFiles.length === 0}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.pdf,.txt,.doc,.docx"
          className="hidden"
        />
      </div>
    </div>
  );
};
export default ChatConversation;
