import { z } from "@hono/zod-openapi";

// Query parameters for getting entries with filtering
export const getEntriesQuery = z.object({
	page: z.string().optional().default("0").openapi({
		example: "0",
		description: "Page number for pagination (0-based)",
	}),
	tagId: z.string().optional().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "Filter entries by tag ID",
	}),
	type: z.enum(["entry", "prompted", "all"]).optional().openapi({
		example: "entry",
		description: "Filter entries by type",
	}),
	dateType: z
		.enum(["updated_at", "created_at", "entry_date"])
		.optional()
		.openapi({
			example: "updated_at",
			description: "Sort by date field",
		}),
});

// Path parameters for getting a single entry
export const getEntryParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The entry UUID",
	}),
});

// Entry response schema (without sensitive fields)
export const entryResponse = z.object({
	id: z.string(),
	user_id: z.string(),
	title: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	entry_date: z.string(),
	cover: z.string().nullable(),
	tags: z.array(z.string()).nullable(),
	content: z.string().nullable(),
	character_count: z.number(),
	excerpt: z.string().nullable(),
	pinned: z.boolean(),
	type: z.string(),
	icon: z.string().nullable(),
});

// Entry list item response (for the entries list endpoint)
export const entryListItemResponse = z.object({
	id: z.string(),
	title: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	entry_date: z.string(),
	tags: z.array(z.string()).nullable(),
	excerpt: z.string().nullable(),
	pinned: z.boolean(),
	icon: z.string().nullable(),
	type: z.string(),
});

// Paginated entries response
export const entriesResponse = z.object({
	data: z.array(entryListItemResponse),
	meta: z.object({
		totalCount: z.number(),
		totalPages: z.number(),
		currentPage: z.number(),
		hasNextPage: z.boolean(),
	}),
});

// Validation schemas for entry operations
export const createEntryBody = z.object({
	title: z.string().openapi({
		example: "My Journal Entry",
		description: "The title of the entry",
	}),
	entry_date: z.string().optional().openapi({
		example: "2023-12-01T10:00:00Z",
		description: "The date for the entry",
	}),
	tags: z
		.array(z.string())
		.optional()
		.openapi({
			example: ["UUID for the tag"],
			description: "Array of tag IDs associated with the entry",
		}),
	type: z.enum(["entry", "prompted"]).openapi({
		example: "entry",
		description: "The type of entry",
	}),
	excerpt: z.string().optional().nullable().openapi({
		example: "Today was a good day...",
		description: "A brief excerpt or summary of the entry",
	}),
	content: z.string().optional().nullable().openapi({
		example: "The full content of my journal entry...",
		description: "The main content of the entry",
	}),
});

export const updateEntryParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The entry UUID to update",
	}),
});

export const updateEntryBody = z
	.object({
		character_count: z.number().optional(),
		content: z.string().optional().nullable(),
		cover: z.string().optional().nullable(),
		entry_date: z.string().optional(),
		excerpt: z.string().optional().nullable(),
		pinned: z.boolean().optional(),
		tags: z.array(z.string()).optional().nullable(),
		title: z.string().optional(),
		icon: z.string().optional().nullable(),
		type: z.enum(["entry", "prompted"]).optional(),
	})
	.openapi({
		example: {
			title: "Updated Journal Entry",
			content: "Updated content...",
			tags: ["health", "updated"],
			pinned: true,
		},
	});

export const deleteEntryParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The entry UUID to delete",
	}),
});

// Response schemas
export const createEntryResponse = z.object({
	id: z.string(),
});

export const successResponse = z.object({
	message: z.string(),
});

// Entry metadata response schema (only title and excerpt)
export const entryMetadataResponse = z.object({
	title: z.string(),
	excerpt: z.string().nullable(),
});
