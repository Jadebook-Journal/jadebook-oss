import type { Metadata } from "next/types";
import { ConfigPage } from "./config-page";

export const metadata: Metadata = {
	title: "Config",
	robots: {
		follow: false,
		index: false,
	},
};

export default function Page() {
	return <ConfigPage />;
}
