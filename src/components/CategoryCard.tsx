import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  isSelected?: boolean;
  onClick: () => void;
}

export function CategoryCard({
  title,
  description,
  icon: Icon,
  gradient,
  isSelected,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center transition-all duration-500",
        "hover:border-primary/50 hover:shadow-lg hover:-translate-y-1",
        isSelected && "border-primary shadow-lg ring-2 ring-primary/20"
      )}
    >
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110",
          gradient
        )}
      >
        <Icon className="h-10 w-10 text-primary-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}
