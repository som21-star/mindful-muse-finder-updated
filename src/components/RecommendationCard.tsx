import { ThumbsUp, ThumbsDown, RefreshCw, Sparkles, ExternalLink, Book, Film, Music, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export interface Platform {
  name: string;
  url: string;
  type: "primary" | "secondary";
}

export interface Recommendation {
  id: string;
  title: string;
  creator: string;
  origin: string;
  reason: string;
  tags: string[];
  score: number;
  platforms?: Platform[];
  isRegional?: boolean;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
  category: "books" | "movies" | "music";
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onReplace: (id: string) => void;
}

export function RecommendationCard({
  recommendation,
  index,
  category,
  onLike,
  onDislike,
  onReplace,
}: RecommendationCardProps) {
  const actionLabel = category === "books" ? "Read" : category === "movies" ? "Watch" : "Listen";
  const ActionIcon = category === "books" ? Book : category === "movies" ? Film : Music;

  const handlePlatformClick = (platform: Platform, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!platform.url || platform.url.trim() === '') {
      toast({
        title: "Link unavailable",
        description: `${platform.name} link not available for this title.`,
        variant: "destructive"
      });
      return;
    }
    
    const isYouTube = platform.name.toLowerCase().includes('youtube') || /youtu\.be/.test(platform.url);
    let finalUrl = platform.url;

    try {
      // Ensure URL has protocol for parsing
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      if (isYouTube) {
        const u = new URL(finalUrl);
        let videoId: string | null = null;

        if (u.hostname.includes('youtu.be')) {
          videoId = u.pathname.slice(1);
        } else if (u.pathname.startsWith('/embed/')) {
          videoId = u.pathname.split('/embed/')[1];
        } else if (u.searchParams.has('v')) {
          videoId = u.searchParams.get('v');
        }

        if (videoId) {
          const watch = new URL('https://www.youtube.com/watch');
          watch.searchParams.set('v', videoId);
          // copy other params (like t, start) except v
          u.searchParams.forEach((value, key) => {
            if (key !== 'v') watch.searchParams.set(key, value);
          });
          finalUrl = watch.toString();
        } else {
          finalUrl = u.toString();
        }
      }
    } catch (err) {
      // if URL parsing fails, fall back to original string
      finalUrl = platform.url;
    }
    
    const newWindow = window.open(finalUrl, '_blank');

    if (newWindow) {
      try {
        newWindow.opener = null;
      } catch (e) {
        // ignore if setting opener is not allowed
      }
    } else {
      const link = document.createElement('a');
      link.href = finalUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div
      className={cn(
        "group relative w-full rounded-xl border bg-card/80 backdrop-blur-sm p-5 transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/5",
        recommendation.isRegional 
          ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" 
          : "border-border hover:border-primary/20"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Regional/Worldwide Badge - keep in top-right corner (reserve space so it doesn't overlap title) */}
      <div className="absolute top-3 right-3">
        {recommendation.isRegional ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            <MapPin className="h-3 w-3" />
            Regional
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            <Globe className="h-3 w-3" />
            Worldwide
          </span>
        )}
      </div>

      <div className="mb-4 pr-16 sm:pr-20">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                recommendation.isRegional 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-primary/10 text-primary"
              )}>
                {index + 1}
              </span>
              <h4 className="font-semibold text-foreground text-lg leading-snug break-words whitespace-normal">{recommendation.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              by {recommendation.creator} • {recommendation.origin}
            </p>
          </div>
        </div>

        {/* Action buttons positioned slightly left of the badge so badge remains top-right */}
        <div className="absolute top-3 right-14 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onLike(recommendation.id)}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            title="More like this"
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDislike(recommendation.id)}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            title="Not for me"
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => onReplace(recommendation.id)}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            title="Replace suggestion"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {recommendation.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 border border-primary/10">
        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground leading-relaxed">
          {recommendation.reason}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Match Score</span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${recommendation.score}%` }}
            />
          </div>
          <span className="font-medium text-primary">{recommendation.score}%</span>
        </div>
      </div>

      {/* Platform Links */}
      {recommendation.platforms && recommendation.platforms.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <ActionIcon className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">{actionLabel} on:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendation.platforms.slice(0, 6).map((platform) => (
                <Button
                  key={platform.name}
                  variant={platform.type === "primary" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-7 text-xs gap-1.5",
                    platform.type === "primary" && "gradient-primary hover:opacity-90"
                  )}
                  onClick={(e) => handlePlatformClick(platform, e)}
                >
                  {platform.name}
                  <ExternalLink className="h-3 w-3" />
                </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
