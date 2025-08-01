import type { Metadata } from "next/types";
import { SearchPage } from "./search-page";

export const metadata: Metadata = {
	title: "Search",
};

export default function Page() {
	return <SearchPage />;
}
