import type { Metadata } from "next/types";
import { ThemePage } from "./theme-page";

export const metadata: Metadata = {
	title: "Theme",
};

export default function Page() {
	return <ThemePage />;
}
