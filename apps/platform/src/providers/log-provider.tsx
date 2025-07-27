"use client";

import React, { createContext, type ReactNode, useContext } from "react";
import { useStore as useZustandStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
	createLogStore,
	type LogState,
	type LogStoreInitialState,
} from "@/stores/log-store";

type LogStore = ReturnType<typeof createLogStore>;

export const LogStoreContext = createContext<LogStore | null>(null);

interface LogProviderProps {
	children: ReactNode;
	initialState: LogStoreInitialState;
}

/**
 * The app store requires values from the server so to sync the server and client, we need a provider for the app store
 */
export const LogStoreProvider = ({
	children,
	initialState,
}: LogProviderProps) => {
	// useRef to ensure the store is created only once per request/render
	const storeRef = React.useRef<LogStore | null>(null);

	if (!storeRef.current) {
		storeRef.current = createLogStore({
			...initialState,
		});
	}

	return (
		<LogStoreContext.Provider value={storeRef.current}>
			{children}
		</LogStoreContext.Provider>
	);
};

// Custom hook to use the store from the context
export const useLogStore = <T,>(selector: (store: LogState) => T): T => {
	const logStoreContext = useContext(LogStoreContext);

	if (!logStoreContext) {
		throw new Error("useLogStore must be used within LogStoreProvider");
	}

	return useZustandStore(logStoreContext, useShallow(selector));
};
