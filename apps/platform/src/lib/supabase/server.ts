import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient(props?: { admin?: boolean }) {
	const cookieStore = await cookies();

	if (
		!process.env.SUPABASE_URL ||
		!process.env.SUPABASE_ANON_KEY ||
		!process.env.SUPABASE_SERVICE_ROLE_KEY
	) {
		throw new Error("Missing Supabase environment variables");
	}

	return createServerClient<Database>(
		process.env.SUPABASE_URL,
		props?.admin
			? process.env.SUPABASE_SERVICE_ROLE_KEY
			: process.env.SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options),
						);
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
}
