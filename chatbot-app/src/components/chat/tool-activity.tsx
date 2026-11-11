import * as React from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToolStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  detail?: string;
}

interface ToolActivityProps {
  steps?: ToolStep[];
  className?: string;
}

export function ToolActivity({ steps = [], className }: ToolActivityProps) {
  if (!steps.length) return null;

  return (
    <div className={cn("rounded-md border bg-muted/30 p-3 my-2 text-xs space-y-2", className)}>
      <div className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
        Hoạt động hệ thống
      </div>
      <div className="space-y-1.5">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-2 text-muted-foreground">
            {step.status === "running" && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            )}
            {step.status === "completed" && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span className={cn(step.status === "completed" && "text-foreground font-medium")}>
              {step.name}
            </span>
            {step.detail && (
              <span className="text-muted-foreground/75 italic">({step.detail})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
