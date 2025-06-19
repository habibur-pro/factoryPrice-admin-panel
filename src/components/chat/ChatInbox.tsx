import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatUser } from "./chatData";

interface ChatInboxProps {
  users: ChatUser[];
  selectedUserId?: string;
  onSelectUser: (userId: string) => void;
}

const ChatInbox = ({ users, selectedUserId, onSelectUser }: ChatInboxProps) => {
  return (
    <div className="h-full w-full border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="space-y-1 p-2">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedUserId === user.id
                  ? "bg-blue-50 border border-blue-200"
                  : ""
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {user.name}
                  </h3>
                  <span className="text-xs text-gray-500 ">
                    {user.lastMessageTime}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate text-wrap">
                  {user.lastMessage.slice(0, 30)}
                </p>
              </div>

              {user.unreadCount > 0 && (
                <Badge className="bg-blue-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                  {user.unreadCount}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
export default ChatInbox;
