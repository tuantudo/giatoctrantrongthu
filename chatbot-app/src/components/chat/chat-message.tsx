import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex w-full mb-6", isAssistant ? "justify-start" : "justify-end")}>
      <div className={cn(
        "max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed",
        isAssistant 
          ? "bg-muted text-muted-foreground border" 
          : "bg-primary text-primary-foreground"
      )}>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

