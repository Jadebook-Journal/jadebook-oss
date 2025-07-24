import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();

	// we refresh the session and also make sure the user is signed in
	const [
		{
			data: { session },
		},
		{ data },
		cookieStore,
	] = await Promise.all([
		supabase.auth.getSession(),
		// session isn't synced with the server. So if the user email has changed then we need to get the latest user
		supabase.auth.getClaims(),
		cookies(),
	]);

	const user = data?.claims;

	if (!session || !user) {
		return redirect("/sign-in");
	}

	console.log(session.access_token);

	const _defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<main className="min-h-screen flex flex-col items-center">
			<div className="flex-1 w-full flex flex-col gap-20 items-center">
				{children}

				<div className="p-5 bg-gray-50 border">
					<p className="text-sm font-semibold">{session.access_token}</p>
				</div>
			</div>
		</main>
	);
}
