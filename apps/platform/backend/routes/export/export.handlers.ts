import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { AppRouteHandler } from "../../types";
import type {
	CreateUserExportRoute,
	GetUserExportRoute,
	GetUserExportsRoute,
	ExpireUserExportRoute,
} from "./export.routes";

export const getUserExports: AppRouteHandler<GetUserExportsRoute> = async (
	c,
) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");

	try {
		const { data, error } = await supabase
			.from("export")
			.select("*")
			.match({ user_id: userId })
			// show only the 10 latest exports
			.order("created_at", { ascending: false })
			.limit(10);

		if (error) {
			throw new Error(error.message);
		}

		return c.json(data, HttpStatusCodes.OK);
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

export const createUserExport: AppRouteHandler<CreateUserExportRoute> = async (
	c,
) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const updateData = c.req.valid("json");

	try {
		// Create the export
		const { error } = await supabase.from("export").insert({
			...updateData,
			created_at: new Date().toISOString(),
			user_id: userId,
		});

		if (error) {
			return c.json(
				{
					message: "Export creation failed",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		return c.json(
			{
				message: "Export created",
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

export const expireUserExport: AppRouteHandler<ExpireUserExportRoute> = async (
	c,
) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");
	const updateData = c.req.valid("json");

	try {
		// Expire the export
		const { error } = await supabase
			.from("export")
			.update({
				expire_at: updateData.expire_at,
			})
			.eq("id", c.req.param("id"))
			.eq("user_id", userId);

		if (error) {
			return c.json(
				{
					message: "Export expiration failed",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		return c.json(
			{
				message: "Export expired",
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

// this is a separate route from the backend since we don't want to run the auth middleware
// the actual route is in the /export/[exportId]/route.ts file
// if this is hit, then something went horribly wrong
export const getUserExport: AppRouteHandler<GetUserExportRoute> = async (c) => {
	return c.json(
		{
			message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
		},
		HttpStatusCodes.INTERNAL_SERVER_ERROR,
	);
};
