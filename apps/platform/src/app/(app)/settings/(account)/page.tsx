import type { Metadata } from "next/types";
import { AccountPage } from "./account-page";

export const metadata: Metadata = {
	title: "Account",
	robots: {
		follow: false,
		index: false,
	},
};

export default function Page() {
	return <AccountPage />;
}
