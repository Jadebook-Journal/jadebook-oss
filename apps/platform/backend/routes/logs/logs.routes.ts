import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
	createLogBody,
	createLogResponse,
	getLogsQuery,
	logIdParams,
	logParams,
	logsListResponse,
	successResponse,
	updateLogBody,
} from "./logs.validation";

const tags = ["Logs"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getGoalLogs = createRoute({
	path: "/api/goal/{goalId}/logs",
	method: "get",
	tags,
	summary: "Get paginated logs for a goal",
	description: "Retrieve paginated logs for a specific goal with metadata",
	request: {
		params: logParams,
		query: getLogsQuery,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			logsListResponse,
			"Paginated logs for the goal",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Invalid request parameters"),
			"Invalid request parameters",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Goal not found"),
			"Goal not found",
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

export const createGoalLog = createRoute({
	path: "/api/goal/{goalId}/logs",
	method: "post",
	tags,
	summary: "Create a new log for a goal",
	description: "Create a new log entry for a specific goal",
	request: {
		params: logParams,
		body: jsonContentRequired(createLogBody, "Log creation data"),
	},
	responses: {
		[HttpStatusCodes.CREATED]: jsonContent(
			createLogResponse,
			"Log created successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Invalid request body"),
			"Invalid request body",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Goal not found"),
			"Goal not found",
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

export const updateGoalLog = createRoute({
	path: "/api/goal/{goalId}/logs/{id}",
	method: "put",
	tags,
	summary: "Update a log entry",
	description: "Update an existing log entry for a goal",
	request: {
		params: logIdParams,
		body: jsonContentRequired(updateLogBody, "Log update data"),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Log updated successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Invalid request body"),
			"Invalid request body",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Log not found"),
			"Log not found",
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

export const deleteGoalLog = createRoute({
	path: "/api/goal/{goalId}/logs/{id}",
	method: "delete",
	tags,
	summary: "Delete a log entry",
	description: "Delete an existing log entry for a goal",
	request: {
		params: logIdParams,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Log deleted successfully",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Log not found"),
			"Log not found",
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

export type GetGoalLogsRoute = typeof getGoalLogs;
export type CreateGoalLogRoute = typeof createGoalLog;
export type UpdateGoalLogRoute = typeof updateGoalLog;
export type DeleteGoalLogRoute = typeof deleteGoalLog;
