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
import { MainContainer } from "@/components/app/main-container";
import { SaveLayer } from "@/components/journal/save-layer";
import { GlobalCommandCenter } from "@/components/command/command-center";
import Head from "next/head";

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

	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<Suspense>
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<QueryProvider>
				<div className="bg-background tracking-normal">
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

								<MainContainer>{children}</MainContainer>

								<SaveLayer />

								<GlobalCommandCenter />
							</SidebarProvider>
						</ThemeLoader>
					</AppStoreProvider>
				</div>
			</QueryProvider>
		</Suspense>
	);
}
