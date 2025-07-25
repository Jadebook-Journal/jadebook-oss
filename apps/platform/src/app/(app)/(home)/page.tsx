import type { Metadata } from "next/types";
import { HomePage } from "./home-page";

export const metadata: Metadata = {
	title: "Home",
	robots: {
		follow: false,
		index: false,
	},
};

export default function Page() {
	return <HomePage />;
}
