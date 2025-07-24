import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { createRouter } from "../create-app";

const router = createRouter().openapi(
	createRoute({
		tags: ["Index"],
		summary: "Jadebook OpenAPI Spec",
		description:
			"Get the OpenAPI spec for the Jadebook API. Note, all routes require an authorization header, for which the value can only be accessed on the client.",
		method: "get",
		path: "/api/doc",
		responses: {
			[HttpStatusCodes.OK]: jsonContent(
				createMessageObjectSchema("Jadebook - OpenAPI Spec"),
				"Jadebook - OpenAPI Spec",
			),
		},
	}),
	(c) => {
		return c.json(
			{
				message: "Jadebook - OpenAPI Spec",
			},
			HttpStatusCodes.OK,
		);
	},
);

export default router;
