import { Suspense } from "react";
import { EntryPage } from "./entry";

export default async function Page({
	params,
}: {
	params: Promise<{ entryId: string }>;
}) {
	const { entryId } = await params;

	return (
		<Suspense>
			<EntryPage entryId={entryId} />
		</Suspense>
	);
}
