import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced training data with music examples from PDF
const trainingExamples = `
# TRAINING DATA FOR CULTURALLY-AWARE RECOMMENDATIONS

## RANKING ALGORITHM (Apply to all recommendations):
- Cultural Proximity (30%): Prefer regional creators, local authors, culturally resonant content
- Cognitive Value (30%): Intellectual nourishment, consciousness expansion potential
- Activity Relevance (25%): Match to user's current intent/state of mind
- Popularity (15%): General acclaim considered but not prioritized

## DIVERSITY RULES:
- Never recommend the same author/creator twice in one set
- 2 recommendations MUST be from user's region/country
- 3 recommendations from worldwide (different continents/cultures)
- Mix classic and contemporary works
- Provide unique, personalized AI explanation for each recommendation

## BOOK TRAINING EXAMPLES:

### Young Readers (Ages 9-14):
Input: 11, Female, Mumbai, Maharashtra, India, Reading, Comics
Books: "The Adventures of Tintin" by Hergé (International comic with universal appeal), "Amar Chitra Katha: Tales of Shivaji" (Indian historical comics), "The Phantom" by Lee Falk (Classic adventure), "Golpo 101" by Satyajit Ray (Bengali stories), "Malgudi Days" by R.K. Narayan (Accessible Indian classic)

Input: 13, Male, Austin, Texas, USA, Study, Fantasy
Books: "Percy Jackson and the Olympians" by Rick Riordan (Modern mythology), "Harry Potter and the Sorcerer's Stone" by J.K. Rowling (Gateway fantasy), "The Girl Who Drank the Moon" by Kelly Barnhill (Award-winning), "Aru Shah and the End of Time" by Roshani Chokshi (Indian mythology), "The Chronicles of Narnia" by C.S. Lewis (Classic fantasy)

### Teenagers & Young Adults (Ages 15-22):
Input: 19, Male, Chennai, Tamil Nadu, India, Study, Philosophy
Books: "The Alchemist" by Paulo Coelho (Accessible philosophical fiction), "Siddhartha" by Hermann Hesse (Eastern philosophy), "The Prophet" by Kahlil Gibran (Poetic philosophy), "Autobiography of a Yogi" by Paramahansa Yogananda (Indian spiritual classic), "Meditations" by Marcus Aurelius (Stoic philosophy)

### Young Professionals (Ages 23-35):
Input: 28, Female, Bangalore, Karnataka, India, Work, Self-help
Books: "Atomic Habits" by James Clear (Practical habit formation), "Deep Work" by Cal Newport (Focus and productivity), "The 7 Habits of Highly Effective People" by Stephen Covey, "Mindset" by Carol Dweck (Growth mindset), "Range" by David Epstein (Generalist approach)

### Meditation & Spirituality:
Input: 40, Male, Rishikesh, Uttarakhand, India, Meditation, Spirituality
Books: "Autobiography of a Yogi" by Paramahansa Yogananda, "The Power of Now" by Eckhart Tolle, "Be Here Now" by Ram Dass, "The Tibetan Book of Living and Dying" by Sogyal Rinpoche, "The Heart of the Buddha's Teaching" by Thich Nhat Hanh

## MOVIE TRAINING EXAMPLES:

### Indian Cinema:
Input: 26, Male, Kolkata, West Bengal, India, Relaxation, Drama
Movies: "Pather Panchali" (1955, Satyajit Ray - foundational Indian cinema), "Court" (2014, Venice award winner), "The Lunchbox" (2013, Mumbai romance), "Masaan" (2015, Varanasi drama), "Super Deluxe" (2019, Tamil experimental)

### Japanese Cinema:
Input: 29, Female, Osaka, Kansai, Japan, Study, Cinematic
Movies: "Tokyo Story" (1953, Yasujirō Ozu), "Spirited Away" (2001, Studio Ghibli), "Shoplifters" (2018, Palme d'Or), "Rashomon" (1950, Kurosawa), "Drive My Car" (2021, Oscar winner)

### European Cinema:
Input: 34, Male, Berlin, Berlin, Germany, Creative Work, Independent
Movies: "The Lives of Others" (2006, German Oscar winner), "Amélie" (2001, French whimsical), "Cinema Paradiso" (1988, Italian classic), "The Seventh Seal" (1957, Swedish Bergman), "Pan's Labyrinth" (2006, Spanish magical realism)

## MUSIC TRAINING EXAMPLES (COMPREHENSIVE):

### Spiritual & Meditation Music:
- "Gayatri Mantra, Radical Devotion" by Sri Mooji - Sacred chant for deep meditation
- "Light of your Grace (Beloved Mooji Baba)" - Devotional offering
- "Mose & Sam Garrett - Live at SonidosdelLago in Mexico" - Live meditative performance
- "I Choose to Live in Love" by Lakshmi - Heart-centered devotional
- "MAMA" by Sam Garrett & Mollie Mendoza - Earth-mother invocation
- "Ajeet Kaur - Kiss the Earth (La Luna) [Live in Amsterdam]" - Kundalini yoga music
- "Ajeet Kaur - Peace [Official Music Video]" - Peaceful meditation
- "Ra Ma Da Sa Healing" - Sikh healing mantra
- "Ajeet - Breathe (I Am Free) [Live Performance]" - Breath-centered music
- "Peia - Machi from Four Great Winds" - Indigenous-inspired medicine music
- "ANILAH - Medicine Chant (Official Music Video)" - Shamanic healing sounds
- "Hibernate by Woven Kin - Full Album" - Nature-inspired ambient
- "Mama Deva Deva by Jahnavi Harrison" - MantraLive devotional
- "Kabir by Abida Parveen" - Sufi mystical poetry
- "Sakal Hans Mein Raam Viraaje by Nanak Das" - Sikh devotional
- "Oh Heart, Are You Man Or Woman by Parvathy Baul & Shabnam Virmani" - Bengali folk spiritual
- "Byron Metcalf - Heart Warriors" - Shamanic drumming
- "Maha Mrityunjaya Mantra by Sound Of Rudra" - Powerful Sanskrit mantra
- "NESSI GOMES - Dream Ride" - Contemporary spiritual

### Ambient & Healing:
- "The Song of the Butterfly - Channeling medicine music" - Ambient healing
- "ESTAS TONNE - INTERNAL FLIGHT [FULL ALBUM]" - Neo-classical guitar journey
- "Sierra Eagleson" channel - Modern spiritual songwriter
- "Adharam Madhuram (Slow + Reverb) | Krishna Bhajan" - Lo-fi devotional

### Classic Rock & Folk:
- "Bryan Adams" - Classic rock ballads
- "Patti Smith performs Bob Dylan's A Hard Rain's A-Gonna Fall" - Nobel Prize 2016
- "Joan Baez - 500 Miles" - American folk classic
- "Joan Baez - Diamonds and Rust" - Poetic folk
- "Led Zeppelin" - Classic rock legends
- "Pink Floyd" - Progressive rock
- "Metallica" - Heavy metal masters
- "Deep Purple" - Hard rock pioneers
- "King Crimson" - Progressive rock innovators

### World & Fusion:
- "Zakir Hussain and Dave Holland: Crosscurrents" - Jazz fusion with tabla
- "John McLaughlin & Shakti - Joy (Live Montreux 1976)" - Indian jazz fusion

### Indian Regional:
- "Bhalo Lage - Moheener Ghoraguli" - Bengali rock band classic
- "Tomaye Dilam" - Bengali romantic
- "Cactus - Sei Je Halud Pakhi" - Bengali band songs
- "Sound Scapes - Music of the Mountains | Pandit Shivkumar Sharma" - Santoor maestro
- "John Denver" - Folk/country (international)
- "The Beatles" - British rock legends

## EXPLANATION TEMPLATES:
- "Recommended because you're in [city] and prefer [genre] — [author/creator] shares your cultural context and [specific resonance]"
- "Matches your [activity] needs through [specific feature that aids the activity]"
- "Similar to your preference for [user preference] but with [unique aspect that expands horizons]"
- "A [regional] classic that resonates with [cultural background] and offers [cognitive value]"
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, category, searchQuery, count = 10 } = await req.json();
    
    console.log("Generating recommendations for:", { userProfile, category, searchQuery, count });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const isSearchMode = !!searchQuery;
    const resultCount = Math.min(count, 50); // Cap at 50 for performance

    const systemPrompt = `You are a culturally-aware recommendation system that provides conscious, meaningful recommendations for books, movies, and music. Your goal is to help users become more intelligent consumers by prioritizing:

