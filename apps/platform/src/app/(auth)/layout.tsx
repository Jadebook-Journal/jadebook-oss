import { Suspense } from "react";
import { AuthFormWrapper } from "@/components/auth/page";
import { QueryProvider } from "@/providers/query-provider";

const AUTH_IMAGE_SRC =
	process.env.NEXT_PUBLIC_AUTH_IMAGE ||
	"https://images.unsplash.com/photo-1570451488142-71d08e1511e3?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGFlc3RoZXRpY3xlbnwwfHwwfHx8Mg%3D%3D";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<QueryProvider>
			<Suspense>
				<AuthFormWrapper imageSrc={AUTH_IMAGE_SRC}>{children}</AuthFormWrapper>
			</Suspense>
		</QueryProvider>
	);
}
