import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type { AppRouteHandler } from "@backend/types";
import type {
	createGoalResponse,
	goalResponse,
	goalsResponse,
} from "./goal.validation";
import type {
	CreateGoalRoute,
	DeleteGoalRoute,
	GetGoalRoute,
	GetGoalsRoute,
	UpdateGoalRoute,
} from "./goal.routes";

export const getGoals: AppRouteHandler<GetGoalsRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { state } = c.req.valid("query");

	try {
		const { data, error } = await supabase
			.from("goal")
			.select("*")
			.match({ user_id: userId, state })
			.limit(state === "active" ? 5 : 50);

		if (error) {
			console.error(error);

			return c.json(
				{ message: "Failed to fetch goals" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		if (!data) {
			return c.json([], HttpStatusCodes.OK);
		}

		const response: z.infer<typeof goalsResponse> = data;

		return c.json(response, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};

export const getGoal: AppRouteHandler<GetGoalRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");

	try {
		const { data, error } = await supabase
			.from("goal")
			.select("*")
			.match({
				user_id: userId,
				id,
			})
			.single();

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json({ message: "Goal not found" }, HttpStatusCodes.NOT_FOUND);
			}

			return c.json(
				{ message: "Failed to fetch goal" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof goalResponse> = data;

		return c.json(response, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};

export const createGoal: AppRouteHandler<CreateGoalRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const body = c.req.valid("json");

	try {
		// Validate end date is in the future
		const endDate = new Date(body.end_date);
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (endDate.getTime() <= tomorrow.getTime()) {
			return c.json(
				{
					message: "End date must be at least 1 day into the future",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		const { data, error } = await supabase
			.from("goal")
			.insert({
				...body,
				icon: body.icon || null,
				end_date: body.end_date,
				tags: body.tags || null,
				pinned: body.pinned ?? false,
				user_id: userId,
			})
			.select("id")
			.single();

		if (error) {
			console.error(error);

			return c.json(
				{ message: "Failed to create goal" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof createGoalResponse> = {
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

export const updateGoal: AppRouteHandler<UpdateGoalRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	try {
		// Validate end date is in the future if provided
		if (body.end_date) {
			const endDate = new Date(body.end_date);
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);

			if (endDate.getTime() <= tomorrow.getTime()) {
				return c.json(
					{
						message: "End date must be at least 1 day into the future",
					},
					HttpStatusCodes.BAD_REQUEST,
				);
			}
		}

		const updateData = body;

		const { error } = await supabase
			.from("goal")
			.update({
				...updateData,
				updated_at: new Date().toISOString(),
			})
			.match({
				user_id: userId,
				id,
			});

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{
						message: "Goal not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to update goal",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		return c.json({ message: "Goal updated successfully" }, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};

export const deleteGoal: AppRouteHandler<DeleteGoalRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");

	try {
		const { error } = await supabase.from("goal").delete().match({
			user_id: userId,
			id,
		});

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{
						message: "Goal not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{ message: "Failed to delete goal" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		return c.json({ message: "Goal deleted successfully" }, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
