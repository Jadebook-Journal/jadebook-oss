import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
	createTagBody,
	createTagResponse,
	deleteTagParams,
	getGoalsByTagParams,
	getGoalsByTagQuery,
	getTagParams,
	getTagsQuery,
	goalsByTagResponse,
	successResponse,
	tagResponse,
	tagsResponse,
	updateTagBody,
	updateTagParams,
} from "./tag.validation";

const tags = ["Tags"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getTags = createRoute({
	path: "/api/tags",
	summary: "Get tags",
	description: "Gets a list of all tags for the authenticated user",
	method: "get",
	request: {
		query: getTagsQuery,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(tagsResponse, "List of user tags"),
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

export const getTag = createRoute({
	path: "/api/tags/{id}",
	summary: "Get tag",
	description: "Gets a single tag by ID",
	method: "get",
	request: {
		params: getTagParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(tagResponse, "The requested tag"),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid tag ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Tag not found"),
			"Tag does not exist or access denied",
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

export const createTag = createRoute({
	path: "/api/tags",
	summary: "Create tag",
	description: "Creates a new tag for the authenticated user",
	method: "post",
	request: {
		body: jsonContent(createTagBody, "Tag creation data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.CREATED]: jsonContent(
			createTagResponse,
			"Tag created successfully",
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

export const updateTag = createRoute({
	path: "/api/tags/{id}",
	summary: "Update tag",
	description: "Updates a tag with partial updates",
	method: "put",
	request: {
		params: updateTagParams,
		body: jsonContent(updateTagBody, "Tag update data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Tag updated successfully",
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
			createMessageObjectSchema("Tag not found"),
			"Tag does not exist or access denied",
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

export const deleteTag = createRoute({
	path: "/api/tags/{id}",
	summary: "Delete tag",
	description: "Permanently deletes a tag from the database",
	method: "delete",
	request: {
		params: deleteTagParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Tag deleted successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid tag ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Tag not found"),
			"Tag does not exist or access denied",
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

export const getGoalsByTag = createRoute({
	path: "/api/tags/{id}/goals",
	summary: "Get goals by tag",
	description: "Gets goals associated with a specific tag",
	method: "get",
	request: {
		params: getGoalsByTagParams,
		query: getGoalsByTagQuery,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			goalsByTagResponse,
			"List of goals associated with the tag",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid tag ID or query parameters",
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

export type GetTagsRoute = typeof getTags;
export type GetTagRoute = typeof getTag;
export type CreateTagRoute = typeof createTag;
export type UpdateTagRoute = typeof updateTag;
export type DeleteTagRoute = typeof deleteTag;
export type GetGoalsByTagRoute = typeof getGoalsByTag;
