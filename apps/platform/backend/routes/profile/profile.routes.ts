import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Profile"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getUserProfile = createRoute({
	path: "/profile",
	summary: "Get profile",
	description: "Gets the user's profile",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			z.object({
				created_at: z.string(),
				current_streak: z.number(),
				id: z.string(),
				last_entry_date: z.string().nullable(),
				longest_streak: z.number(),
				profile_image: z.string().nullable(),
				theme: z.string().nullable(),
				updated_at: z.string(),
				username: z.string().nullable(),
			}),
			"The requested profile",
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

export const updateUserProfile = createRoute({
	path: "/profile",
	summary: "Update profile",
	description: "Updates the user's profile",
	method: "put",
	request: {
		body: jsonContent(
			z.object({
				user_id: z.string(),
				username: z.string(),
				email: z.string(),
				profile_image: z.string(),
				created_at: z.string(),
			}),
			"Profile update data",
		),
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

export type GetUserProfileRoute = typeof getUserProfile;
export type UpdateUserProfileRoute = typeof updateUserProfile;
