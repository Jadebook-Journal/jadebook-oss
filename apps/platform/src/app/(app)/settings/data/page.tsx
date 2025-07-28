import type { Metadata } from "next/types";
import { DataPage } from "./data-page";

export const metadata: Metadata = {
	title: "Data",
	robots: {
		follow: false,
		index: false,
	},
};

export default function Page() {
	return <DataPage />;
}
