import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MusicSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function MusicSearch({ onSearch, isLoading }: MusicSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for any music, artist, or song..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              "pl-10 pr-10 h-12 bg-card/80 backdrop-blur-sm border-border/50",
              "focus:border-primary/50 focus:ring-primary/20",
              "placeholder:text-muted-foreground/60"
            )}
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="h-12 px-6 gradient-primary hover:opacity-90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 pl-1">
        Try searching: "meditation music", "Ajeet Kaur", "ambient study", "indian classical"
      </p>
    </form>
  );
}
