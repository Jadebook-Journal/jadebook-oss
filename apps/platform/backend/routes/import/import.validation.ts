import { z } from "zod";

export const importUrlBody = z.object({
	url: z.url().openapi({
		description: "The URL to import from",
	}),
});
