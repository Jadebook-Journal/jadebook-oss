import type { Metadata } from "next/types";
import { AssetsPage } from "./assets-page";

export const metadata: Metadata = {
	title: "Assets",
};

export default function Page() {
	return <AssetsPage />;
}
