import { Book, Film, Music, Sparkles } from "lucide-react";
import { RecommendationCard, Recommendation } from "./RecommendationCard";
import { cn } from "@/lib/utils";

interface RecommendationPanelProps {
  category: "books" | "movies" | "music";
  recommendations: Recommendation[];
  isLoading?: boolean;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onReplace: (id: string) => void;
}

const categoryConfig = {
  books: {
    icon: Book,
    title: "Book Recommendations",
    subtitle: "Curated reads for your consciousness",
  },
  movies: {
    icon: Film,
    title: "Film Recommendations",
    subtitle: "Conscious cinema selections",
  },
  music: {
    icon: Music,
    title: "Music Recommendations",
    subtitle: "Sounds to elevate your state",
  },
};

export function RecommendationPanel({
  category,
  recommendations,
  isLoading,
  onLike,
  onDislike,
  onReplace,
}: RecommendationPanelProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{config.title}</h3>
            <p className="text-sm text-muted-foreground">{config.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-muted animate-pulse" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">Finding conscious recommendations...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                index={index}
                category={category}
                onLike={onLike}
                onDislike={onDislike}
                onReplace={onReplace}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
