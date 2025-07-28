import type { Metadata } from "next/types";
import { ThemePage } from "./theme-page";

export const metadata: Metadata = {
	title: "Theme",
	robots: {
		follow: false,
		index: false,
	},
};

export default function Page() {
	return <ThemePage />;
}
