"use client";

import React, { createContext, type ReactNode, useContext } from "react";
import { useStore as useZustandStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
	createGoalStore,
	type GoalState,
	type GoalStoreInitialState,
} from "@/stores/goal-store";

type GoalStore = ReturnType<typeof createGoalStore>;

export const GoalStoreContext = createContext<GoalStore | null>(null);

interface GoalProviderProps {
	children: ReactNode;
	initialState: GoalStoreInitialState;
}

/**
 * The app store requires values from the server so to sync the server and client, we need a provider for the app store
 */
export const GoalStoreProvider = ({
	children,
	initialState,
}: GoalProviderProps) => {
	// useRef to ensure the store is created only once per request/render
	const storeRef = React.useRef<GoalStore | null>(null);

	if (!storeRef.current) {
		storeRef.current = createGoalStore({
			...initialState,
		});
	}

	return (
		<GoalStoreContext.Provider value={storeRef.current}>
			{children}
		</GoalStoreContext.Provider>
	);
};

// Custom hook to use the store from the context
export const useGoalStore = <T,>(selector: (store: GoalState) => T): T => {
	const goalStoreContext = useContext(GoalStoreContext);

	if (!goalStoreContext) {
		throw new Error("useGoalStore must be used within GoalStoreProvider");
	}

	return useZustandStore(goalStoreContext, useShallow(selector));
};

// Optional version that returns null instead of throwing
export const useGoalStoreOptional = <T,>(
	selector: (store: GoalState) => T,
): T | null => {
	const goalStoreContext = useContext(GoalStoreContext);

	// Create a default store that returns null for any selector
	const defaultStore = React.useMemo(
		() =>
			goalStoreContext ||
			createGoalStore({
				id: "",
				user_id: "",
				title: "",
				description: "",
				created_at: "",
				cover: "",
				icon: "",
				updated_at: "",
				end_date: "",
				state: "active",
				tags: [],
				pinned: false,
			}),
		[goalStoreContext],
	);

	const result = useZustandStore(defaultStore, useShallow(selector));

	// Return null if no context was provided
	return goalStoreContext ? result : null;
};
