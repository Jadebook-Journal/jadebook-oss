import type { Metadata } from "next/types";
import { ConfigPage } from "./config-page";

export const metadata: Metadata = {
	title: "Config",
};

export default function Page() {
	return <ConfigPage />;
}
