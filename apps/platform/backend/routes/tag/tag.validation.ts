import { z } from "@hono/zod-openapi";

// Tag color options
const tagColorOptions = [
	"slate",
	"gray",
	"zinc",
	"neutral",
	"stone",
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
] as const;

// Tag variant options
const tagVariantOptions = ["outline", "color", "text", "flat"] as const;

// Get tags query (no additional params needed for listing all tags)
export const getTagsQuery = z.object({}).openapi({
	description: "Get all tags for the authenticated user",
});

// Get tag by ID params
export const getTagParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The tag ID",
	}),
});

// Create tag body
export const createTagBody = z.object({
	label: z.string().min(1).openapi({
		example: "health",
		description: "The text content of the tag",
	}),
	variant: z.enum(tagVariantOptions).openapi({
		example: "color",
		description: "The visual variant of the tag",
	}),
	color: z.enum(tagColorOptions).openapi({
		example: "blue",
		description: "The color scheme of the tag",
	}),
	icon: z.string().openapi({
		example: "",
		description: "An optional icon for the tag",
	}),
});

// Update tag params
export const updateTagParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The tag ID to update",
	}),
});

// Update tag body (all fields optional for partial updates)
export const updateTagBody = z.object({
	label: z.string().min(1).optional().openapi({
		example: "wellness",
		description: "The updated text content of the tag",
	}),
	variant: z.enum(tagVariantOptions).optional().openapi({
		example: "flat",
		description: "The updated visual variant of the tag",
	}),
	color: z.enum(tagColorOptions).optional().openapi({
		example: "green",
		description: "The updated color scheme of the tag",
	}),
	icon: z.string().nullable().optional().openapi({
		example: "🌿",
		description: "The updated icon for the tag",
	}),
	cover: z.string().nullable().optional().openapi({
		example: "https://example.com/cover.jpg",
		description: "An optional cover image URL for the tag",
	}),
	pinned: z.boolean().optional().openapi({
		example: true,
		description: "Whether the tag should be pinned",
	}),
});

// Delete tag params
export const deleteTagParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The tag ID to delete",
	}),
});

// Goals by tag query
export const getGoalsByTagQuery = z.object({
	state: z.enum(["active", "archived"]).optional().default("active").openapi({
		example: "active",
		description: "Filter goals by state (active, archived)",
	}),
});

// Goals by tag params
export const getGoalsByTagParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The tag ID to fetch goals for",
	}),
});

// Response schemas
export const tagResponse = z.object({
	id: z.string(),
	user_id: z.string(),
	label: z.string(),
	variant: z.string().nullable(),
	color: z.string().nullable(),
	icon: z.string().nullable(),
	cover: z.string().nullable(),
	pinned: z.boolean(),
	created_at: z.string(),
	updated_at: z.string(),
});

export const tagsResponse = z.array(tagResponse);

export const createTagResponse = z.object({
	id: z.string(),
});

export const goalsByTagResponse = z.array(
	z.object({
		id: z.string(),
		title: z.string(),
		created_at: z.string(),
		end_date: z.string(),
		icon: z.string().nullable(),
	}),
);

export const successResponse = z.object({
	message: z.string(),
});
