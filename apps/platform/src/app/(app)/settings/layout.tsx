import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: {
		template: "%s | Settings",
		absolute: "Settings",
	},
};

export default async function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Suspense>{children}</Suspense>;
}
