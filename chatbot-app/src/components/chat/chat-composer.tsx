import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";

interface ChatComposerProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatComposer({ onSendMessage, isLoading }: ChatComposerProps) {
  const [input, setInput] = React.useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center w-full gap-2 p-2 border rounded-lg bg-background">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập câu hỏi của bạn..."
        className="min-h-[44px] max-h-[200px] border-0 focus-visible:ring-0 shadow-none resize-none"
        disabled={isLoading}
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
      >
        <SendHorizontal className="w-5 h-5" />
      </Button>
    </div>
  );
}
