
export interface RecommendationItem {
    id: string;
    title: string;
    creator: string; // Author, Director, or Artist
    type: "book" | "movie" | "music";
    description?: string;
    tags?: string[];
    link?: string;
    imageUrl?: string; // Optional cover image
}

export interface TemplateItem {
    id: string;
    title: string;
    description: string;
    activityId: string; // matches the 'value' in activities list
    recommendations: RecommendationItem[];
}

export interface ActivityCategory {
    id: string;
    label: string;
    description: string;
    gradient: string;
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
    {
        id: "study",
        label: "Study & Focus",
        description: "Deep work, learning, and concentration",
        gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
        id: "gym",
        label: "Gym & Workout",
        description: "High energy, motivation, and power",
        gradient: "from-red-500/20 to-orange-500/20"
    },
    {
        id: "travel",
        label: "Travel & Commute",
        description: "Discovery, immersion, and passage of time",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        id: "meditation",
        label: "Meditation & Peace",
        description: "Mindfulness, calm, and inner silence",
        gradient: "from-indigo-500/20 to-violet-500/20"
    },
    {
        id: "party",
        label: "Party & Social",
        description: "Upbeat, connection, and celebration",
        gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
        id: "creative",
        label: "Creative Flow",
        description: "Inspiration, divergent thinking, and art",
        gradient: "from-amber-500/20 to-yellow-500/20"
    },
    {
        id: "healing",
        label: "Healing & Rest",
        description: "Recovery, comfort, and soothing",
        gradient: "from-teal-500/20 to-cyan-500/20"
    }
];

