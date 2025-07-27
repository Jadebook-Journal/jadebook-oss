import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { searchResponse, searchQueryParams } from "./search.validation";

const tags = ["Search"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getSearchJadebook = createRoute({
	path: "/api/search",
	summary: "Search Jadebook",
	description:
		"Returns entries, goals, and logs that match the search term. This is entirely based on Full-Text Search.",
	method: "get",
	tags,
	request: {
		query: searchQueryParams,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(searchResponse, "Search results"),
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

export type GetSearchJadebookRoute = typeof getSearchJadebook;
