import { useAuth } from "@/contexts/Auth";
import { supabase } from "@/integrations/supabase/client";

export interface LogDetails {
    itemId: string;
    itemType: "book" | "movie" | "music";
    itemTitle?: string;
    templateId?: string;
    context?: string[]; // e.g., ["gym", "workout"]
}

export const useConsumptionLog = () => {
    const { user } = useAuth();

    const logInteraction = async (details: LogDetails) => {
        if (!user) return;

        try {
            const { error } = await supabase.from("consumption_events").insert({
                user_id: user.id,
                item_id: details.itemId,
                item_type: details.itemType,
                item_title: details.itemTitle,
                template_id: details.templateId || null,
                context: details.context || null,
            });

            if (error) {
                console.error("Error logging consumption event:", error);
            } else {
                console.log("Logged interaction:", details);
            }
        } catch (err) {
            console.error("Unexpected error logging event:", err);
        }
    };

    return { logInteraction };
};
