import { Suspense } from "react";
import { AuthFormWrapper } from "@/components/auth/page";
import { QueryProvider } from "@/providers/query-provider";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const AUTH_IMAGE_SRC = process.env.NEXT_PUBLIC_AUTH_IMAGE_URL;

	if (!AUTH_IMAGE_SRC) {
		throw new Error("NEXT_PUBLIC_AUTH_IMAGE_URL is not set");
	}

	return (
		<QueryProvider>
			<Suspense>
				<AuthFormWrapper imageSrc={AUTH_IMAGE_SRC}>{children}</AuthFormWrapper>
			</Suspense>
		</QueryProvider>
	);
}
