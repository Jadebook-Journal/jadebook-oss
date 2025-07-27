import type { Metadata } from "next/types";
import { Suspense } from "react";
import { TagPage } from "./tag";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ tagId: string }>;
}): Promise<Metadata> {
	const { tagId } = await params;

	return {
		title: `Tag: ${tagId}`,
	};
}

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
