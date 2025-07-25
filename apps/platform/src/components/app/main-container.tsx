"use client";

import { useAppStore } from "@/providers/app-store-provider";
import { SidebarInset } from "../ui/sidebar";

export const MainContainer = ({ children }: { children: React.ReactNode }) => {
	const { config } = useAppStore((store) => ({
		config: store.config,
	}));

	if (config.layout.sidebarVariant === "inset") {
		return (
			<SidebarInset>
				<div className="absolute inset-0 isolate @container">{children}</div>
			</SidebarInset>
		);
	}

	return (
		<div className="relative flex flex-1 flex-col overflow-hidden transition-all ease-in-out">
			<div className="absolute inset-0 isolate @container">{children}</div>
		</div>
	);
};
