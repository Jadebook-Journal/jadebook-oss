import type { Database } from "@/lib/supabase/types";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Schema } from "hono";

export interface AppBindings {
	Variables: {
		user: User;
		supabase: SupabaseClient<Database>;
		userId: string;
	};
}

export type AppOpenAPI<S extends Schema = Record<string, never>> = OpenAPIHono<
	AppBindings,
	S
>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;
