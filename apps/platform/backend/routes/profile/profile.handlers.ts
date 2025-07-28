import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { AppRouteHandler } from "../../types";
import type {
	DeleteUserProfileRoute,
	GetUserProfileRoute,
	UpdateUserProfileRoute,
} from "./profile.routes";
import { createClient } from "@/lib/supabase/server";

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
			.match({
				id: userId,
			});

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

export const deleteUserProfile: AppRouteHandler<
	DeleteUserProfileRoute
> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");

	try {
		// first, we need to fetch all of the user's assets
		const { data: assets, error: assetsError } = await supabase
			.from("asset")
			.select("path")
			.eq("user_id", userId);

		if (assetsError) {
			return c.json(
				{
					message: "Failed to fetch assets",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		// then we need to use supabase storage to delete all of the assets
		const { error: storageError } = await supabase.storage
			.from("user_assets")
			.remove(assets.map((asset) => asset.path));

		if (storageError) {
			return c.json(
				{
					message: "Failed to delete assets",
				},
				HttpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		// then we need to delete the user's profile
		const { error } = await supabase.from("user").delete().match({
			id: userId,
		});

		if (error) {
			return c.json(
				{
					message: "Profile deletion failed",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		// we need the service role key to delete the user
		const supabaseAdmin = await createClient({ admin: true });

		const { error: authError } =
			await supabaseAdmin.auth.admin.deleteUser(userId);

		console.log(authError);

		if (authError) {
			return c.json(
				{
					message: `Profile deletion failed: ${authError.message}`,
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		return c.json(
			{
				message: "Profile deleted",
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
