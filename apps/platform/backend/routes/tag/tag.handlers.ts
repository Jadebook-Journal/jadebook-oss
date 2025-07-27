import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type {
	createTagResponse,
	goalsByTagResponse,
	successResponse,
	tagResponse,
	tagsResponse,
} from "./tag.validation";
import type {
	CreateTagRoute,
	DeleteTagRoute,
	GetGoalsByTagRoute,
	GetTagRoute,
	GetTagsRoute,
	UpdateTagRoute,
} from "./tag.routes";
import type { AppRouteHandler } from "@backend/types";

export const getTags: AppRouteHandler<GetTagsRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");

	try {
		const { data, error } = await supabase
			.from("tag")
			.select("*")
			.match({
				user_id: userId,
			})
			.order("created_at", { ascending: false });

		if (error) {
			console.error(error);

			return c.json(
				{
					message: "Failed to fetch tags",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		if (!data) {
			return c.json([], HttpStatusCodes.OK);
		}

		const response: z.infer<typeof tagsResponse> = data;

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

export const getTag: AppRouteHandler<GetTagRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");

	try {
		const { data, error } = await supabase
			.from("tag")
			.select("*")
			.match({
				user_id: userId,
				id,
			})
			.single();

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{
						message: "Tag not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to fetch tag",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof tagResponse> = data;

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

export const createTag: AppRouteHandler<CreateTagRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const body = c.req.valid("json");

	try {
		const { data, error } = await supabase
			.from("tag")
			.insert({
				label: body.label,
				variant: body.variant,
				color: body.color,
				icon: body.icon,
				user_id: userId,
			})
			.select("id")
			.single();

		if (error) {
			console.error(error);
			return c.json(
				{
					message: "Failed to create tag",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof createTagResponse> = {
			id: data.id,
		};

		return c.json(response, HttpStatusCodes.CREATED);
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

export const updateTag: AppRouteHandler<UpdateTagRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	try {
		// Build update object with only provided fields
		const updateData: Record<string, unknown> = {};

		if (body.label !== undefined) updateData.label = body.label;
		if (body.variant !== undefined) updateData.variant = body.variant;
		if (body.color !== undefined) updateData.color = body.color;
		if (body.icon !== undefined) updateData.icon = body.icon;
		if (body.cover !== undefined) updateData.cover = body.cover;
		if (body.pinned !== undefined) updateData.pinned = body.pinned;

		const { error } = await supabase.from("tag").update(updateData).match({
			user_id: userId,
			id,
		});

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{
						message: "Tag not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to update tag",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof successResponse> = {
			message: "Tag updated successfully",
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

export const deleteTag: AppRouteHandler<DeleteTagRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");

	try {
		const { error } = await supabase.from("tag").delete().match({
			user_id: userId,
			id,
		});

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{
						message: "Tag not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to delete tag",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof successResponse> = {
			message: "Tag deleted successfully",
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

export const getGoalsByTag: AppRouteHandler<GetGoalsByTagRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");
	const { state } = c.req.valid("query");

	try {
		const { data, error } = await supabase
			.from("goal")
			.select("id, title, created_at, end_date, icon")
			.match({ user_id: userId, state })
			.contains("tags", [id])
			.order("created_at", { ascending: false });

		if (error) {
			console.error(error);

			return c.json(
				{
					message: "Failed to fetch goals",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		if (!data) {
			return c.json([], HttpStatusCodes.OK);
		}

		const response: z.infer<typeof goalsByTagResponse> = data;

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
