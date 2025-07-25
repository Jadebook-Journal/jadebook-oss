import { Scalar } from "@scalar/hono-api-reference";
import type { AppOpenAPI } from "./types";
import { defaultUrl } from "@/lib/utils";

export default function configureOpenAPI(app: AppOpenAPI) {
	app.doc("api/doc", {
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Jadebook OSS API",
		},
	});

	app.get(
		"api/reference",
		Scalar({
			url: `${defaultUrl}/api/doc`,
			theme: "fastify",
			layout: "modern",
			defaultHttpClient: {
				targetKey: "js",
				clientKey: "fetch",
			},
			hideModels: false,
			metaData: {
				title: "Jadebook OSS API Reference",
				description:
					"Jadebook OSS API Reference — Provides a comprehensive API reference for the Jadebook OSS platform.",
			},
			authentication: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
			servers: [
				{
					url: `${defaultUrl}`,
					description: "Local server",
				},
			],
			persistAuth: true,
		}),
	);
}
