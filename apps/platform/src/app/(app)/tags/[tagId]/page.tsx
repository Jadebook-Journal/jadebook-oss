import { Suspense } from "react";
import { TagPage } from "./tag";

export default async function Page({
	params,
}: {
	params: Promise<{ tagId: string }>;
}) {
	const { tagId } = await params;

	return (
		<Suspense>
			<TagPage tagId={tagId} />
		</Suspense>
	);
}
