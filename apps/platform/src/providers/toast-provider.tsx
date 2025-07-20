"use client";

import { Toaster } from "@/components/ui/sonner";

// we need to load the toaster client-side otherwise the positioning resets for some reason
// - Note: might just be a dev thing
export function ToastProvider({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}

			<Toaster position="top-center" duration={1500} closeButton />
		</>
	);
}
