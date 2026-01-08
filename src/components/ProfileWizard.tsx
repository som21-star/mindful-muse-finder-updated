import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { cn } from "@/lib/utils";

export interface UserProfile {
  age: string;
  gender: string;
  city: string;
  region: string;
  country: string;
  activity: string[];
  mood: string[];
  bookGenre: string[];
  musicType: string[];
  movieStyle: string[];
  personalityTraits: string[];
  alignments: string[];
}

interface ProfileWizardProps {
  category: "books" | "movies" | "music";
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

const activities = [
  { value: "study", label: "Study / Learning" },
  { value: "work", label: "Work / Focus" },
  { value: "meditation", label: "Meditation" },
  { value: "sleep", label: "Sleep / Rest" },
  { value: "gym", label: "Gym / Exercise" },
  { value: "relaxation", label: "Relaxation" },
  { value: "reading", label: "Reading" },
  { value: "discovery", label: "Discovery / Exploration" },
  { value: "travel", label: "Travel / Commute" },
  { value: "cooking", label: "Cooking / Chores" },
  { value: "party", label: "Party / Social" },
  { value: "creative", label: "Creative Work" },
  { value: "healing", label: "Healing / Recovery" },
  { value: "morning", label: "Morning Routine" },
  { value: "evening", label: "Evening Wind-down" },
];

const moods = [
  { value: "energetic", label: "Energetic / Upbeat" },
  { value: "calm", label: "Calm / Peaceful" },
  { value: "focused", label: "Focused / Determined" },
  { value: "melancholic", label: "Melancholic / Reflective" },
  { value: "joyful", label: "Joyful / Happy" },
  { value: "spiritual", label: "Spiritual / Transcendent" },
  { value: "romantic", label: "Romantic / Emotional" },
  { value: "curious", label: "Curious / Exploratory" },
  { value: "nostalgic", label: "Nostalgic / Sentimental" },
  { value: "adventurous", label: "Adventurous / Bold" },
];

const bookGenres = [
  { value: "comics", label: "Comics & Graphic Novels" },
  { value: "literature", label: "Literature & Fiction" },
  { value: "children", label: "Children's Books" },
  { value: "modern-fiction", label: "Modern Fiction" },
  { value: "classic", label: "Classic Literature" },
  { value: "self-help", label: "Self-Help & Growth" },
  { value: "philosophy", label: "Philosophy & Thought" },
  { value: "poetry", label: "Poetry" },
  { value: "biography", label: "Biography & Memoir" },
  { value: "spirituality", label: "Spirituality & Mysticism" },
  { value: "science", label: "Science & Nature" },
  { value: "history", label: "History & Culture" },
  { value: "fantasy", label: "Fantasy & Sci-Fi" },
  { value: "mystery", label: "Mystery & Thriller" },
  { value: "romance", label: "Romance" },
];

const musicTypes = [
  { value: "instrumental", label: "Instrumental" },
  { value: "classical", label: "Classical" },
  { value: "ambient", label: "Ambient & Atmospheric" },
  { value: "experimental", label: "Experimental" },
  { value: "vocal", label: "Vocal / Lyrical" },
  { value: "world", label: "World & Folk" },
  { value: "meditation", label: "Meditation & Healing" },
  { value: "cinematic", label: "Cinematic Scores" },
  { value: "spiritual", label: "Spiritual & Devotional" },
  { value: "rock", label: "Rock & Alternative" },
  { value: "jazz", label: "Jazz & Blues" },
  { value: "electronic", label: "Electronic & EDM" },
  { value: "hiphop", label: "Hip-Hop & R&B" },
  { value: "indie", label: "Indie & Singer-Songwriter" },
  { value: "lofi", label: "Lo-Fi & Chill" },
  { value: "fusion", label: "Fusion & Cross-genre" },
];

const movieStyles = [
  { value: "cinematic", label: "Cinematic Art Films" },
  { value: "independent", label: "Independent Cinema" },
  { value: "drama", label: "Drama" },
  { value: "philosophy", label: "Philosophical Films" },
  { value: "documentary", label: "Documentary" },
  { value: "animation", label: "Animation & Anime" },
  { value: "world", label: "World Cinema" },
  { value: "festival", label: "Festival Favorites" },
  { value: "thriller", label: "Thriller & Suspense" },
  { value: "comedy", label: "Comedy" },
  { value: "romance", label: "Romance" },
  { value: "scifi", label: "Sci-Fi & Fantasy" },
  { value: "horror", label: "Horror & Dark" },
  { value: "action", label: "Action & Adventure" },
  { value: "historical", label: "Historical & Period" },
];

const personalityTraits = [
  { value: "introvert", label: "Introverted" },
  { value: "extrovert", label: "Extroverted" },
  { value: "ambivert", label: "Ambivert" },
  { value: "intuitive", label: "Intuitive" },
  { value: "observant", label: "Observant" },
  { value: "thinking", label: "Thinking" },
  { value: "feeling", label: "Feeling" },
  { value: "judging", label: "Judging" },
  { value: "prospecting", label: "Prospecting" },
  { value: "assertive", label: "Assertive" },
  { value: "turbulent", label: "Turbulent" },
];

const alignments = [
  { value: "chaotic-good", label: "Chaotic Good" },
  { value: "lawful-neutral", label: "Lawful Neutral" },
  { value: "true-neutral", label: "True Neutral" },
  { value: "minimalist", label: "Minimalist" },
  { value: "maximalist", label: "Maximalist" },
  { value: "traditionalist", label: "Traditionalist" },
  { value: "progressive", label: "Progressive" },
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
  { value: "mexico", label: "Mexico" },
  { value: "south-korea", label: "South Korea" },
  { value: "italy", label: "Italy" },
  { value: "spain", label: "Spain" },
  { value: "nigeria", label: "Nigeria" },
  { value: "south-africa", label: "South Africa" },
  { value: "other", label: "Other" },
];

export function ProfileWizard({ category, onComplete, onBack }: ProfileWizardProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    age: "",
    gender: "",
    city: "",
    region: "",
    country: "",
    activity: [],
    mood: [],
    bookGenre: [],
    musicType: [],
    movieStyle: [],
    personalityTraits: [],
    alignments: [],
  });

  const totalSteps = 4;

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const strToArr = (str: string | string[]) => Array.isArray(str) ? str : [str];

  const canProceed = () => {
    if (step === 1) {
      return profile.age && profile.gender;
    }
    if (step === 2) {
      return profile.city && profile.country;
    }
    if (step === 3) {
      // Traits and Alignments are optional but recommended.
      // Let's enforce at least one trait for better recommendations.
      return profile.personalityTraits.length > 0;
    }
    if (step === 4) {
      // At least one activity and preference
      if (category === "books") return profile.activity.length > 0 && profile.bookGenre.length > 0;
      if (category === "music") return profile.activity.length > 0 && profile.musicType.length > 0;
      if (category === "movies") return profile.activity.length > 0 && profile.movieStyle.length > 0;
    }
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const getCategoryPreference = () => {
    if (category === "books") {
      return (
        <div className="space-y-3">
          <Label className="text-foreground">Book Genre Preference</Label>
          <MultiSelectDropdown
            options={bookGenres}
            selected={profile.bookGenre}
            onChange={(v) => updateProfile("bookGenre", v)}
            placeholder="Select genres..."
          />
        </div>
      );
    }
    if (category === "music") {
      return (
        <div className="space-y-3">
          <Label className="text-foreground">Music Type Preference</Label>
          <MultiSelectDropdown
            options={musicTypes}
            selected={profile.musicType}
            onChange={(v) => updateProfile("musicType", v)}
            placeholder="Select types..."
          />
        </div>
      );
    }
    return (
      <div className="space-y-3">
        <Label className="text-foreground">Film Style Preference</Label>
        <MultiSelectDropdown
          options={movieStyles}
          selected={profile.movieStyle}
          onChange={(v) => updateProfile("movieStyle", v)}
          placeholder="Select styles..."
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <span className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-lg">
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground">This helps us understand your perspective</p>
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">Age</Label>
              <Input
                type="number"
                placeholder="Enter your age"
                value={profile.age}
                onChange={(e) => updateProfile("age", e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">Gender</Label>
              <Select value={profile.gender} onValueChange={(v) => updateProfile("gender", v)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Where are you from?</h2>
              <p className="text-muted-foreground">Cultural context shapes meaningful recommendations</p>
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">City</Label>
              <Input
                placeholder="Enter your city"
                value={profile.city}
                onChange={(e) => updateProfile("city", e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">Region / State</Label>
              <Input
                placeholder="Enter your region"
                value={profile.region}
                onChange={(e) => updateProfile("region", e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">Country</Label>
              <Select value={profile.country} onValueChange={(v) => updateProfile("country", v)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Personality & Alignment</h2>
              <p className="text-muted-foreground">Deeper insights for better matches</p>
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">Personality Traits</Label>
              <MultiSelectDropdown
                options={personalityTraits}
                selected={profile.personalityTraits}
                onChange={(v) => updateProfile("personalityTraits", v)}
                placeholder="Select traits..."
              />
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">Alignments</Label>
              <MultiSelectDropdown
                options={alignments}
                selected={profile.alignments}
                onChange={(v) => updateProfile("alignments", v)}
                placeholder="Select alignments..."
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Your preferences</h2>
              <p className="text-muted-foreground">Help us find what resonates with you</p>
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">Current Activity / Intent</Label>
              <MultiSelectDropdown
                options={activities}
                selected={profile.activity}
                onChange={(v) => updateProfile("activity", v)}
                placeholder="Select activities..."
              />
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">Current Mood (Optional)</Label>
              <MultiSelectDropdown
                options={moods}
                selected={profile.mood}
                onChange={(v) => updateProfile("mood", v)}
                placeholder="Select moods..."
              />
            </div>
            {getCategoryPreference()}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "gap-2 px-6",
              canProceed() && "gradient-primary hover:opacity-90"
            )}
          >
            {step === totalSteps ? (
              <>
                <Sparkles className="h-4 w-4" />
                Get Recommendations
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
