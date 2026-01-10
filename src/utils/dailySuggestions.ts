
import { Recommendation } from "@/components/RecommendationCard";

// High-quality, philosophy-aligned content pool
const SUGGESTION_POOL: Partial<Recommendation>[] = [
    {
        id: "daily_1",
        title: "Deep Work",
        creator: "Cal Newport",
        origin: "Book",
        reason: "Essential for mastering focus in a distracted world.",
        tags: ["Productivity", "Focus"],
        isRegional: false,
    },
    {
        id: "daily_2",
        title: "Man's Search for Meaning",
        creator: "Viktor Frankl",
        origin: "Book",
        reason: "A profound testament to the power of perspective and resilience.",
        tags: ["Philosophy", "Resilience"],
        isRegional: false,
    },
    {
        id: "daily_3",
        title: "Samsara",
        creator: "Ron Fricke",
        origin: "Film",
        reason: "A non-verbal guided meditation on the cycle of life.",
        tags: ["Documentary", "Visuals"],
        isRegional: false,
    },
    {
        id: "daily_4",
        title: "Weightless",
        creator: "Marconi Union",
        origin: "Music",
        reason: "Scientifically designed to reduce anxiety and blood pressure.",
        tags: ["Ambient", "Relaxation"],
        isRegional: false,
    },
    {
        id: "daily_5",
        title: "Atomic Habits",
        creator: "James Clear",
        origin: "Book",
        reason: "Small changes lead to remarkable results over time.",
        tags: ["Habits", "Growth"],
        isRegional: false,
    },
    {
        id: "daily_6",
        title: "My Neighbor Totoro",
        creator: "Hayao Miyazaki",
        origin: "Film",
        reason: "Reconnect with childlike wonder and nature's spirit.",
        tags: ["Animation", "Nature"],
        isRegional: true,
    },
    {
        id: "daily_7",
        title: "The Daily Stoic",
        creator: "Ryan Holiday",
        origin: "Book",
        reason: "Ancient wisdom for modern emotional regulation.",
        tags: ["Stoicism", "Philosophy"],
        isRegional: false,
    },
    {
        id: "daily_8",
        title: "Experience",
        creator: "Ludovico Einaudi",
        origin: "Music",
        reason: "Emotional catharsis through minimal piano composition.",
        tags: ["Classical", "Emotion"],
        isRegional: false,
    },
    {
        id: "daily_9",
        title: "Baraka",
        creator: "Ron Fricke",
        origin: "Film",
        reason: "A visual poem connecting human culture and nature.",
        tags: ["Documentary", "Culture"],
        isRegional: false,
    },
    {
        id: "daily_10",
        title: "Thinking, Fast and Slow",
        creator: "Daniel Kahneman",
        origin: "Book",
        reason: "Understand the two systems that drive the way we think.",
        tags: ["Psychology", "Cognition"],
        isRegional: false,
    }
];

// Simple seeded random function
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export const getDailySuggestions = (date: Date): Partial<Recommendation>[] => {
    // Create a seed based on the date string (YYYY-MM-DD)
    // This ensures the same items are selected for everyone on the same day
    // You could mix in userID to make it personalized but stable per user
    const dateString = date.toISOString().split('T')[0]; // 2023-10-27
    const seedString = dateString.replace(/-/g, '');
    const baseSeed = parseInt(seedString, 10);

    // Pick 2 items deterministically
    const poolSize = SUGGESTION_POOL.length;

    const index1 = Math.floor(seededRandom(baseSeed) * poolSize);
    const index2 = Math.floor(seededRandom(baseSeed + 1) * poolSize);

    // Ensure unique items
    const item1 = SUGGESTION_POOL[index1];
    let item2 = SUGGESTION_POOL[index2];

    if (item1.id === item2.id) {
        item2 = SUGGESTION_POOL[(index2 + 1) % poolSize];
    }

    return [item1, item2];
};
