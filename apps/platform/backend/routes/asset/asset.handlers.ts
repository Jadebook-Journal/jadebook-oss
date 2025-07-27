import { nanoid } from "nanoid";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";

import type { AppRouteHandler } from "../../types";
import {
	assetEntityType,
	type assetResponse,
	type assetsResponse,
	type createAssetResponse,
	type signedUrlResponse,
	type successResponse,
	type uploadResponse,
} from "./asset.validation";

import type {
	CreateAssetRoute,
	DeleteAssetRoute,
	GenerateSignedUrlRoute,
	GetAssetRoute,
	GetAssetsRoute,
	UpdateAssetRoute,
	UploadFileRoute,
} from "./asset.routes";

export const getAssets: AppRouteHandler<GetAssetsRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { entityType, entityId } = c.req.valid("query");

	try {
		let query = supabase
			.from("asset")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		if (entityType) {
			query = query.eq("entity_type", entityType);
		}

		if (entityId) {
			query = query.eq("entity_id", entityId);
		}

		const { data, error } = await query;

		if (error) {
			return c.json(
				{
					message: "Failed to fetch assets",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		// Generate signed URLs for each asset
		const assetsWithSignedUrls = await Promise.all(
			(data || []).map(async (asset) => {
				try {
					const { data: signedUrlData, error: urlError } =
						await supabase.storage
							.from("user-assets")
							.createSignedUrl(asset.path, 3600); // 1 hour expiry

					if (urlError || !signedUrlData?.signedUrl) {
						return {
							...asset,
							signed_url: "",
						};
					}

					return {
						...asset,
						signed_url: signedUrlData.signedUrl,
					};
				} catch (error) {
					console.error(error);

					return {
						...asset,
						signed_url: "",
					};
				}
			}),
		);

		const response: z.infer<typeof assetsResponse> = {
			data: assetsWithSignedUrls,
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

export const getAsset: AppRouteHandler<GetAssetRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");

	try {
		const { data, error } = await supabase
			.from("asset")
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
						message: "Asset not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to fetch asset",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		// Generate signed URL for the asset
		let signedUrl = "";
		try {
			const { data: signedUrlData, error: urlError } = await supabase.storage
				.from("user-assets")
				.createSignedUrl(data.path, 3600); // 1 hour expiry

			if (urlError || !signedUrlData?.signedUrl) {
				return c.json(
					{
						message: "Failed to generate signed URL for asset",
					},
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
				);
			} else {
				signedUrl = signedUrlData.signedUrl;
			}
		} catch (urlError) {
			console.error(urlError);

			return c.json(
				{
					message: "Failed to generate signed URL for asset",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof assetResponse> = {
			...data,
			signed_url: signedUrl,
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

export const createAsset: AppRouteHandler<CreateAssetRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const body = c.req.valid("json");

	try {
		// Perform an upsert operation based on user_id and path to handle duplicates
		const { data, error } = await supabase
			.from("asset")
			.upsert(
				{
					mime_type: body.mime_type,
					size: body.size,
					file_name: body.filename,
					path: body.filepath || "",
					entity_type: body.entity_type,
					entity_id: body.entity_id,
					user_id: userId,
				},
				{
					onConflict: "user_id,path",
					ignoreDuplicates: false,
				},
			)
			.select("id")
			.single();

		if (error) {
			console.error(error);

			return c.json(
				{
					message: "Failed to create asset",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof createAssetResponse> = {
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

export const updateAsset: AppRouteHandler<UpdateAssetRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");
	const body = c.req.valid("json");

	try {
		// Build update object only with provided fields (partial updates)
		const updateData: Record<string, unknown> = {};
		if (body.mime_type !== undefined) updateData.mime_type = body.mime_type;
		if (body.size !== undefined) updateData.size = body.size;
		if (body.filename !== undefined) updateData.file_name = body.filename;
		if (body.filepath !== undefined) updateData.path = body.filepath || "";
		if (body.entity_type !== undefined)
			updateData.entity_type = body.entity_type;
		if (body.entity_id !== undefined) updateData.entity_id = body.entity_id;

		// If no fields to update, return success
		if (Object.keys(updateData).length === 0) {
			return c.json(
				{ message: "Asset updated successfully" },
				HttpStatusCodes.OK,
			);
		}

		const { error } = await supabase.from("asset").update(updateData).match({
			id,
			user_id: userId,
		});

		if (error) {
			console.error(error);

			if (error.code === "PGRST116") {
				return c.json(
					{
						message: "Asset not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to update asset",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof successResponse> = {
			message: "Asset updated successfully",
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

export const deleteAsset: AppRouteHandler<DeleteAssetRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { id } = c.req.valid("param");
	const { path } = c.req.valid("json");

	try {
		// First, delete the file from storage
		const { error: storageError } = await supabase.storage
			.from("user-assets")
			.remove([path]);

		if (storageError) {
			console.error(storageError);

			return c.json(
				{
					message: "Failed to delete asset from storage",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		// Then, delete the asset record from database
		const { error: dbError } = await supabase.from("asset").delete().match({
			id,
			user_id: userId,
		});

		if (dbError) {
			console.error(dbError);

			if (dbError.code === "PGRST116") {
				return c.json(
					{
						message: "Asset not found",
					},
					HttpStatusCodes.NOT_FOUND,
				);
			}

			return c.json(
				{
					message: "Failed to delete asset record",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof successResponse> = {
			message: "Asset deleted successfully",
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

export const generateSignedUrl: AppRouteHandler<
	GenerateSignedUrlRoute
> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const { path, bucket } = c.req.valid("json");

	try {
		const { data: signedUrlData, error } = await supabase.storage
			.from(bucket)
			.createSignedUrl(path, 3600); // 1 hour expiry

		if (error) {
			console.error(error);

			return c.json(
				{
					message: "Failed to generate signed URL",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		if (!signedUrlData?.signedUrl) {
			console.error("Failed to generate signed URL - no URL returned");

			return c.json(
				{
					message: "Failed to generate signed URL",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		const response: z.infer<typeof signedUrlResponse> = {
			signedUrl: signedUrlData.signedUrl,
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

export const uploadFile: AppRouteHandler<UploadFileRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");

	try {
		const body = await c.req.parseBody();
		const file = body.file as File;
		const entityType = body.entity_type as z.infer<typeof assetEntityType>;
		const entityId = body.entity_id as string;

		if (!file) {
			return c.json(
				{
					message: "No file provided",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		if (!entityType || !entityId) {
			return c.json(
				{
					message: "Missing entity_type or entity_id",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		// file names can cause collisions, so we use a unique id but store the original file name in the database
		const unique_id = nanoid(21);

		// Validate entity_type enum
		const validEntityTypes = assetEntityType.safeParse(entityType);

		if (!validEntityTypes.success) {
			return c.json(
				{
					message: "Invalid entity_type",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		// Construct the path using userId, entityId, and unique_id
		const path = `${userId}/${entityId}/${unique_id}`;

		const arrayBuffer = await file.arrayBuffer();

		const fileToUpload = Buffer.from(arrayBuffer);

		// Upload to Supabase storage
		const { error: uploadError } = await supabase.storage
			.from("user-assets")
			.upload(path, fileToUpload, {
				contentType: file.type,
			});

		if (uploadError) {
			console.error(uploadError);

			return c.json(
				{
					message: "Failed to upload file",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		// Create asset record in database
		const { data: assetData, error: assetError } = await supabase
			.from("asset")
			.insert({
				mime_type: file.type,
				size: file.size,
				file_name: file.name,
				path: path,
				entity_type: entityType,
				entity_id: entityId,
				user_id: userId,
			})
			.select("id")
			.single();

		if (assetError) {
			console.error(assetError);

			// Try to clean up the uploaded file
			await supabase.storage.from("user-assets").remove([path]);

			return c.json(
				{
					message: "Failed to create asset record",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		// Generate signed URL for the uploaded file
		let signedUrl = "";

		try {
			const { data: signedUrlData, error: urlError } = await supabase.storage
				.from("user-assets")
				.createSignedUrl(path, 3600); // 1 hour expiry

			if (urlError || !signedUrlData?.signedUrl) {
				console.error(urlError);
			} else {
				signedUrl = signedUrlData.signedUrl;
			}
		} catch (urlError) {
			console.error(urlError);
		}

		const response: z.infer<typeof uploadResponse> = {
			id: assetData.id,
			mime_type: file.type,
			size: file.size,
			file_name: file.name,
			path: path,
			entity_type: entityType as z.infer<typeof assetEntityType>,
			entity_id: entityId,
			signed_url: signedUrl,
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
