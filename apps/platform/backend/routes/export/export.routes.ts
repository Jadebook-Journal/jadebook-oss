import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import {
	createExportBody,
	getUserExportParams,
	getUserExportQuery,
	selectExportResponse,
	selectExportsResponse,
	expireExportBody,
} from "./export.validation";

const tags = ["Export"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getUserExports = createRoute({
	path: "/api/export",
	summary: "Get exports",
	description:
		"Gets the user's exports. Only the latest 10 exports are returned.",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			selectExportsResponse,
			"The requested exports",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),

		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

// the actual route is in the /export/[exportId]/route.ts file
export const getUserExport = createRoute({
	path: "/data-export/{id}",
	summary: "Get export",
	description:
		"Gets a specific export. This will be in a JSON format. Add download=true query parameter to trigger file download. Note that this is not in the backend, it needs to be accessible to the public and thus, is a separate route.",
	method: "get",
	tags,
	request: {
		params: getUserExportParams,
		query: getUserExportQuery,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			selectExportResponse,
			"The requested export",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),

		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const createUserExport = createRoute({
	path: "/api/export",
	summary: "Create export",
	description: "Creates a new export",
	method: "post",
	request: {
		body: jsonContent(createExportBody, "Export data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			createMessageObjectSchema("OK"),
			"Export created",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const expireUserExport = createRoute({
	path: "/api/export/{id}",
	summary: "Expire export",
	description: "Expire an existing export",
	method: "put",
	request: {
		params: getUserExportParams,
		body: jsonContent(expireExportBody, "Export data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			createMessageObjectSchema("OK"),
			"Export updated",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export type GetUserExportsRoute = typeof getUserExports;
export type GetUserExportRoute = typeof getUserExport;
export type CreateUserExportRoute = typeof createUserExport;
export type ExpireUserExportRoute = typeof expireUserExport;
