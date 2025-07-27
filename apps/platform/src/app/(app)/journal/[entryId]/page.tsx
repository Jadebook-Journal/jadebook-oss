import type { Metadata } from "next/types";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getApiEntriesId, getApiEntriesIdMetadata } from "@/api-client";
import { ErrorRoute } from "@/components/routes/error";
import { EntryPage } from "./entry";

// we want to dynamically generate the metadata for the entry
export async function generateMetadata({
	params,
}: {
	params: Promise<{ entryId: string }>;
}): Promise<Metadata> {
	const { entryId } = await params;

	const supabase = await createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		throw new Error("Not authenticated");
	}

	const entryQuery = await getApiEntriesIdMetadata(entryId, {
		headers: {
			Authorization: `Bearer ${session.access_token}`,
		},
	});

	if (entryQuery.status !== 200) {
		throw new Error("Entry not found");
	}

	return {
		title: entryQuery.data.title,
		description: entryQuery.data.excerpt,
		robots: {
			follow: false,
			index: false,
		},
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ entryId: string }>;
}) {
	const { entryId } = await params;

	return (
		<Suspense>
			<Content entryId={entryId} />
		</Suspense>
	);
}

async function Content({ entryId }: { entryId: string }) {
	const supabase = await createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		return <ErrorRoute />;
	}

	const entryQuery = await getApiEntriesId(entryId, {
		headers: {
			Authorization: `Bearer ${session.access_token}`,
		},
	});

	if (entryQuery.status !== 200) {
		return <ErrorRoute />;
	}

	return <EntryPage entry={entryQuery.data} />;
}
