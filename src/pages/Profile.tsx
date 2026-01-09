import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/Auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, User, MapPin, Brain, Heart, Zap, Book, Music, Film, Save, ArrowLeft } from "lucide-react";

// Helper to ensure array
const toArray = (val: any): string[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.length > 0) return [val];
  return [];
};

// MindMuse Preference Options
const ageRanges = [
  { value: "6-12", label: "6-12 years" },
  { value: "13-17", label: "13-17 years" },
  { value: "18-25", label: "18-25 years" },
  { value: "26-35", label: "26-35 years" },
  { value: "36-50", label: "36-50 years" },
  { value: "50+", label: "50+ years" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not", label: "Prefer not to say" },
];

const personalityTraits = [
  { value: "introvert", label: "Introverted" },
  { value: "extrovert", label: "Extroverted" },
  { value: "ambivert", label: "Ambivert" },
  { value: "creative", label: "Creative" },
  { value: "analytical", label: "Analytical" },
  { value: "curious", label: "Curious" },
  { value: "reflective", label: "Reflective" },
  { value: "spontaneous", label: "Spontaneous" },
  { value: "empathetic", label: "Empathetic" },
  { value: "philosophical", label: "Philosophical" },
  { value: "spiritual", label: "Spiritual" },
  { value: "pragmatic", label: "Pragmatic" },
];

const moodPreferences = [
  { value: "calm", label: "Calm / Peaceful" },
  { value: "energetic", label: "Energetic / Upbeat" },
  { value: "focused", label: "Focused / Determined" },
  { value: "melancholic", label: "Melancholic / Reflective" },
  { value: "joyful", label: "Joyful / Happy" },
  { value: "spiritual", label: "Spiritual / Transcendent" },
  { value: "romantic", label: "Romantic / Emotional" },
  { value: "curious", label: "Curious / Exploratory" },
  { value: "nostalgic", label: "Nostalgic / Sentimental" },
  { value: "adventurous", label: "Adventurous / Bold" },
  { value: "contemplative", label: "Contemplative" },
  { value: "inspired", label: "Inspired / Creative" },
];

const activityTemplates = [
  { value: "study", label: "Study / Learning" },
  { value: "work", label: "Work / Focus" },
  { value: "meditation", label: "Meditation" },
  { value: "sleep", label: "Sleep / Rest" },
  { value: "gym", label: "Gym / Exercise" },
  { value: "relaxation", label: "Relaxation" },
  { value: "reading", label: "Deep Reading" },
  { value: "discovery", label: "Discovery / Exploration" },
  { value: "travel", label: "Travel / Commute" },
  { value: "cooking", label: "Cooking / Chores" },
  { value: "party", label: "Party / Social" },
  { value: "creative", label: "Creative Work" },
  { value: "healing", label: "Healing / Recovery" },
  { value: "morning", label: "Morning Routine" },
  { value: "evening", label: "Evening Wind-down" },
  { value: "daily", label: "Daily Background" },
];

// Book preferences - prioritizing regional/conscious content
const bookGenres = [
  { value: "regional-classics", label: "Regional Classics (Narayan Debnath, Shibram)" },
  { value: "indian-literature", label: "Indian Literature (Bond, Sudha Murthy)" },
  { value: "comics", label: "Comics & Graphic Novels" },
  { value: "philosophy", label: "Philosophy & Thought" },
  { value: "spirituality", label: "Spirituality & Mysticism" },
  { value: "classic", label: "Classic Literature" },
  { value: "poetry", label: "Poetry" },
  { value: "biography", label: "Biography & Memoir" },
  { value: "self-help", label: "Self-Help & Growth" },
  { value: "science", label: "Science & Nature" },
  { value: "history", label: "History & Culture" },
  { value: "fantasy", label: "Fantasy & Sci-Fi" },
  { value: "mystery", label: "Mystery & Thriller" },
  { value: "modern-fiction", label: "Modern Fiction" },
  { value: "children", label: "Children's Books" },
];

// Music preferences - Instrumental > Vocal philosophy
const musicTypes = [
  { value: "instrumental", label: "Instrumental (Priority)" },
  { value: "classical-indian", label: "Indian Classical (Santoor, Ragas)" },
  { value: "ambient", label: "Ambient & Atmospheric" },
  { value: "meditation", label: "Meditation & Healing (Singing Bowls)" },
  { value: "cinematic", label: "Cinematic Scores (Hans Zimmer)" },
  { value: "world", label: "World & Folk (Gusli, etc.)" },
  { value: "classical-western", label: "Western Classical" },
  { value: "lofi", label: "Lo-Fi & Chill" },
  { value: "binaural", label: "Binaural Beats / Focus Hz" },
  { value: "jazz", label: "Jazz & Blues" },
  { value: "electronic", label: "Electronic & Ambient EDM" },
  { value: "spiritual", label: "Spiritual & Devotional" },
  { value: "indie", label: "Indie & Singer-Songwriter" },
  { value: "fusion", label: "Fusion & Cross-genre" },
];

// Movie preferences - Festival > IMDB philosophy
const movieStyles = [
  { value: "festival", label: "Festival Cinema (Cannes, Berlin, TIFF)" },
  { value: "world", label: "World Cinema (Iran, Japan, France)" },
  { value: "indian-independent", label: "Indian Independent (Jallikattu, Pebbles)" },
  { value: "documentary", label: "Documentary" },
  { value: "cinematic-art", label: "Cinematic Art Films" },
  { value: "philosophy", label: "Philosophical Films" },
  { value: "animation", label: "Animation & Anime" },
  { value: "drama", label: "Drama" },
  { value: "thriller", label: "Thriller & Suspense" },
  { value: "historical", label: "Historical & Period" },
  { value: "comedy", label: "Comedy" },
  { value: "romance", label: "Romance" },
  { value: "scifi", label: "Sci-Fi & Fantasy" },
  { value: "action", label: "Action & Adventure" },
];

const countries = [
  { value: "india", label: "India" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "japan", label: "Japan" },
  { value: "france", label: "France" },
  { value: "germany", label: "Germany" },
  { value: "brazil", label: "Brazil" },
  { value: "australia", label: "Australia" },
  { value: "canada", label: "Canada" },
  { value: "south-korea", label: "South Korea" },
  { value: "iran", label: "Iran" },
  { value: "italy", label: "Italy" },
  { value: "spain", label: "Spain" },
  { value: "nigeria", label: "Nigeria" },
  { value: "other", label: "Other" },
];

interface MindMuseProfile {
  ageRange: string;
  gender: string;
  city: string;
  region: string;
  country: string;
  personalityTraits: string[];
  moodPreferences: string[];
  activityTemplates: string[];
  bookGenres: string[];
  musicTypes: string[];
  movieStyles: string[];
}

const ProfilePage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [profile, setProfile] = useState<MindMuseProfile>({
    ageRange: "",
    gender: "",
    city: "",
    region: "",
    country: "",
    personalityTraits: [],
    moodPreferences: [],
    activityTemplates: [],
    bookGenres: [],
    musicTypes: [],
    movieStyles: [],
  });
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSetup = searchParams.get("setup") === "true";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setProfile({
          ageRange: data.age ?? "",
          gender: data.gender ?? "",
          city: data.city ?? "",
          region: data.region ?? "",
          country: data.country ?? "",
          personalityTraits: toArray(data.personality_traits),
          moodPreferences: toArray(data.mood),
          activityTemplates: toArray(data.activity),
          bookGenres: toArray(data.book_genre),
          musicTypes: toArray(data.music_type),
          movieStyles: toArray(data.movie_style),
        });
      }
    };

    fetchProfile();
  }, [user]);

  const updateField = (field: keyof MindMuseProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        age: profile.ageRange || null,
        gender: profile.gender || null,
        city: profile.city || null,
        region: profile.region || null,
        country: profile.country || null,
        personality_traits: profile.personalityTraits,
        mood: profile.moodPreferences,
        activity: profile.activityTemplates,
        book_genre: profile.bookGenres,
        music_type: profile.musicTypes,
        movie_style: profile.movieStyles,
      };

      const { error } = await supabase
        .from("user_profiles")
        .upsert(payload, { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Profile saved ✨",
        description: "Your conscious preferences are now active.",
      });

      if (isSetup) {
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Failed to save profile",
        description: err.message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading your universe...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="font-serif font-semibold text-lg">MindMuse</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await signOut();
              navigate("/auth");
            }}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="relative z-10 container max-w-4xl px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
            <Sparkles className="h-4 w-4" />
            {isSetup ? "Let's craft your profile" : "Your Conscious Profile"}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {isSetup ? "Welcome to MindMuse" : "Your Preferences"}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            What you consume shapes who you become. Choose wisely.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Demographics Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-gradient-cosmic" />
                Who You Are
              </CardTitle>
              <CardDescription>Basic demographic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                        <User className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">Click to upload profile photo</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <Select value={profile.ageRange} onValueChange={(v) => updateField("ageRange", v)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageRanges.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender (Optional)</Label>
                  <Select value={profile.gender} onValueChange={(v) => updateField("gender", v)}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-gradient-cosmic" />
                Where You're From
              </CardTitle>
              <CardDescription>Cultural context shapes recommendations (30% weight)</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  className="glass-input"
                  value={profile.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="e.g. Kolkata"
                />
              </div>
              <div className="space-y-2">
                <Label>Region / State</Label>
                <Input
                  className="glass-input"
                  value={profile.region}
                  onChange={(e) => updateField("region", e.target.value)}
                  placeholder="e.g. West Bengal"
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={profile.country} onValueChange={(v) => updateField("country", v)}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Personality Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-gradient-cosmic" />
                Your Personality
              </CardTitle>
              <CardDescription>Select all traits that resonate with you</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiSelectDropdown
                label="Traits"
                options={personalityTraits}
                selected={profile.personalityTraits}
                onChange={(v) => updateField("personalityTraits", v)}
                placeholder="Select personality traits..."
              />
            </CardContent>
          </Card>

          {/* Mood Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-gradient-cosmic" />
                Mood Preferences
              </CardTitle>
              <CardDescription>What moods do you usually seek or prefer?</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiSelectDropdown
                label="Moods"
                options={moodPreferences}
                selected={profile.moodPreferences}
                onChange={(v) => updateField("moodPreferences", v)}
                placeholder="Select mood preferences..."
              />
            </CardContent>
          </Card>

          {/* Activity Templates Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-gradient-cosmic" />
                Activity Templates
              </CardTitle>
              <CardDescription>When do you usually consume content? (25% weight)</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiSelectDropdown
                label="Activities"
                options={activityTemplates}
                selected={profile.activityTemplates}
                onChange={(v) => updateField("activityTemplates", v)}
                placeholder="Select activities..."
              />
            </CardContent>
          </Card>

          {/* Books Section */}
          <Card className="glass-card border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Book className="h-5 w-5 text-gradient-cosmic" />
                Book Preferences
              </CardTitle>
              <CardDescription>Regional creators prioritized over Western defaults</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiSelectDropdown
                label="Genres"
                options={bookGenres}
                selected={profile.bookGenres}
                onChange={(v) => updateField("bookGenres", v)}
                placeholder="Select book genres..."
              />
            </CardContent>
          </Card>

          {/* Music Section */}
          <Card className="glass-card border-l-4 border-l-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Music className="h-5 w-5 text-gradient-cosmic" />
                Music Preferences
              </CardTitle>
              <CardDescription>Instrumental &gt; Vocal • 50-60 BPM • Pure soothing backgrounds</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiSelectDropdown
                label="Types"
                options={musicTypes}
                selected={profile.musicTypes}
                onChange={(v) => updateField("musicTypes", v)}
                placeholder="Select music types..."
              />
            </CardContent>
          </Card>

          {/* Movies Section */}
          <Card className="glass-card border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Film className="h-5 w-5 text-gradient-cosmic" />
                Movie Preferences
              </CardTitle>
              <CardDescription>Festival recognition &gt; IMDB ratings • Conscious cinema</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiSelectDropdown
                label="Styles"
                options={movieStyles}
                selected={profile.movieStyles}
                onChange={(v) => updateField("movieStyles", v)}
                placeholder="Select movie styles..."
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={saving}
              className="gap-2 px-8 bg-accent hover:bg-accent/90 text-accent-foreground glow-primary"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving your universe..." : isSetup ? "Start My Journey" : "Save Preferences"}
            </Button>
          </div>

          {/* Footer Tagline */}
          <p className="text-center text-sm text-muted-foreground pt-4">
            What you consume shapes who you become. Choose wisely.
          </p>
        </form>
      </main>
    </div>
  );
};

export default ProfilePage;
