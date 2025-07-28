import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { selectProfileResponse, updateProfileBody } from "./profile.validation";

const tags = ["Profile"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getUserProfile = createRoute({
	path: "/api/profile",
	summary: "Get profile",
	description: "Gets the user's profile",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			selectProfileResponse,
			"The requested profile",
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

export const updateUserProfile = createRoute({
	path: "/api/profile",
	summary: "Update profile",
	description: "Updates the user's profile",
	method: "put",
	request: {
		body: jsonContent(updateProfileBody, "Profile update data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			createMessageObjectSchema("OK"),
			"Profile updated",
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

export const deleteUserProfile = createRoute({
	path: "/api/profile",
	summary: "Delete profile",
	description: "Deletes the user's profile",
	method: "delete",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			createMessageObjectSchema("OK"),
			"Profile deleted",
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

export type GetUserProfileRoute = typeof getUserProfile;
export type UpdateUserProfileRoute = typeof updateUserProfile;
export type DeleteUserProfileRoute = typeof deleteUserProfile;
