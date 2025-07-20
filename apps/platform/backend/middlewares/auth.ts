import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { AppBindings } from "../types";
import { createClient } from "@/lib/supabase/server";

/**
 * Middleware to authenticate requests using Supabase. We use the `Authorization` header to get the JWT token.
 * and have the user log in with it.
 */
export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
	const authorization = c.req.header("Authorization");

	if (!authorization) {
		throw new HTTPException(401, { message: "Missing Authorization header" });
	}

	const jwt = authorization.replace("Bearer ", "");

	if (!jwt) {
		throw new HTTPException(401, {
			message: "Invalid Authorization header format",
		});
	}

	const supabase = await createClient();

	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(jwt);

		if (error || !user) {
			throw new HTTPException(401, { message: "Invalid or expired token" });
		}

		// Set user data in context for use in routes
		c.set("user", user);
		c.set("supabase", supabase);
		c.set("userId", user.id);

		await next();
	} catch (error) {
		if (error instanceof HTTPException) {
			throw error;
		}

		throw new HTTPException(500, { message: "Authentication service error" });
	}
});
