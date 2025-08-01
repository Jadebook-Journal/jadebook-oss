import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MotionProvider } from "@/providers/motion-provider";
import { ToastProvider } from "@/providers/toast-provider";

export const metadata: Metadata = {
	title: {
		template: "%s | Jadebook OSS",
		absolute: "Jadebook OSS",
	},
};

const geistSans = Geist({
	variable: "--font-sans",
	display: "swap",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-mono",
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				geistSans.variable,
				geistMono.variable,
				"scroll-smooth antialiased",
			)}
		>
			<body>
				<ToastProvider>
					<MotionProvider>
						<TooltipProvider delayDuration={200}>{children}</TooltipProvider>
					</MotionProvider>
				</ToastProvider>
			</body>
		</html>
	);
}
