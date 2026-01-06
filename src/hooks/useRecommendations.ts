import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/components/ProfileWizard";
import { Recommendation } from "@/components/RecommendationCard";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [allRecommendations, setAllRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const { toast } = useToast();

  const paginateResults = useCallback((allRecs: Recommendation[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setRecommendations(allRecs.slice(startIndex, endIndex));
    setCurrentPage(page);
    setTotalPages(Math.ceil(allRecs.length / ITEMS_PER_PAGE));
  }, []);

  const goToPage = useCallback((page: number) => {
    paginateResults(allRecommendations, page);
  }, [allRecommendations, paginateResults]);

  const generateRecommendations = useCallback(async (
    userProfile: UserProfile,
    category: "books" | "movies" | "music"
  ) => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    setAllRecommendations([]);
    setIsSearchMode(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-recommendations', {
        body: { userProfile, category, count: 15 }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to generate recommendations');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.recommendations && Array.isArray(data.recommendations)) {
        const mappedRecommendations: Recommendation[] = data.recommendations.map((rec: any) => ({
          id: rec.id || crypto.randomUUID(),
          title: rec.title,
          creator: rec.creator,
          origin: rec.origin || rec.year || '',
          reason: rec.aiReason || rec.reason || '',
          tags: rec.tags || [],
          score: rec.score || 80,
          platforms: rec.platforms || [],
          isRegional: rec.isRegional || false,
        }));
        setAllRecommendations(mappedRecommendations);
        paginateResults(mappedRecommendations, 1);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Recommendation error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [toast, paginateResults]);

  const searchContent = useCallback(async (
    searchQuery: string,
    userProfile: UserProfile,
    category: "books" | "movies" | "music"
  ) => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    setAllRecommendations([]);
    setIsSearchMode(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-recommendations', {
        body: { userProfile, category, searchQuery, count: 15 }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to search content');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.recommendations && Array.isArray(data.recommendations)) {
        const mappedRecommendations: Recommendation[] = data.recommendations.map((rec: any) => ({
          id: rec.id || crypto.randomUUID(),
          title: rec.title,
          creator: rec.creator,
          origin: rec.origin || rec.year || '',
          reason: rec.aiReason || rec.reason || '',
          tags: rec.tags || [],
          score: rec.score || 80,
          platforms: rec.platforms || [],
          isRegional: rec.isRegional || false,
        }));
        setAllRecommendations(mappedRecommendations);
        paginateResults(mappedRecommendations, 1);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search content';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [toast, paginateResults]);

  const replaceRecommendation = useCallback(async (
    id: string,
    userProfile: UserProfile,
    category: "books" | "movies" | "music"
  ) => {
    await generateRecommendations(userProfile, category);
  }, [generateRecommendations]);

  return {
    recommendations,
    allRecommendations,
    isLoading,
    error,
    currentPage,
    totalPages,
    isSearchMode,
    generateRecommendations,
    searchContent,
    replaceRecommendation,
    goToPage,
  };
}
