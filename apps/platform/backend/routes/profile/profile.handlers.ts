import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { AppRouteHandler } from "../../types";
import type {
	GetUserProfileRoute,
	UpdateUserProfileRoute,
} from "./profile.routes";

export const getUserProfile: AppRouteHandler<GetUserProfileRoute> = async (
	c,
) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");

	const fetchProfile = async () => {
		// Use upsert to handle both getting existing profile and creating new one
		const { data, error } = await supabase
			.from("user")
			.upsert(
				{
					id: userId,
				},
				{
					onConflict: "id",
				},
			)
			.select("*")
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return data;
	};

	try {
		const profile = await fetchProfile();

		return c.json(profile, HttpStatusCodes.OK);
	} catch (error) {
		console.error(error);

		return c.json(
			{
				message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};

export const updateUserProfile: AppRouteHandler<
	UpdateUserProfileRoute
> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const updateData = c.req.valid("json");

	try {
		// Update the profile
		const { error } = await supabase
			.from("user")
			.update({
				...updateData,
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId);

		if (error) {
			return c.json(
				{
					message: "Profile update failed",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		return c.json(
			{
				message: "Profile updated",
			},
			HttpStatusCodes.OK,
		);
	} catch (error) {
		console.error(error);

		return c.json(
			{
				message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
