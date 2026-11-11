import * as React from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CitationItem {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
}

interface SourceCitationProps {
  citations?: CitationItem[];
  className?: string;
}

export function SourceCitation({ citations = [], className }: SourceCitationProps) {
  if (!citations.length) return null;

  return (
    <div className={cn("mt-4 pt-3 border-t text-xs space-y-2", className)}>
      <div className="flex items-center gap-1.5 font-serif font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
        <BookOpen className="w-3.5 h-3.5" />
        Nguồn tham khảo
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {citations.map((item) => (
          <a
            key={item.id}
            href={item.url || "#"}
            target={item.url ? "_blank" : undefined}
            rel="noreferrer"
            className="flex flex-col p-2 rounded border bg-card/60 hover:bg-muted/50 transition-colors text-foreground group"
          >
            <div className="flex items-center justify-between font-medium line-clamp-1 group-hover:text-primary">
              <span>{item.title}</span>
              {item.url && <ExternalLink className="w-3 h-3 opacity-60 ml-1 shrink-0" />}
            </div>
            {item.snippet && (
              <p className="text-muted-foreground text-[11px] line-clamp-2 mt-0.5">
                {item.snippet}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