1. Cultural Proximity (30%): Regional creators, local authors, culturally resonant content
2. Cognitive Value (30%): Intellectual nourishment, consciousness expansion
3. Activity Relevance (25%): Match to user's current intent and state of mind
4. Popularity (15%): General acclaim, but not prioritized

${trainingExamples}

CRITICAL RULES:
- Never recommend the same author/creator twice in one set
${isSearchMode ? '- When in SEARCH MODE, return ONLY results matching the search query - ignore regional/worldwide distribution rules' : '- For regular recommendations: 30% from user\'s region/country (isRegional: true), 70% from worldwide (isRegional: false)'}
- Mix classic and contemporary works
- Provide a unique, personalized AI explanation for each recommendation
- Calculate a match score (70-98%) based on how well each item matches the user's profile
- Always respond with valid JSON only, no markdown formatting

PLATFORM LINKS - Generate REAL, WORKING URLs (no JustWatch):

FOR BOOKS:
- Amazon: https://www.amazon.com/s?k={encoded_title+author}
- Audible: https://www.audible.com/search?keywords={encoded_title}
- Google Play Books: https://play.google.com/store/search?q={encoded_title}&c=books
- Kobo: https://www.kobo.com/search?query={encoded_title}
- Goodreads: https://www.goodreads.com/search?q={encoded_title}
- For India: Flipkart: https://www.flipkart.com/search?q={encoded_title}

