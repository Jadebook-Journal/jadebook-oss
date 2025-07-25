import { z } from "@hono/zod-openapi";

// Pinned document response schema
export const pinnedDocumentResponse = z.object({
	id: z.string(),
	title: z.string(),
	pinned: z.boolean(),
	type: z.string(),
	icon: z.string().nullable(),
});

export const pinnedGoalResponse = z.object({
	id: z.string(),
	title: z.string(),
	pinned: z.boolean(),
	icon: z.string().nullable(),
});

// Pinned resources response schema
export const pinnedResourcesResponse = z.object({
	entries: z.array(pinnedDocumentResponse),
	goals: z.array(pinnedGoalResponse),
});
