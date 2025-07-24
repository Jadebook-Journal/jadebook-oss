import { z } from "@hono/zod-openapi";

export const getGoalsQuery = z.object({
	limit: z.string().optional().default("50").openapi({
		example: "50",
		description:
			"The number of goals to return — A numerical string since this is a GET route",
	}),
	state: z.enum(["active", "archived"]).optional().default("active").openapi({
		example: "active",
		description: "Filter goals by state (active, archived)",
	}),
});

export const getGoalParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The goal ID",
	}),
});

export const createGoalBody = z.object({
	title: z.string().min(3).openapi({
		example: "Learn a new language",
		description: "The title of the goal",
	}),
	description: z.string().max(400).nullable().optional().openapi({
		example: "I want to learn Spanish fluently by practicing daily",
		description: "A detailed description of the goal",
	}),
	icon: z.string().nullable().optional().openapi({
		example: "🎯",
		description: "An icon representing the goal",
	}),
	end_date: z.string().openapi({
		example: "2024-06-01T00:00:00.000Z",
		description:
			"The target end date for the goal (must be at least 1 day in the future)",
	}),
	tags: z
		.array(z.string())
		.nullable()
		.optional()
		.openapi({
			example: ["550e8400-e29b-41d4-a716-446655440001"],
			description: "Array of tag IDs associated with the goal",
		}),
	pinned: z.boolean().optional().default(false).openapi({
		example: false,
		description: "Whether the goal should be pinned",
	}),
});

export const updateGoalParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The goal ID to update",
	}),
});

export const updateGoalBody = z.object({
	title: z.string().min(3).optional().openapi({
		example: "Learn Spanish fluently",
		description: "The updated title of the goal",
	}),
	description: z.string().max(400).nullable().optional().openapi({
		example:
			"I want to learn Spanish fluently by practicing daily for 30 minutes",
		description: "The updated description of the goal",
	}),
	icon: z.string().nullable().optional().openapi({
		example: "🇪🇸",
		description: "The updated icon representing the goal",
	}),
	end_date: z.string().optional().openapi({
		example: "2024-08-01T00:00:00.000Z",
		description: "The updated target end date for the goal",
	}),
	tags: z
		.array(z.string())
		.nullable()
		.optional()
		.openapi({
			example: ["550e8400-e29b-41d4-a716-446655440001"],
			description: "Updated array of tag IDs associated with the goal",
		}),
	pinned: z.boolean().optional().openapi({
		example: false,
		description: "Whether the goal should be pinned to the sidebar",
	}),
	state: z.enum(["active", "archived"]).optional().openapi({
		example: "active",
		description: "The state of the goal",
	}),
	cover: z.string().nullable().optional().openapi({
		example: "https://example.com/image.jpg",
		description: "A cover image URL for the goal",
	}),
});

// Delete goal validation
export const deleteGoalParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The goal ID to delete",
	}),
});

// Response schemas
export const goalResponse = z.object({
	id: z.string(),
	user_id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
	end_date: z.string(),
	state: z.string(),
	icon: z.string().nullable(),
	tags: z.array(z.string()).nullable(),
	pinned: z.boolean(),
	cover: z.string().nullable(),
});

export const goalsResponse = z.array(goalResponse);

export const createGoalResponse = z.object({
	id: z.string(),
});

export const successResponse = z.object({
	message: z.string(),
});
