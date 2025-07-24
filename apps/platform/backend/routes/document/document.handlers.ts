import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type { AppRouteHandler } from "@backend/types";
import type {
	createDocumentResponse,
	documentMetadataResponse,
	documentResponse,
	documentsResponse,
	successResponse,
} from "./document.validation";
import type {
	CreateDocumentRoute,
	DeleteDocumentRoute,
	GetDocumentMetadataRoute,
	GetDocumentRoute,
	GetDocumentsRoute,
	UpdateDocumentRoute,
} from "./document.routes";
import { calculateAndUpdateStreak } from "@backend/calculate-streak";

const PAGE_SIZE = 12;

export const getDocuments: AppRouteHandler<GetDocumentsRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { page, tagId, type, dateType } = c.req.valid("query");

	const pageNumber = Number(page);

	try {
		let query = supabase
			.from("entry")
			.select(
				"id, title, created_at, updated_at, entry_date, tags, excerpt, pinned, icon, type",
				{ count: "exact", head: false },
			)
			.match({ user_id: userId })
			.order(dateType || "updated_at", { ascending: false })
			.range(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE - 1);

		if (tagId) {
			query = query.contains("tags", [tagId]);
		}

		if (type && type !== "all") {
			query = query.eq("type", type);
		}

		const { data, error, count } = await query;

		if (error) {
			console.error(error);

			return c.json(
				{
					message: "Failed to fetch documents",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof documentsResponse> = {
			data: data || [],
			meta: {
				totalCount: count || 0,
				totalPages: Math.ceil((count || 0) / PAGE_SIZE),
				currentPage: pageNumber,
				hasNextPage: pageNumber < Math.ceil((count || 0) / PAGE_SIZE) - 1,
			},
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

export const getDocument: AppRouteHandler<GetDocumentRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");

	try {
		const { data, error } = await supabase
			.from("entry")
			.select("*")
			.match({
				user_id: userId,
				id: id,
			})
			.single();

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{
						message: "Document not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to fetch document",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof documentResponse> = data;

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

export const getDocumentMetadata: AppRouteHandler<
	GetDocumentMetadataRoute
> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");

	try {
		const { data, error } = await supabase
			.from("entry")
			.select("title, excerpt")
			.match({
				user_id: userId,
				id: id,
			})
			.single();

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{
						message: "Document not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to fetch document metadata",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof documentMetadataResponse> = data;

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

export const createDocument: AppRouteHandler<CreateDocumentRoute> = async (
	c,
) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const body = c.req.valid("json");

	try {
		const { data, error } = await supabase
			.from("entry")
			.insert({
				...body,
				updated_at: new Date().toISOString(),
				user_id: userId,
			})
			.select("id")
			.single();

		if (error) {
			console.error(error);

			return c.json(
				{
					message: "Failed to create document",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		// Update user's streak
		try {
			await calculateAndUpdateStreak(userId, supabase);
		} catch (streakError) {
			console.warn(streakError);
			// Don't fail the request if streak update fails
		}

		const response: z.infer<typeof createDocumentResponse> = {
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

export const updateDocument: AppRouteHandler<UpdateDocumentRoute> = async (
	c,
) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	try {
		const hasDataToUpdate = Object.keys(body).length > 0;

		if (!hasDataToUpdate) {
			console.warn("No data provided for update");

			return c.json(
				{ message: "No data provided for update" },
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		const { error } = await supabase.from("entry").update(body).match({
			user_id: userId,
			id: id,
		});

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{ message: "Document not found" },
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{ message: "Failed to update document in database" },
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof successResponse> = {
			message: "Document updated successfully",
		};

		return c.json(response, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{
				message: "An unexpected error occurred while updating the document",
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};

export const deleteDocument: AppRouteHandler<DeleteDocumentRoute> = async (
	c,
) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");

	try {
		const { error } = await supabase.from("entry").delete().match({
			user_id: userId,
			id: id,
		});

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{
						message: "Document not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to purge document",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof successResponse> = {
			message: "Document purged successfully",
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
