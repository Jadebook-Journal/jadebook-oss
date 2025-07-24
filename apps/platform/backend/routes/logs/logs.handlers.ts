import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type {
	createLogResponse,
	logsListResponse,
	successResponse,
} from "./logs.validation";
import type {
	CreateGoalLogRoute,
	DeleteGoalLogRoute,
	GetGoalLogsRoute,
	UpdateGoalLogRoute,
} from "./logs.routes";
import type { AppRouteHandler } from "@backend/types";

const PAGE_SIZE = 5; // Fetch 5 logs per page

export const getGoalLogs: AppRouteHandler<GetGoalLogsRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { goalId } = c.req.valid("param");
	const { page } = c.req.valid("query");

	const pageNumber = parseInt(page);

	try {
		const { data, error, count } = await supabase
			.from("log")
			.select("*", { count: "exact", head: false })
			.match({ user_id: userId, goal_id: goalId })
			.order("created_at", { ascending: false })
			.range(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE - 1);

		if (error) {
			console.error(error);

			return c.json(
				{ message: "Failed to fetch logs" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
		const hasNextPage = pageNumber < totalPages - 1;

		const response: z.infer<typeof logsListResponse> = {
			data: data || [],
			meta: {
				totalCount: count || 0,
				totalPages,
				currentPage: pageNumber,
				hasNextPage,
			},
		};

		return c.json(response, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};

export const createGoalLog: AppRouteHandler<CreateGoalLogRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { goalId } = c.req.valid("param");
	const body = c.req.valid("json");

	try {
		const { data, error } = await supabase
			.from("log")
			.insert({
				...body,
				goal_id: goalId,
				user_id: userId,
				type: body.type || "neutral",
				updated_at: new Date().toISOString(),
			})
			.select("id")
			.single();

		if (error) {
			console.error(error);

			return c.json(
				{ message: "Failed to create log" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof createLogResponse> = {
			id: data.id,
		};

		return c.json(response, HttpStatusCodes.CREATED);
	} catch (error) {
		console.error(error);

		return c.json(
			{ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};

export const updateGoalLog: AppRouteHandler<UpdateGoalLogRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	try {
		const { error } = await supabase
			.from("log")
			.update({
				...body,
				updated_at: new Date().toISOString(),
			})
			.match({
				id,
				user_id: userId,
			});

		if (error) {
			console.error(error);

			return c.json(
				{ message: "Failed to update log" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof successResponse> = {
			message: "Log updated successfully",
		};

		return c.json(response, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};

export const deleteGoalLog: AppRouteHandler<DeleteGoalLogRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { goalId, id } = c.req.valid("param");

	try {
		// First verify the log exists and belongs to the user
		const { error: logError } = await supabase
			.from("log")
			.select("id")
			.match({ user_id: userId, goal_id: goalId, id })
			.single();

		if (logError) {
			console.error(logError);

			if (logError.code === "PGRST116") {
				return c.json({ message: "Log not found" }, HttpStatusCodes.NOT_FOUND);
			}

			return c.json(
				{ message: "Failed to verify log" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const { error } = await supabase.from("log").delete().match({
			id,
			user_id: userId,
		});

		if (error) {
			console.error(error);

			return c.json(
				{ message: "Failed to delete log" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof successResponse> = {
			message: "Log deleted successfully",
		};

		return c.json(response, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
