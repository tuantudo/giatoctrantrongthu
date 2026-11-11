"use client";

import * as React from "react";
import { ChatShell, MessageItem } from "@/components/chat/chat-shell";

export default function HomePage() {
  const [messages, setMessages] = React.useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: MessageItem = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const assistantMessageId = (Date.now() + 1).toString();
      
      // Khởi tạo message trống cho assistant kèm mock tool steps & citations
      const initialAssistantMessage: MessageItem = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        toolSteps: [
          { id: "1", name: "Đang tra cứu tư liệu liên quan", status: "completed", detail: "giatoctrantrongthu.com" },
          { id: "2", name: "Đã tìm thấy 3 nguồn đối chiếu", status: "completed" },
        ],
        citations: [
          {
            id: "c1",
            title: "Tư liệu dòng họ & Trước tác Trần Trọng Thư",
            snippet: "Tổng quan về quá trình trước tác và nghiên cứu chuyên khảo.",
            url: "https://giatoctrantrongthu.com",
          },
        ],
      };

      setMessages((prev) => [...prev, initialAssistantMessage]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Không thể kết nối với máy chủ AI.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        streamedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: streamedContent }
              : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      const errorMessage: MessageItem = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Đã có lỗi xảy ra trong quá trình xử lý câu hỏi. Vui lòng thử lại sau.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <ChatShell
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </main>
  );
}

