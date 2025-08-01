import type { Metadata } from "next/types";
import { TagsPage } from "./tag-page";

export const metadata: Metadata = {
	title: "Tags",
};

export default function Page() {
	return <TagsPage />;
}
