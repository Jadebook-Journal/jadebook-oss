import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { pinnedResourcesResponse } from "./misc.validation";

const tags = ["Misc"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getPinnedResources = createRoute({
	path: "/api/misc/pinned",
	summary: "Get pinned resources",
	description:
		"Returns pinned resources including entries and goals. This is mainly meant for the sidebar.",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			pinnedResourcesResponse,
			"Pinned resources",
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

export type GetPinnedResourcesRoute = typeof getPinnedResources;