export const ACTIVITY_TEMPLATES: TemplateItem[] = [
    // --- STUDY ---
    {
        id: "study-deep-focus",
        title: "Deep Focus Protocol",
        description: "Minimalist soundscapes and thought-provoking reads for sustained attention.",
        activityId: "study",
        recommendations: [
            {
                id: "m-study-1",
                title: "Music for Airports",
                creator: "Brian Eno",
                type: "music",
                tags: ["Ambient", "Instrumental"],
            },
            {
                id: "b-study-1",
                title: "Deep Work",
                creator: "Cal Newport",
                type: "book",
                tags: ["Productivity", "Non-fiction"],
            }
        ]
    },
    {
        id: "study-philosophy",
        title: "Philosophical Inquiry",
        description: " Classical music and fundamental texts for heavy cerebral lifting.",
        activityId: "study",
        recommendations: [
            {
                id: "m-study-2",
                title: "Goldberg Variations",
                creator: "J.S. Bach",
                type: "music",
                tags: ["Classical", "Baroque"],
            },
            {
                id: "b-study-2",
                title: "Meditations",
                creator: "Marcus Aurelius",
                type: "book",
                tags: ["Philosophy", "Stoicism"],
            }
        ]
    },
    {
        id: "study-lofi-flow",
        title: "Lo-Fi Flow State",
        description: "Relaxed beats and engaging lighter reads for creative study sessions.",
        activityId: "study",
        recommendations: [
            {
                id: "m-study-3",
                title: "Lofi Girl - Study Beats",
                creator: "Lofi Records",
                type: "music",
                tags: ["Lofi", "Chill"],
            },
            {
                id: "b-study-3",
                title: "Atomic Habits",
                creator: "James Clear",
                type: "book",
                tags: ["Self-help", "Psychology"],
            }
        ]
    },

    // --- GYM ---
    {
        id: "gym-high-intensity",
        title: "High Intensity Shred",
        description: "Aggressive beats and high-octane visuals for maximum output.",
        activityId: "gym",
        recommendations: [
            {
                id: "m-gym-1",
                title: "Yeezus",
                creator: "Kanye West",
                type: "music",
                tags: ["Hip Hop", "Industrial"],
            },
            {
                id: "f-gym-1",
                title: "Pumping Iron",
                creator: "George Butler",
                type: "movie",
                tags: ["Documentary", "Bodybuilding"],
            }
        ]
    },
    {
        id: "gym-endurance",
        title: "Endurance Runner",
        description: "Steady rhythms and inspiring stories of human limits.",
        activityId: "gym",
        recommendations: [
            {
                id: "b-gym-1",
                title: "Born to Run",
                creator: "Christopher McDougall",
                type: "book",
                tags: ["Non-fiction", "Running"],
            },
            {
                id: "m-gym-2",
                title: "Discovery",
                creator: "Daft Punk",
                type: "music",
                tags: ["Electronic", "House"],
            }
        ]
    },
    {
        id: "gym-power",
        title: "Powerlifting Heavy",
        description: "Heavy metal and intense focus for max lifts.",
        activityId: "gym",
        recommendations: [
            {
                id: "m-gym-3",
                title: "Master of Puppets",
                creator: "Metallica",
                type: "music",
                tags: ["Metal", "Thrash"],
            },
            {
                id: "f-gym-2",
                title: "Rocky IV",
                creator: "Sylvester Stallone",
                type: "movie",
                tags: ["Action", "Sports"],
            }
        ]
    },

    // --- TRAVELLING ---
    {
        id: "travel-roadtrip",
        title: "Classic Road Trip",
        description: "Sing-along anthems and stories of adventure.",
        activityId: "travel",
        recommendations: [
            {
                id: "b-travel-1",
                title: "On the Road",
                creator: "Jack Kerouac",
                type: "book",
                tags: ["Fiction", "Beat Generation"],
            },
            {
                id: "m-travel-1",
                title: "Rumours",
                creator: "Fleetwood Mac",
                type: "music",
                tags: ["Rock", "Classic Rock"],
            }
        ]
    },
    {
        id: "travel-flight",
        title: "Long Haul Flight",
        description: "Immersive worlds to make the hours disappear.",
        activityId: "travel",
        recommendations: [
            {
                id: "f-travel-1",
                title: "Lost in Translation",
                creator: "Sofia Coppola",
                type: "movie",
                tags: ["Drama", "Indie"],
            },
            {
                id: "b-travel-2",
                title: "Dune",
                creator: "Frank Herbert",
                type: "book",
                tags: ["Sci-Fi", "Epic"],
            }
        ]
    },
    {
        id: "travel-train",
        title: "Scenic Train Ride",
        description: "Reflective and atmospheric companions for window gazing.",
        activityId: "travel",
        recommendations: [
            {
                id: "m-travel-2",
                title: "Illinois",
                creator: "Sufjan Stevens",
                type: "music",
                tags: ["Indie Folk", "Baroque Pop"],
            },
            {
                id: "f-travel-2",
                title: "Before Sunrise",
                creator: "Richard Linklater",
                type: "movie",
                tags: ["Romance", "Drama"],
            }
        ]
    },

    // --- MEDITATION ---
    {
        id: "meditation-mindfulness",
        title: "Mindfulness Basics",
        description: "Guides to the present moment.",
        activityId: "meditation",
        recommendations: [
            {
                id: "b-med-1",
                title: "The Power of Now",
                creator: "Eckhart Tolle",
                type: "book",
                tags: ["Spirituality", "Self-help"],
            },
            {
                id: "m-med-1",
                title: "Weightless",
                creator: "Marconi Union",
                type: "music",
                tags: ["Ambient", "Relaxation"],
            }
        ]
    },
    {
        id: "meditation-zen",
        title: "Zen Gardens",
        description: "Minimalist aesthetics for emptying the mind.",
        activityId: "meditation",
        recommendations: [
            {
                id: "b-med-2",
                title: "Zen Mind, Beginner's Mind",
                creator: "Shunryu Suzuki",
                type: "book",
                tags: ["Buddhism", "Philosophy"],
            },
            {
                id: "m-med-2",
                title: "Music for Zen Meditation",
                creator: "Tony Scott",
                type: "music",
                tags: ["Jazz", "World"],
            }
        ]
    },

    // --- HEALING ---
    {
        id: "healing-comfort",
        title: "Comfort & Warmth",
        description: "Gentle stories and sounds for difficult days.",
        activityId: "healing",
        recommendations: [
            {
                id: "f-heal-1",
                title: "My Neighbor Totoro",
                creator: "Hayao Miyazaki",
                type: "movie",
                tags: ["Animation", "Feel-good"],
            },
            {
                id: "m-heal-1",
                title: "Carrie & Lowell",
                creator: "Sufjan Stevens",
                type: "music",
                tags: ["Folk", "Indie"],
            }
        ]
    },

    // --- PARTY ---
    {
        id: "party-house",
        title: "House Party Vibes",
        description: "Groovy beats to get people moving.",
        activityId: "party",
        recommendations: [
            {
                id: "m-party-1",
                title: "Random Access Memories",
                creator: "Daft Punk",
                type: "music",
                tags: ["Disco", "Funk"],
            },
            {
                id: "f-party-1",
                title: "Superbad",
                creator: "Greg Mottola",
                type: "movie",
                tags: ["Comedy", "Teen"],
            }
        ]
    },

    // --- CREATIVE ---
    {
        id: "creative-spark",
        title: "Spark of Genius",
        description: "Works that break boundaries and ignite imagination.",
        activityId: "creative",
        recommendations: [
            {
                id: "b-creat-1",
                title: "Steal Like an Artist",
                creator: "Austin Kleon",
                type: "book",
                tags: ["Creativity", "Art"],
            },
            {
                id: "f-creat-1",
                title: "Everything Everywhere All At Once",
                creator: "Daniels",
                type: "movie",
                tags: ["Sci-Fi", "Absurdist"],
            }
        ]
    }

];
