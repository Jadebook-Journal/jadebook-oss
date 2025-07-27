import { z } from "@hono/zod-openapi";

export const searchEntryResponse = z.object({
	id: z.string(),
	title: z.string(),
	excerpt: z.string().nullable(),
	icon: z.string().nullable(),
	tags: z.array(z.string()).nullable(),
	updated_at: z.string(),
});

export const searchGoalResponse = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	icon: z.string().nullable(),
	tags: z.array(z.string()).nullable(),
	updated_at: z.string(),
});

export const searchLogResponse = z.object({
	id: z.string(),
	goal_id: z.string().nullable(),
	goal_title: z.string().nullable(),
	content: z.string().nullable(),
	updated_at: z.string(),
});

export const searchResponse = z.object({
	entries: z.array(searchEntryResponse),
	goals: z.array(searchGoalResponse),
	logs: z.array(searchLogResponse),
	hasErrors: z.boolean(),
});

export const searchQueryParams = z.object({
	searchTerm: z.string(),
});
