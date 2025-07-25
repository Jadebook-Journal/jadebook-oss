import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { QueryProvider } from "@/providers/query-provider";

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
		<Suspense>
			<QueryProvider>
				<div className="bg-background">
					<AppStoreProvider
						initialState={{
							profile: profile,
							pinnedResources: pinned,
							tags: tags,
							session,
						}}
					>
						<ThemeHandler>
							<PasscodeLayer>
								<SidebarProvider defaultOpen={defaultOpen}>
									<AppSidebar />

									<MainContainer>
										{children}

										<SaveLayer />

										<GlobalCommandCenter />
									</MainContainer>
								</SidebarProvider>
							</PasscodeLayer>
						</ThemeHandler>
					</AppStoreProvider>
				</div>
			</QueryProvider>
		</Suspense>
	);
}
