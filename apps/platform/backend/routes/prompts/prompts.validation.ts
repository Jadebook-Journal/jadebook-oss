import { z } from "@hono/zod-openapi";

export const promptsResponse = z
	.object({
		prompts: z.array(z.string()),
	})
	.openapi({
		description:
			"Generated prompts response — always static since we don't have AI",
	});
