import { useState } from "react";
import { Book, Film, Music, Sparkles, ArrowRight, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

import { CategoryCard } from "@/components/CategoryCard";
import { ProfileWizard, UserProfile } from "@/components/ProfileWizard";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { ContentSearch } from "@/components/ContentSearch";
import { Pagination } from "@/components/Pagination";
import { useRecommendations } from "@/hooks/useRecommendations";
import heroImage from "@/assets/hero-discover.jpg";
import { cn } from "@/lib/utils";

type AppState = "welcome" | "category" | "wizard" | "recommendations";
type Category = "books" | "movies" | "music";


const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const { 
    recommendations, 
    isLoading,
    currentPage,
    totalPages,
    isSearchMode,
    generateRecommendations,
    searchContent,
    replaceRecommendation,
    goToPage,
  } = useRecommendations();

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setAppState("wizard");
  };

  const handleWizardComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setAppState("recommendations");
    
    if (selectedCategory) {
      await generateRecommendations(profile, selectedCategory);
    }
  };

  const handleSearch = async (query: string) => {
    if (userProfile && selectedCategory) {
      await searchContent(query, userProfile, selectedCategory);
    }
  };

  const handleBack = () => {
    if (appState === "wizard") {
      setAppState("category");
      setSelectedCategory(null);
    } else if (appState === "recommendations") {
      setAppState("wizard");
    } else if (appState === "category") {
      setAppState("welcome");
    }
  };

  const handleLike = (id: string) => {
    console.log("Liked:", id);
  };

  const handleDislike = (id: string) => {
    console.log("Disliked:", id);
  };

  const handleReplace = async (id: string) => {
    if (userProfile && selectedCategory) {
      await replaceRecommendation(id, userProfile, selectedCategory);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sun className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-semibold text-lg text-foreground">Conscious</span>
          </div>
          
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Welcome Screen */}
        {appState === "welcome" && (
          <div className="animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden mb-12">
              <img
                src={heroImage}
                alt="Consciousness expansion through mindful content"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span>Conscious Recommendations</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 max-w-3xl">
                  Elevate What You{" "}
                  <span className="text-gradient">Read, Watch & Listen</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                  Discover culturally resonant books, mindful cinema, and consciousness-expanding music.
                  What you consume shapes who you become.
                </p>
                <Button
                  size="lg"
                  className="gap-2 gradient-primary hover:opacity-90 text-primary-foreground"
                  onClick={() => setAppState("category")}
                >
                  Begin Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-gradient mb-2">30%</div>
                <p className="text-sm text-muted-foreground">Cultural Proximity</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-gradient mb-2">30%</div>
                <p className="text-sm text-muted-foreground">Cognitive Value</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-gradient mb-2">25%</div>
                <p className="text-sm text-muted-foreground">Activity Relevance</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-gradient mb-2">15%</div>
                <p className="text-sm text-muted-foreground">Popularity</p>
              </div>
            </div>
          </div>
        )}

        {/* Category Selection */}
        {appState === "category" && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What would you like to explore?
              </h2>
              <p className="text-muted-foreground">
                Choose a category and we'll find conscious recommendations for you
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <CategoryCard
                title="Books"
                description="Literature that expands your mind and resonates with your cultural roots"
                icon={Book}
                gradient="gradient-primary"
                onClick={() => handleCategorySelect("books")}
              />
              <CategoryCard
                title="Movies"
                description="Conscious cinema from festivals worldwide, prioritizing art over popularity"
                icon={Film}
                gradient="gradient-primary"
                onClick={() => handleCategorySelect("movies")}
              />
              <CategoryCard
                title="Music"
                description="Soundscapes for every state of mind — from focus to meditation"
                icon={Music}
                gradient="gradient-primary"
                onClick={() => handleCategorySelect("music")}
              />
            </div>
            <div className="text-center mt-8">
              <button
                onClick={handleBack}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to home
              </button>
            </div>
          </div>
        )}

        {/* Profile Wizard */}
        {appState === "wizard" && selectedCategory && (
          <ProfileWizard
            category={selectedCategory}
            onComplete={handleWizardComplete}
            onBack={handleBack}
          />
        )}

        {/* Recommendations */}
        {appState === "recommendations" && selectedCategory && (
          <div className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <button
                  onClick={handleBack}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                  ← Change preferences
                </button>
                <h2 className="text-2xl font-bold text-foreground">
                  {isSearchMode ? "Search Results" : "Your Essence Picks"}
                </h2>
                <p className="text-muted-foreground">
                  Curated for {userProfile?.city}, {userProfile?.country} •{" "}
                  {userProfile?.activity} mode
                </p>
              </div>
            </div>

            {/* Search Bar for all categories */}
            <div className="mb-6">
              <ContentSearch 
                category={selectedCategory} 
                onSearch={handleSearch} 
                isLoading={isLoading} 
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-1">
              <RecommendationPanel
                category={selectedCategory}
                recommendations={recommendations}
                isLoading={isLoading}
                onLike={handleLike}
                onDislike={handleDislike}
                onReplace={handleReplace}
              />
            </div>

            {/* Pagination */}
            {!isLoading && recommendations.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}

            <div className="mt-8 rounded-2xl border border-border glass-card p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Our Ranking Philosophy
              </h3>
              <div className="grid gap-4 md:grid-cols-4 text-sm">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="font-bold text-primary text-2xl mb-1">30%</div>
                  <div className="text-foreground font-medium">Cultural Proximity</div>
                  <p className="text-muted-foreground text-xs mt-1">
                    Regional creators and culturally resonant content prioritized
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="font-bold text-primary text-2xl mb-1">30%</div>
                  <div className="text-foreground font-medium">Cognitive Value</div>
                  <p className="text-muted-foreground text-xs mt-1">
                    Intellectual nourishment and consciousness expansion
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="font-bold text-primary text-2xl mb-1">25%</div>
                  <div className="text-foreground font-medium">Activity Relevance</div>
                  <p className="text-muted-foreground text-xs mt-1">
                    Matched to your current intent and state of mind
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="font-bold text-primary text-2xl mb-1">15%</div>
                  <div className="text-foreground font-medium">Popularity</div>
                  <p className="text-muted-foreground text-xs mt-1">
                    General acclaim considered but not prioritized
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 glass">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              <span className="font-serif font-semibold text-foreground">Conscious Recommendations</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              What you consume shapes who you become. Choose wisely.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
