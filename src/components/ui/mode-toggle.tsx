import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  mode: "web" | "mobile";
  onModeChange: (mode: "web" | "mobile") => void;
  className?: string;
}

export function ModeToggle({ mode, onModeChange, className }: ModeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card p-1",
        className
      )}
    >
      <button
        onClick={() => onModeChange("web")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
          mode === "web"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Monitor className="h-4 w-4" />
        <span>Web</span>
      </button>
      <button
        onClick={() => onModeChange("mobile")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
          mode === "mobile"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Smartphone className="h-4 w-4" />
        <span>Mobile</span>
      </button>
    </div>
  );
}
