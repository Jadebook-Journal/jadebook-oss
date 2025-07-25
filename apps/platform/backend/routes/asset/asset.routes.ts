import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
	assetEntityType,
	assetParams,
	assetResponse,
	assetsResponse,
	createAssetBody,
	createAssetResponse,
	deleteAssetBody,
	generateSignedUrlBody,
	getAssetsQuery,
	signedUrlResponse,
	successResponse,
	updateAssetBody,
	uploadResponse,
} from "./asset.validation";

const tags = ["Assets"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getAssets = createRoute({
	path: "/api/assets",
	summary: "Get assets",
	description:
		"Gets a list of assets for the authenticated user. Can be filtered by entity type and entity ID.",
	method: "get",
	request: {
		query: getAssetsQuery,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(assetsResponse, "List of user assets"),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid query parameters",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const getAsset = createRoute({
	path: "/api/assets/{id}",
	summary: "Get asset",
	description: "Gets a single asset by ID",
	method: "get",
	request: {
		params: assetParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(assetResponse, "The requested asset"),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid asset ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Asset not found"),
			"Asset does not exist or access denied",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const createAsset = createRoute({
	path: "/api/assets",
	summary: "Create asset",
	description: "Creates a new asset record in the database",
	method: "post",
	request: {
		body: jsonContent(createAssetBody, "Asset creation data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.CREATED]: jsonContent(
			createAssetResponse,
			"Asset created successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const updateAsset = createRoute({
	path: "/api/assets/{id}",
	summary: "Update asset",
	description: "Updates an asset record. Supports partial updates.",
	method: "put",
	request: {
		params: assetParams,
		body: jsonContent(updateAssetBody, "Asset update data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Asset updated successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Asset not found"),
			"Asset does not exist or access denied",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const deleteAsset = createRoute({
	path: "/api/assets/{id}",
	summary: "Delete asset",
	description: "Deletes an asset from both storage and database",
	method: "delete",
	request: {
		params: assetParams,
		body: jsonContent(deleteAssetBody, "Asset deletion data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Asset deleted successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Asset not found"),
			"Asset does not exist or access denied",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const generateSignedUrl = createRoute({
	path: "/api/assets/signed-url",
	summary: "Generate signed URL",
	description: "Generates a signed URL for accessing a file in storage",
	method: "post",
	request: {
		body: jsonContent(generateSignedUrlBody, "Signed URL generation data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			signedUrlResponse,
			"Signed URL generated successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const uploadFile = createRoute({
	path: "/api/assets/upload",
	summary: "Upload file",
	description: "Uploads a file to storage and creates an asset record",
	method: "post",
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: z.object({
						file: z.any().openapi({
							type: "string",
							format: "binary",
							description: "The file to upload",
						}),
						entity_type: assetEntityType.openapi({
							example: "document",
							description: "Type of entity this file belongs to",
						}),
						entity_id: z.string().openapi({
							example: "550e8400-e29b-41d4-a716-446655440000",
							description: "ID of the entity this file belongs to",
						}),
					}),
				},
			},
		},
	},
	tags,
	responses: {
		[HttpStatusCodes.CREATED]: jsonContent(
			uploadResponse,
			"File uploaded successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data or missing file",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

// Export route types
export type GetAssetsRoute = typeof getAssets;
export type GetAssetRoute = typeof getAsset;
export type CreateAssetRoute = typeof createAsset;
export type UpdateAssetRoute = typeof updateAsset;
export type DeleteAssetRoute = typeof deleteAsset;
export type GenerateSignedUrlRoute = typeof generateSignedUrl;
export type UploadFileRoute = typeof uploadFile;
