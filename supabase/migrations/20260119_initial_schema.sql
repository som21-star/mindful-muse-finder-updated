-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    age TEXT,
    gender TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    activity TEXT[],
    mood TEXT[],
    book_genre TEXT[],
    music_type TEXT[],
    movie_style TEXT[],
    personality_traits TEXT[],
    alignments TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    item_title TEXT,
    item_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create consumption_events table
CREATE TABLE IF NOT EXISTS public.consumption_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    item_title TEXT,
    template_id TEXT,
    context TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_country ON public.user_profiles(country);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_item_type ON public.favorites(item_type);
CREATE INDEX IF NOT EXISTS idx_consumption_events_user_id ON public.consumption_events(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consumption_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
    ON public.user_profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
    ON public.user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
    ON public.user_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create RLS policies for favorites
CREATE POLICY "Users can view their own favorites" 
    ON public.favorites FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
    ON public.favorites FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
    ON public.favorites FOR DELETE 
    USING (auth.uid() = user_id);

-- Create RLS policies for consumption_events
CREATE POLICY "Users can view their own consumption events" 
    ON public.consumption_events FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consumption events" 
    ON public.consumption_events FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
