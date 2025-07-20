import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionProvider } from "@/providers/motion-provider";
import { ToastProvider } from "@/providers/toast-provider";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Jadebook OSS",
	description: "Jadebook OSS",
	// OSS Jadebook is meant for personal use only, so we don't want to index it
	robots: {
		index: false,
		follow: false,
	},
};

const geistSans = Geist({
	variable: "--font-geist-sans",
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.className} antialiased`}>
				<ToastProvider>
					<MotionProvider>
						<TooltipProvider delayDuration={200}>{children}</TooltipProvider>
					</MotionProvider>
				</ToastProvider>
			</body>
		</html>
	);
}
