import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { promptsResponse } from "./prompts.validation";

const tags = ["Prompts"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getPrompts = createRoute({
	path: "/api/prompts",
	summary: "Get writing prompts",
	description:
		"Gets 3 writing prompts. The prompts will always be static since we don't have AI. These prompts are hard-coded.",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(promptsResponse, "Selected prompts"),
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

export type GetPromptsRoute = typeof getPrompts;
