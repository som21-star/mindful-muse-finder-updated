import { useEffect, useState } from "react";
import { getDailySuggestions } from "@/utils/dailySuggestions";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Sparkles, Book, Film, Music } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const DailySuggestions = () => {
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
        const dailyItems = getDailySuggestions(new Date());
        setSuggestions(dailyItems);
    }, []);

    const getIcon = (origin: string) => {
        switch (origin) {
            case "Book": return <Book className="h-4 w-4 text-purple-400" />;
            case "Film": return <Film className="h-4 w-4 text-blue-400" />;
            case "Music": return <Music className="h-4 w-4 text-pink-400" />;
            default: return <Sparkles className="h-4 w-4 text-yellow-400" />;
        }
    };

    return (
        <div className="w-full mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                    Daily Mindful Optimisations
                </h2>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 backdrop-blur-sm">
                <div className="mb-6 text-center">
                    <h3 className="text-lg font-medium text-foreground italic font-serif">
                        "What you consume shapes who you become. Choose wisely."
                    </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {suggestions.map((item) => (
                        <Card key={item.id} className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors">
                            <CardContent className="p-4 flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {getIcon(item.origin)}
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {item.origin}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        by {item.creator}
                                    </p>
                                </div>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs bg-popover text-popover-foreground border-border p-3">
                                            <p className="text-sm font-medium mb-1">Why this choice?</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {item.reason}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
