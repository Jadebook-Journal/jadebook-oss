import { z } from "@hono/zod-openapi";

export const selectProfileResponse = z.object({
	config: z.string().nullable(),
	created_at: z.string(),
	current_streak: z.number(),
	id: z.string().openapi({
		description:
			"The user's unique ID — reference to the Supabase Auth user ID",
	}),
	last_entry_date: z.string().nullable(),
	longest_streak: z.number(),
	profile_image: z.string().nullable(),
	theme: z.string().nullable(),
	updated_at: z.string(),
	username: z.string().nullable(),
});

export const updateProfileBody = z
	.object({
		profile_image: z.string().nullable().optional(),
		theme: z.string().nullable().optional(),
		config: z.string().nullable().optional(),
		username: z.string().nullable().optional(),
	})
	.openapi({
		description:
			"Profile update data - all fields are optional for partial updates",
	});
