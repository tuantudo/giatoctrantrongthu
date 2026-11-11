import * as React from "react";
import { Button } from "@/components/ui/button";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const DEFAULT_QUESTIONS = [
  "Trần Trọng Thư nghiên cứu về những vấn đề gì?",
  "Tìm các bài viết và tư liệu liên quan đến gia tộc",
  "Giải thích các quan điểm và trước tác nổi bật",
];

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-lg mt-6">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-center">
        Gợi ý câu hỏi
      </p>
      <div className="flex flex-col gap-2">
        {DEFAULT_QUESTIONS.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left text-sm h-auto py-2.5 px-3.5 whitespace-normal border-dashed hover:border-solid hover:bg-muted/50"
            onClick={() => onSelect(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}
