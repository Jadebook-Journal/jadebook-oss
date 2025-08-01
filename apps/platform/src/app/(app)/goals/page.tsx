import type { Metadata } from "next/types";
import { Suspense } from "react";
import { GoalsPage } from "./goals";

export const metadata: Metadata = {
	title: "Goals",
};

export default function Page() {
	return (
		<Suspense>
			<GoalsPage />
		</Suspense>
	);
}
