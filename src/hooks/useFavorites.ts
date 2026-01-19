
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/Auth";
import { toast } from "sonner";

export interface FavoriteItem {
    id: string;
    item_id: string;
    item_type: string;
    item_title?: string;
    created_at: string;
}

export const useFavorites = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setFavorites([]);
            setIsLoading(false);
            return;
        }

        const fetchFavorites = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("favorites")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching favorites:", error);
                toast.error("Failed to load favorites");
            } else {
                setFavorites(data || []);
            }
            setIsLoading(false);
        };

        fetchFavorites();
    }, [user]);

    const isFavorite = (itemId: string) => {
        return favorites.some((fav) => fav.item_id === itemId);
    };

    const toggleFavorite = async (
        itemId: string,
        itemType: string,
        itemTitle?: string,
        itemMetadata?: any
    ) => {
        if (!user) {
            toast.error("Please sign in to save favorites");
            return;
        }

        const existingFavorite = favorites.find((fav) => fav.item_id === itemId);

        if (existingFavorite) {
            // Remove favorite
            const { error } = await supabase
                .from("favorites")
                .delete()
                .eq("id", existingFavorite.id);

            if (error) {
                toast.error("Failed to remove favorite");
                console.error("Error removing favorite:", error);
            } else {
                setFavorites((prev) => prev.filter((fav) => fav.id !== existingFavorite.id));
                toast.success("Removed from favorites");
            }
        } else {
            // Add favorite
            const newFavorite = {
                user_id: user.id,
                item_id: itemId,
                item_type: itemType,
                item_title: itemTitle || null,
                item_metadata: itemMetadata || null,
            };

            const { data, error } = await supabase
                .from("favorites")
                .insert(newFavorite)
                .select()
                .single();

            if (error) {
                console.error("Error adding favorite:", error);
                toast.error(`Failed to add favorite: ${error.message}`);
            } else if (data) {
                setFavorites((prev) => [data, ...prev]);
                toast.success("Added to favorites");
            }
        }
    };

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        isLoading,
    };
};
