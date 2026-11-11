import * as React from "react";
import { SuggestedQuestions } from "./suggested-questions";

interface ChatEmptyStateProps {
  onSelectQuestion: (question: string) => void;
}

export function ChatEmptyState({ onSelectQuestion }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
      <div className="max-w-md space-y-3">
        <h2 className="text-3xl font-serif font-semibold tracking-tight text-foreground">
          Trần Trọng Thư
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Tôi có thể giúp bạn tìm hiểu về các nội dung, tư liệu và quan điểm được trình bày trên website.
        </p>
      </div>

      <SuggestedQuestions onSelect={onSelectQuestion} />
    </div>
  );
}
