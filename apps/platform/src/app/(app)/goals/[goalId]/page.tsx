import { Suspense } from "react";
import { AssetStoreProvider } from "@/providers/assets-provider";
import { GoalPage } from "./goal";

export default async function Page({
	params,
}: {
	params: Promise<{ goalId: string }>;
}) {
	const { goalId } = await params;

	return (
		<Suspense>
			<AssetStoreProvider>
				<GoalPage goalId={goalId} />
			</AssetStoreProvider>
		</Suspense>
	);
}
