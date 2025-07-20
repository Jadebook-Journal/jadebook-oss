"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type * as React from "react";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
			refetchOnMount: false,
			// sync every 20 minutes
			refetchInterval: 1000 * 60 * 20,
			staleTime: 1000 * 60 * 5,
			retry: 0,
		},
	},
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}

			{process.env.NODE_ENV === "development" && (
				<ReactQueryDevtools
					initialIsOpen={false}
					buttonPosition="bottom-right"
				/>
			)}
		</QueryClientProvider>
	);
}
