import { z } from "@hono/zod-openapi";

// Query parameters for getting documents with filtering
export const getDocumentsQuery = z.object({
	page: z.string().optional().default("0").openapi({
		example: "0",
		description: "Page number for pagination (0-based)",
	}),
	tagId: z.string().optional().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "Filter documents by tag ID",
	}),
	type: z.enum(["document", "prompted", "all"]).optional().openapi({
		example: "document",
		description: "Filter documents by type",
	}),
	dateType: z
		.enum(["updated_at", "created_at", "entry_date"])
		.optional()
		.openapi({
			example: "updated_at",
			description: "Sort by date field",
		}),
});

// Path parameters for getting a single document
export const getDocumentParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The document UUID",
	}),
});

// Document response schema (without sensitive fields)
export const documentResponse = z.object({
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

// Document list item response (for the documents list endpoint)
export const documentListItemResponse = z.object({
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

// Paginated documents response
export const documentsResponse = z.object({
	data: z.array(documentListItemResponse),
	meta: z.object({
		totalCount: z.number(),
		totalPages: z.number(),
		currentPage: z.number(),
		hasNextPage: z.boolean(),
	}),
});

// Validation schemas for document operations
export const createDocumentBody = z.object({
	title: z.string().openapi({
		example: "My Journal Entry",
		description: "The title of the document",
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
			description: "Array of tag IDs associated with the document",
		}),
	type: z.enum(["document", "prompted"]).openapi({
		example: "document",
		description: "The type of document",
	}),
	excerpt: z.string().optional().nullable().openapi({
		example: "Today was a good day...",
		description: "A brief excerpt or summary of the document",
	}),
	content: z.string().optional().nullable().openapi({
		example: "The full content of my journal entry...",
		description: "The main content of the document",
	}),
});

export const updateDocumentParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The document UUID to update",
	}),
});

export const updateDocumentBody = z
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
		type: z.enum(["document", "prompted"]).optional(),
	})
	.openapi({
		example: {
			title: "Updated Journal Entry",
			content: "Updated content...",
			tags: ["health", "updated"],
			pinned: true,
		},
	});

export const deleteDocumentParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The document UUID to delete",
	}),
});

// Response schemas
export const createDocumentResponse = z.object({
	id: z.string(),
});

export const successResponse = z.object({
	message: z.string(),
});

// Document metadata response schema (only title and excerpt)
export const documentMetadataResponse = z.object({
	title: z.string(),
	excerpt: z.string().nullable(),
});
