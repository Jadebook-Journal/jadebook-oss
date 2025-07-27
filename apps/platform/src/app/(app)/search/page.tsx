import type { Metadata } from "next/types";
import { SearchPage } from "./search-page";

export const metadata: Metadata = {
	title: "Search",
	robots: {
		follow: false,
		index: false,
	},
};

export default function Page() {
	return <SearchPage />;
}
