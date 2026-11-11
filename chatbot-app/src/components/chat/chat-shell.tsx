"use client";

import * as React from "react";
import { ChatHeader } from "./chat-header";
import { ChatMessage } from "./chat-message";
import { ChatComposer } from "./chat-composer";
import { ChatEmptyState } from "./chat-empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolActivity, ToolStep } from "./tool-activity";
import { SourceCitation, CitationItem } from "./source-citation";

export interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolSteps?: ToolStep[];
  citations?: CitationItem[];
}

interface ChatShellProps {
  messages: MessageItem[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onStop?: () => void;
}

export function ChatShell({
  messages,
  isLoading,
  onSendMessage,
  onStop,
}: ChatShellProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4">
      <ChatHeader />

      <div className="flex-1 overflow-hidden relative flex flex-col">
        {messages.length === 0 ? (
          <ChatEmptyState onSelectQuestion={onSendMessage} />
        ) : (
          <ScrollArea ref={scrollRef} className="flex-1 pr-4 mb-4">
            <div className="space-y-6 pb-4">
              {messages.map((m) => (
                <div key={m.id} className="flex flex-col">
                  {m.toolSteps && m.toolSteps.length > 0 && (
                    <ToolActivity steps={m.toolSteps} className="max-w-[85%]" />
                  )}
                  <ChatMessage
                    message={{
                      role: m.role,
                      content: m.content,
                    }}
                  />
                  {m.citations && m.citations.length > 0 && (
                    <SourceCitation
                      citations={m.citations}
                      className="max-w-[85%]"
                    />
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground italic px-3 py-2 bg-muted/30 rounded-md w-fit animate-pulse">
                  <span>Đang suy nghĩ và soạn phản hồi...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="pt-2 pb-4">
        <ChatComposer
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
