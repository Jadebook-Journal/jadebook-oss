import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type { AppRouteHandler } from "@backend/types";
import type {
	searchEntryResponse,
	searchGoalResponse,
	searchLogResponse,
	searchResponse,
} from "./search.validation";
import type { GetSearchJadebookRoute } from "./search.routes";

export const getSearchJadebook: AppRouteHandler<
	GetSearchJadebookRoute
> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const searchTerm = c.req.query("searchTerm");

	try {
		/**
		 * This is super insufficient, however there's a reason for this:
		 *
		 * 1. This doesn't create a function with the database or use additional extensions.
		 * 2. Jadebook OSS is meant for personal use, so we don't need to worry about scaling and performance
		 * 3. This is easier to maintain and understand
		 */
		const [
			entryTitleResult,
			entryContentResult,
			goalTitleResult,
			goalDescriptionResult,
			logResult,
		] = await Promise.all([
			supabase
				.from("entry")
				.select("id, title, excerpt, icon, tags, updated_at")
				.textSearch("title", `'${searchTerm}'`)
				.match({
					user_id: userId,
				})
				.limit(6),
			supabase
				.from("entry")
				.select("id, title, excerpt, icon, tags, updated_at")
				.textSearch("content", `'${searchTerm}'`)
				.match({
					user_id: userId,
				})
				.limit(6),
			supabase
				.from("goal")
				.select("id, title, description, icon, tags, updated_at")
				.textSearch("title", `'${searchTerm}'`)
				.match({
					user_id: userId,
				})
				.limit(6),
			supabase
				.from("goal")
				.select("id, title, description, icon, tags, updated_at")
				.textSearch("description", `'${searchTerm}'`)
				.match({
					user_id: userId,
				})
				.limit(6),
			supabase
				.from("log")
				.select("id, content, goal_id, updated_at")
				.textSearch("content", `'${searchTerm}'`)
				.match({
					user_id: userId,
				})
				.limit(6),
		]);

		let hasErrors = false;

		// Handle entry results
		const entries: z.infer<typeof searchEntryResponse>[] = [];

		if (entryTitleResult.error) {
			console.error("Entry title search error:", entryTitleResult.error);
			hasErrors = true;
		} else {
			entries.push(...(entryTitleResult.data || []));
		}

		if (entryContentResult.error) {
			console.error("Entry content search error:", entryContentResult.error);
			hasErrors = true;
		} else {
			entries.push(...(entryContentResult.data || []));
		}

		// Handle goal results
		const goals: z.infer<typeof searchGoalResponse>[] = [];

		if (goalTitleResult.error) {
			console.error("Goal title search error:", goalTitleResult.error);
			hasErrors = true;
		} else {
			goals.push(...(goalTitleResult.data || []));
		}

		if (goalDescriptionResult.error) {
			console.error(
				"Goal description search error:",
				goalDescriptionResult.error,
			);
			hasErrors = true;
		} else {
			goals.push(...(goalDescriptionResult.data || []));
		}

		// Handle log results
		let logs: z.infer<typeof searchLogResponse>[] = [];

		if (logResult.error) {
			console.error("Log search error:", logResult.error);
			hasErrors = true;
		} else {
			if (logResult.data.length !== 0) {
				const goalIds = new Set(logResult.data?.map((log) => log.goal_id));

				let goal_names: {
					id: string;
					title: string;
				}[] = [];

				console.log("goalIds", goalIds);

				if (goalIds.size > 0) {
					const { data: goalResult, error: goalError } = await supabase
						.from("goal")
						.select("id, title")
						.in("id", Array.from(goalIds))
						.limit(6);

					if (!goalError) {
						goal_names = goalResult;
					} else {
						console.error("Goal search error:", goalError);
					}
				}

				if (goal_names.length > 0) {
					logs = logResult.data.map((log) => ({
						...log,
						goal_title:
							goal_names.find((goal) => goal.id === log.goal_id)?.title ||
							"Untitled Goal",
					}));
				}
			}
		}

		// Remove duplicates from entries and goals based on id
		const uniqueEntries = entries.filter(
			(entry, index, self) =>
				index === self.findIndex((e) => e.id === entry.id),
		);

		const uniqueGoals = goals.filter(
			(goal, index, self) => index === self.findIndex((g) => g.id === goal.id),
		);

		const response: z.infer<typeof searchResponse> = {
			entries: uniqueEntries,
			goals: uniqueGoals,
			logs,
			hasErrors,
		};

		return c.json(response, HttpStatusCodes.OK);
	} catch (error) {
		console.error("Search handler error:", error);

		return c.json(
			{
				message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
