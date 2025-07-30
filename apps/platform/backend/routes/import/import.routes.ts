import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Import"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const importJSON = createRoute({
	path: "/api/import/json",
	summary: "Import JSON",
	description:
		"Import entries or goals from a JSON file. Either pass the file or a URL.",
	method: "post",
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: z.object({
						file: z.any().optional().openapi({
							type: "string",
							format: "binary",
							description: "The file to upload",
						}),
						url: z.url().optional().openapi({
							description: "The URL to import from",
						}),
					}),
				},
			},
		},
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			createMessageObjectSchema("OK"),
			"Imported",
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

export type ImportJSONRoute = typeof importJSON;
