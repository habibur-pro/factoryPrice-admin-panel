import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSmartTimeAgo } from "@/utils/getSmartTimeAgo";
import { IChatSession } from "@/types";

interface ChatInboxProps {
  sessions: IChatSession[];
  selectedSessionId?: string | null;
  onSelectUser: (userId: string) => void;
}

const ChatInbox = ({
  sessions,
  selectedSessionId,
  onSelectUser,
}: ChatInboxProps) => {


  return (
    <div className="h-full w-full border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="space-y-1 p-2">
          {sessions?.length > 0 &&
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectUser(session.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedSessionId === session.id
                    ? "bg-blue-50 border border-blue-200"
                    : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    {/* {session?.user?.photo && (
                      <AvatarImage
                        src={session.user.photo}
                        alt={session.user.firstName}
                      />
                    )} */}
                    <AvatarFallback>
                      {session?.senderName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {/* {session && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )} */}
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {session.senderName}
                    </h3>
                    <span className="text-xs text-gray-500 ">
                      {getSmartTimeAgo(session.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate text-wrap">
                    {session?.lastMessage && session.lastMessage.slice(0, 30)}
                  </p>
                </div>

                {session.unreadCount > 0 && (
                  <Badge className="bg-blue-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                    {session.unreadCount}
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
