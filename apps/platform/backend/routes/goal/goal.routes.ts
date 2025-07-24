import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
	createGoalBody,
	createGoalResponse,
	deleteGoalParams,
	getGoalParams,
	getGoalsQuery,
	goalResponse,
	goalsResponse,
	successResponse,
	updateGoalBody,
	updateGoalParams,
} from "./goal.validation";

const tags = ["Goals"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getGoals = createRoute({
	path: "/api/goals",
	summary: "Get goals",
	description:
		"Gets a list of goals filtered by state. Returns active goals by default, with a limit of 5 for active goals and 50 for archived goals.",
	method: "get",
	request: {
		query: getGoalsQuery,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			goalsResponse,
			"List of user goals filtered by state",
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

export const getGoal = createRoute({
	path: "/api/goals/{id}",
	summary: "Get goal",
	description:
		"Gets a single goal by ID with all details including encrypted fields decrypted",
	method: "get",
	request: {
		params: getGoalParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			goalResponse,
			"The requested goal with full details",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid goal ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Goal not found"),
			"Goal does not exist or access denied",
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

export const createGoal = createRoute({
	path: "/api/goals",
	summary: "Create goal",
	description: "Creates a new goal with encrypted sensitive fields",
	method: "post",
	request: {
		body: jsonContent(createGoalBody, "Goal creation data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.CREATED]: jsonContent(
			createGoalResponse,
			"Goal created successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data or end date validation failed",
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

export const updateGoal = createRoute({
	path: "/api/goals/{id}",
	summary: "Update goal",
	description:
		"Updates a goal with partial updates and encrypted sensitive fields",
	method: "put",
	request: {
		params: updateGoalParams,
		body: jsonContent(updateGoalBody, "Goal update data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Goal updated successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data or end date validation failed",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Goal not found"),
			"Goal does not exist or access denied",
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

export const deleteGoal = createRoute({
	path: "/api/goals/{id}",
	summary: "Delete goal",
	description: "Permanently deletes a goal from the database",
	method: "delete",
	request: {
		params: deleteGoalParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Goal deleted successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid goal ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Goal not found"),
			"Goal does not exist or access denied",
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

export type GetGoalsRoute = typeof getGoals;
export type GetGoalRoute = typeof getGoal;
export type CreateGoalRoute = typeof createGoal;
export type UpdateGoalRoute = typeof updateGoal;
export type DeleteGoalRoute = typeof deleteGoal;
