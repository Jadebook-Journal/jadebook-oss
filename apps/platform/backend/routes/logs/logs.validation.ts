import { z } from "@hono/zod-openapi";

// Query parameters for getting logs
export const getLogsQuery = z.object({
	page: z.string().default("0").openapi({
		example: "0",
		description: "Page number for pagination (0-based)",
	}),
});

// Path parameters for logs routes
export const logParams = z.object({
	goalId: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The goal ID",
	}),
});

export const logIdParams = z.object({
	goalId: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The goal ID",
	}),
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440001",
		description: "The log ID",
	}),
});

// Create log body
export const createLogBody = z.object({
	content: z.string().min(1).openapi({
		example:
			"Today I practiced Spanish vocabulary for 30 minutes. I learned 10 new words and reviewed 20 old ones.",
		description: "The content of the log entry",
	}),
	type: z.enum(["neutral", "good", "bad"]).optional().openapi({
		example: "good",
		description: "Type for the log entry (neutral, good, bad)",
	}),
});

// Update log body
export const updateLogBody = z.object({
	content: z.string().min(1).optional().openapi({
		example:
			"Today I practiced Spanish vocabulary for 45 minutes. Made great progress!",
		description: "The updated content of the log entry",
	}),
	type: z.enum(["neutral", "good", "bad"]).optional().openapi({
		example: "good",
		description: "Updated type for the log entry (neutral, good, bad)",
	}),
});

// Response schemas
export const logResponse = z.object({
	id: z.string(),
	goal_id: z.string(),
	user_id: z.string(),
	content: z.string().nullable(),
	type: z.string().nullable(),
	created_at: z.string(),
});

export const logsListResponse = z.object({
	data: z.array(logResponse),
	meta: z.object({
		totalCount: z.number(),
		totalPages: z.number(),
		currentPage: z.number(),
		hasNextPage: z.boolean(),
	}),
});

export const createLogResponse = z.object({
	id: z.string(),
});

export const successResponse = z.object({
	message: z.string(),
});
