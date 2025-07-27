"use client";

import React, { createContext, type ReactNode, useContext } from "react";
import { useStore as useZustandStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { type AssetState, createAssetStore } from "@/stores/asset-store";

type AssetStore = ReturnType<typeof createAssetStore>;

export const AssetStoreContext = createContext<AssetStore | null>(null);

interface AssetProviderProps {
	children: ReactNode;
}

export const AssetStoreProvider = ({ children }: AssetProviderProps) => {
	// useRef to ensure the store is created only once per request/render
	const storeRef = React.useRef<AssetStore | null>(null);

	if (!storeRef.current) {
		storeRef.current = createAssetStore();
	}

	return (
		<AssetStoreContext.Provider value={storeRef.current}>
			{children}
		</AssetStoreContext.Provider>
	);
};

// Custom hook to use the store from the context
export const useAssetStore = <T,>(selector: (store: AssetState) => T): T => {
	const assetStoreContext = useContext(AssetStoreContext);

	if (!assetStoreContext) {
		throw new Error("useAssetStore must be used within AssetStoreProvider");
	}

	return useZustandStore(assetStoreContext, useShallow(selector));
};
