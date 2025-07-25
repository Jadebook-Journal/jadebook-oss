import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type { AppRouteHandler } from "@backend/types";
import type { pinnedResourcesResponse } from "./misc.validation";
import type { GetPinnedResourcesRoute } from "./misc.routes";

export const getPinnedResources: AppRouteHandler<
	GetPinnedResourcesRoute
> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");

	try {
		const [documentsResult, goalsResult] = await Promise.all([
			supabase
				.from("entry")
				.select("id, title, pinned, type, icon")
				.match({
					user_id: userId,
					pinned: true,
				})
				.order("title", { ascending: false }),
			supabase
				.from("goal")
				.select("id, title, pinned, icon")
				.match({
					user_id: userId,
					pinned: true,
				})
				.order("title", { ascending: false }),
		]);

		const { data, error } = documentsResult;

		if (error) {
			console.error(error);

			return c.json(
				{
					message: "Failed to fetch pinned resources",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const { data: goals, error: goalsError } = goalsResult;

		if (goalsError) {
			console.error(goalsError);
		}

		const response: z.infer<typeof pinnedResourcesResponse> = {
			entries: data || [],
			goals: goals || [],
		};

		return c.json(response, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{
				message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
