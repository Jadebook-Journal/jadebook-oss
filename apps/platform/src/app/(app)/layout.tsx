import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { AppStoreProvider } from "@/providers/app-store-provider";
import { getApiMiscPinned, getApiProfile, getApiTags } from "@/api-client";
import { ThemeLoader } from "@/features/theme/theme-loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/sidebar";

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

	// load initial data on the server — we don't cache this data as it will be updated on the client
	const [profile, tags, pinned] = await Promise.all([
		getApiProfile({
			headers: {
				Authorization: session.access_token,
			},
			cache: "no-cache",
		}),
		getApiTags({
			headers: {
				Authorization: session.access_token,
			},
			cache: "no-cache",
		}),
		getApiMiscPinned({
			headers: {
				Authorization: session.access_token,
			},
			cache: "no-cache",
		}),
	]);

	console.log(profile, tags, pinned);

	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

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
						<ThemeLoader>
							<SidebarProvider defaultOpen={defaultOpen}>
								<AppSidebar />

								{children}

								{/* <MainContainer>
									{children}

									<SaveLayer />

									<GlobalCommandCenter />
								</MainContainer> */}
							</SidebarProvider>
						</ThemeLoader>
					</AppStoreProvider>
				</div>
			</QueryProvider>
		</Suspense>
	);
}
