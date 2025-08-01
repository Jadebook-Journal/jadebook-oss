import type { Metadata } from "next/types";
import { AccountPage } from "./account-page";

export const metadata: Metadata = {
	title: "Account",
};

export default function Page() {
	return <AccountPage />;
}
