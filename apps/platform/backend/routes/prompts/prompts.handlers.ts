import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { AppRouteHandler } from "@backend/types";
import { casualPrompts, prompts } from "./prompts";
import type { GetPromptsRoute } from "./prompts.routes";

// Utility function to get random prompts from an array
function getRandomPrompts(array: string[], count: number): string[] {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

// Utility function to get mixed static prompts
function getMixedStaticPrompts(): string[] {
	const normalPrompts = getRandomPrompts(prompts, 2);
	const casualPromptsResult = getRandomPrompts(casualPrompts, 1);
	return [...normalPrompts, ...casualPromptsResult];
}

export const getPrompts: AppRouteHandler<GetPromptsRoute> = async (c) => {
	try {
		return c.json({
			prompts: getMixedStaticPrompts(),
		});
	} catch (error) {
		console.error(error);

		return c.json(
			{ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
