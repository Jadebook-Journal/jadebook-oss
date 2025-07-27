import type { Metadata } from "next/types";
import { Suspense } from "react";
import { GoalsPage } from "./goals";

export const metadata: Metadata = {
	title: "Goals",
	robots: {
		follow: false,
		index: false,
	},
};

export default function Page() {
	return (
		<Suspense>
			<GoalsPage />
		</Suspense>
	);
}
