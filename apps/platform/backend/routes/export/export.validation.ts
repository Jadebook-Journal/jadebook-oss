import { z } from "@hono/zod-openapi";
import { logTypeEnum } from "../logs/logs.validation";

export const selectExportsResponse = z.array(
	z.object({
		id: z.string(),
		created_at: z.string(),
		expire_at: z.string(),
		user_id: z.string(),
		start_date: z.string(),
		end_date: z.string(),
		type: z.string().openapi({
			description: "The type of resource to export",
			enum: ["entries", "goals"],
		}),
	}),
);

export const createExportBody = z
	.object({
		type: z.string(),
		start_date: z.string(),
		end_date: z.string(),
		expire_at: z.string(),
	})
	.openapi({
		description: "Create an export",
	});

export const getUserExportParams = z.object({
	id: z.string(),
});

export const getUserExportQuery = z.object({
	download: z
		.string()
		.optional()
		.openapi({
			description: "Set to 'true' to trigger file download",
			enum: ["true"],
		}),
});

export const selectExportResponse = z.object({
	generated_at: z.string().openapi({
		description: "The date and time the export was generated",
	}),
	platform: z.string().openapi({
		description: "The platform that generated the export",
	}),
	type: z.enum(["entries", "goals"]).openapi({
		description: "The type of resource that was exported",
	}),
	entries: z
		.array(
			z.object({
				id: z.string(),
				title: z.string(),
				content: z.string().nullable(),
				created_at: z.string(),
				updated_at: z.string(),
				entry_date: z.string(),
				icon: z.string().nullable(),
				cover: z.string().nullable(),
				type: z.enum(["entry", "prompted"]).openapi({
					description: "The type of entry",
				}),
			}),
		)
		.nullable(),
	goals: z
		.array(
			z.object({
				id: z.string(),
				title: z.string(),
				description: z.string().nullable(),
				created_at: z.string(),
				updated_at: z.string(),
				icon: z.string().nullable(),
				cover: z.string().nullable(),
				logs: z.array(
					z.object({
						created_at: z.string(),
						type: z.enum(logTypeEnum).openapi({
							description: "The type of log",
						}),
						content: z.string().nullable(),
					}),
				),
			}),
		)
		.nullable(),
});