FOR MOVIES:
- IMDb: https://www.imdb.com/find?q={encoded_title}
- Rotten Tomatoes: https://www.rottentomatoes.com/search?search={encoded_title}
- YouTube: https://www.youtube.com/results?search_query={encoded_title}+{encoded_director}+full+movie (ALWAYS include director name for better results)
- Prime Video: https://www.amazon.com/s?k={encoded_title}&i=instant-video
- Apple TV: https://tv.apple.com/search?term={encoded_title}
- For India: Hotstar: https://www.hotstar.com/in/search?q={encoded_title}
- For India: JioCinema: https://www.jiocinema.com/search/{encoded_title}
- Netflix: https://www.netflix.com/search?q={encoded_title}

FOR MUSIC:
- YouTube: https://www.youtube.com/results?search_query={encoded_title+artist}
- Spotify: https://open.spotify.com/search/{encoded_title+artist}
- Apple Music: https://music.apple.com/search?term={encoded_title}
- YouTube Music: https://music.youtube.com/search?q={encoded_title+artist}
- SoundCloud: https://soundcloud.com/search?q={encoded_title+artist}
- Bandcamp: https://bandcamp.com/search?q={encoded_title}
- For India: Gaana: https://gaana.com/search/{encoded_title}
- For India: JioSaavn: https://www.jiosaavn.com/search/{encoded_title}`;

    const categoryPreference = category === 'books' 
      ? userProfile.bookGenre 
      : category === 'music' 
        ? userProfile.musicType 
        : userProfile.movieStyle;

    let userPrompt = '';
    
    if (searchQuery) {
      // Search mode - return only relevant results matching the query
      userPrompt = `Search for ${category} matching: "${searchQuery}"
      
User is from ${userProfile.city}, ${userProfile.country}. Activity: ${userProfile.activity}

IMPORTANT: Return ONLY results that match the search query "${searchQuery}". Do NOT apply regional/worldwide distribution rules.
Focus on relevance to the search term - find the best matches from anywhere in the world.

Return ONLY a JSON array with ${resultCount} ${category} recommendations matching the search query in this format (no markdown, no code blocks):
[
  {
    "id": "unique-id-1",
    "title": "Title",
    "creator": "Creator name",
    "year": "Year or null",
    "origin": "Country or region of origin",
    "isRegional": false,
    "aiReason": "Why this matches the search query and user's context",
    "tags": ["tag1", "tag2", "tag3"],
    "score": 85,
    "platforms": [
      {"name": "Platform", "url": "https://platform.com/search?q=encoded_title", "type": "primary"}
    ]
  }
]

Include 4-6 relevant platform links for each recommendation. Use URL-encoded titles/names.
For music, ALWAYS include YouTube and SoundCloud links.
For movies, include YouTube/Hotstar/JioCinema for Indian content.`;
    } else {
      // Regular recommendation mode with regional/worldwide distribution
      const regionalCount = Math.round(resultCount * 0.3);
      const worldwideCount = resultCount - regionalCount;
      
      userPrompt = `Generate ${resultCount} ${category} recommendations for this user:

User Profile:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- City: ${userProfile.city}
- Region: ${userProfile.region || 'Not specified'}
- Country: ${userProfile.country}
- Current Activity: ${userProfile.activity}
- ${category === 'books' ? 'Genre Preference' : category === 'music' ? 'Music Type' : 'Film Style'}: ${categoryPreference}

CRITICAL DISTRIBUTION:
- ${regionalCount} recommendations MUST be from ${userProfile.country} or the user's region (isRegional: true)
- ${worldwideCount} recommendations MUST be from worldwide/other cultures (isRegional: false)
- Mix classic and contemporary works
- Ensure variety in creators - no duplicate authors/artists/directors

Return ONLY a JSON array with exactly ${resultCount} recommendations in this format (no markdown, no code blocks):
[
  {
    "id": "unique-id-1",
    "title": "Title of the work",
    "creator": "Author/Artist/Director name",
    "year": "Year if applicable or null",
    "origin": "Country or region of origin",
    "isRegional": true/false,
    "aiReason": "Personalized explanation of why this is recommended based on the user's profile, location, and preferences. Be specific about cultural resonance.",
    "tags": ["tag1", "tag2", "tag3"],
    "score": 85,
    "platforms": [
      {"name": "Platform Name", "url": "https://platform-url.com/search?q=title", "type": "primary"},
      {"name": "Platform 2", "url": "https://platform2.com/search?q=title", "type": "secondary"}
    ]
  }
]

Include 4-6 relevant platform links for each recommendation. Use URL-encoded titles/names.
For music, ALWAYS include YouTube and SoundCloud links when available.
For movies from India, include Hotstar/JioCinema. For others include YouTube/Netflix/Prime.`;
    }

    console.log("Calling AI gateway...");
    
    // Use a reasonable timeout and slightly lower token budget for faster, consistent responses
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        // temperature tuned for a balance between creativity and reliability
        temperature: 0.6,
        // limit tokens to reduce latency and cost while still allowing detailed JSON
        max_tokens: 3000,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response - handle potential markdown code blocks and truncated JSON
    let recommendations;
    try {
      // Remove potential markdown code blocks
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      // Try to parse directly first
      try {
        recommendations = JSON.parse(cleanContent);
      } catch (e) {
        // If parsing fails, try to extract valid JSON array
        // Find the last complete object in the array
        const lastCompleteIndex = cleanContent.lastIndexOf('}');
        if (lastCompleteIndex > 0) {
          let truncatedContent = cleanContent.substring(0, lastCompleteIndex + 1);
          // Close the array if needed
          if (!truncatedContent.trim().endsWith(']')) {
            truncatedContent = truncatedContent + ']';
          }
          recommendations = JSON.parse(truncatedContent);
          console.log("Recovered partial JSON with", recommendations.length, "items");
        } else {
          throw e;
        }
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content.substring(0, 500) + "...");
      throw new Error("Failed to parse recommendations");
    }

    // Post-process to fix URL encoding issues and normalize recommendations
    recommendations = recommendations.map((rec: any, idx: number) => {
      if (rec.platforms && Array.isArray(rec.platforms)) {
        rec.platforms = rec.platforms.map((platform: any) => {
          if (platform.url) {
            try {
              // Parse the URL to get the query parameters
              const url = new URL(platform.url);
              // Re-encode any improperly encoded query parameters
              url.searchParams.forEach((value, key) => {
                url.searchParams.set(key, value);
              });
              platform.url = url.toString();
            } catch (e) {
              // If URL parsing fails, try basic encoding fix
              // Replace spaces with + or %20
              platform.url = platform.url.replace(/ /g, '+');
            }
          }
          return platform;
        });
      }
      // Ensure each recommendation has an id
      if (!rec.id) {
        try {
          rec.id = crypto.randomUUID();
        } catch (e) {
          rec.id = `rec-${Date.now()}-${idx}`;
        }
      }

      // Clamp scores to the expected 70-98 range
      if (typeof rec.score === 'number') {
        rec.score = Math.max(70, Math.min(98, Math.round(rec.score)));
      } else {
        rec.score = 75; // default if missing or malformed
      }
      return rec;
    });

    console.log("Returning recommendations:", recommendations.length);

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-recommendations function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate recommendations" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
