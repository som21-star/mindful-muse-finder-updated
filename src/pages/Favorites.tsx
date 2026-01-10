
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useFavorites } from "@/hooks/useFavorites";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Book, Film, Music, Trash2, Heart, ExternalLink } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function Favorites() {
    const { favorites, isLoading, toggleFavorite } = useFavorites();
    const [filter, setFilter] = useState("all");

    const filteredFavorites = favorites.filter((fav) => {
        if (filter === "all") return true;
        return fav.item_type === filter;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case "book": return <Book className="h-5 w-5" />;
            case "movie": return <Film className="h-5 w-5" />;
            case "music": return <Music className="h-5 w-5" />;
            default: return <Heart className="h-5 w-5" />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            Your Favourites
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            A collection of your mindful discoveries.
                        </p>
                    </div>
                    <Tabs defaultValue="all" onValueChange={setFilter}>
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="book">Books</TabsTrigger>
                            <TabsTrigger value="movie">Movies</TabsTrigger>
                            <TabsTrigger value="music">Music</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredFavorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center rounded-2xl border border-dashed border-border/50 bg-card/50">
                        <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No favorites yet</h3>
                        <p className="text-muted-foreground max-w-sm mt-1">
                            Start adding content to your favorites to see them appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredFavorites.map((fav) => (
                            <Card key={fav.id} className="group hover:border-primary/30 transition-all duration-300">
                                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                                            {getIcon(fav.item_type)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base line-clamp-1" title={fav.item_title || "Unknown Title"}>
                                                {fav.item_title || "Unknown Title"}
                                            </CardTitle>
                                            <CardDescription className="text-xs capitalize">
                                                {fav.item_type} • Saved {new Date(fav.created_at).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-end gap-2 pt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2 lg:px-3"
                                            onClick={() => toggleFavorite(fav.item_id, fav.item_type)}
                                        >
                                            <Trash2 className="h-4 w-4 lg:mr-2" />
                                            <span className="hidden lg:inline">Remove</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
