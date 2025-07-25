import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
	createEntryBody,
	createEntryResponse,
	deleteEntryParams,
	entryMetadataResponse,
	entryResponse,
	entriesResponse,
	getEntryParams,
	getEntriesQuery,
	successResponse,
	updateEntryBody,
	updateEntryParams,
} from "./entry.validation";

const tags = ["Entries"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getEntries = createRoute({
	path: "/api/entries",
	summary: "Get entries",
	description:
		"Gets a list of entries with pagination. Can be filtered by type, date, and tag id.",
	method: "get",
	request: {
		query: getEntriesQuery,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			entriesResponse,
			"List of user entries with pagination",
		),
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

export const getEntry = createRoute({
	path: "/api/entries/{id}",
	summary: "Get entry",
	description:
		"Gets a single entry by ID — Search Vector will not be returned. Will also return deleted entries.",
	method: "get",
	request: {
		params: getEntryParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(entryResponse, "The requested entry"),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid entry ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Entry not found"),
			"Entry does not exist or access denied",
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

export const getEntryMetadata = createRoute({
	path: "/api/entries/{id}/metadata",
	summary: "Get entry metadata",
	description: "Gets only the title and excerpt of an entry by ID",
	method: "get",
	request: {
		params: getEntryParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			entryMetadataResponse,
			"The requested entry metadata",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid entry ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Entry not found"),
			"Entry does not exist or access denied",
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

export const createEntry = createRoute({
	path: "/api/entries",
	summary: "Create entry",
	description: "Creates a new entry",
	method: "post",
	request: {
		body: jsonContent(createEntryBody, "Entry creation data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.CREATED]: jsonContent(
			createEntryResponse,
			"Entry created successfully",
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

export const updateEntry = createRoute({
	path: "/api/entries/{id}",
	summary: "Update entry",
	description:
		"Updates an entry — internally handles embeddings and text extraction from the editor content. Notes are not supported since they will be deprecated.",
	method: "put",
	request: {
		params: updateEntryParams,
		body: jsonContent(updateEntryBody, "Entry update data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Entry updated successfully",
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
			createMessageObjectSchema("Entry not found"),
			"Entry does not exist or access denied",
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

export const deleteEntry = createRoute({
	path: "/api/entries/{id}",
	summary: "Delete entry",
	description: "Deletes an entry",
	method: "delete",
	request: {
		params: deleteEntryParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Entry deleted successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid entry ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Entry not found"),
			"Entry does not exist or access denied",
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

export type GetEntriesRoute = typeof getEntries;
export type GetEntryRoute = typeof getEntry;
export type GetEntryMetadataRoute = typeof getEntryMetadata;
export type CreateEntryRoute = typeof createEntry;
export type UpdateEntryRoute = typeof updateEntry;
export type DeleteEntryRoute = typeof deleteEntry;
