import { Database } from "@/lib/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

// Define a type for the user's streak data (adjust based on your table name/columns)
type UserStreakData = {
	current_streak: number;
	longest_streak: number;
	last_entry_date: string | null; // Expecting 'YYYY-MM-DD' format from DB
};

type StreakResult = {
	success: boolean;
	updated: boolean;
	current_streak?: number;
	longest_streak?: number;
	error?: string;
};

/**
 * Calculates and updates the user's journaling streak based on the current date.
 * Called when a journal entry is successfully created.
 */
export async function calculateAndUpdateStreak(
	userId: string,
	supabase: SupabaseClient<Database>,
): Promise<StreakResult> {
	// Use UTC dates to ensure consistency across timezones
	const currentDateUtc = new Date();
	const today = currentDateUtc.toISOString().split("T")[0];

	const yesterdayUtc = new Date(currentDateUtc);
	yesterdayUtc.setUTCDate(currentDateUtc.getUTCDate() - 1);
	const yesterday = yesterdayUtc.toISOString().split("T")[0];

	// Fetch current streak data
	const { data: profile, error: fetchError } = await supabase
		.from("user")
		.select("current_streak, longest_streak, last_entry_date")
		.eq("id", userId)
		.single();

	if (fetchError) {
		return {
			success: false,
			updated: false,
			error: "Failed to fetch user profile",
		};
	}

	if (!profile) {
		return { success: false, updated: false, error: "User profile not found" };
	}

	const { current_streak, longest_streak, last_entry_date } =
		profile as UserStreakData;

	// No update needed if already logged today
	if (last_entry_date === today) {
		return {
			success: true,
			updated: false,
			current_streak,
			longest_streak,
		};
	}

	// Calculate new streak
	const newCurrentStreak =
		last_entry_date === yesterday ? current_streak + 1 : 1;
	const newLongestStreak = Math.max(longest_streak, newCurrentStreak);

	// Update database
	const { error: updateError } = await supabase
		.from("user")
		.update({
			current_streak: newCurrentStreak,
			longest_streak: newLongestStreak,
			last_entry_date: today,
			updated_at: new Date().toISOString(),
		})
		.eq("id", userId);

	if (updateError) {
		return {
			success: false,
			updated: false,
			error: "Failed to update streak data",
		};
	}

	return {
		success: true,
		updated: true,
		current_streak: newCurrentStreak,
		longest_streak: newLongestStreak,
	};
}
