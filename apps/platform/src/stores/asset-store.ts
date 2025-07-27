import type { GetApiAssets200DataItem } from "@/api-client";
import { create } from "zustand";

export type AssetState = {
	assets: GetApiAssets200DataItem[];
	updateAssets: (assets: GetApiAssets200DataItem[]) => void;
};

export const createAssetStore = () => {
	return create<AssetState>((set) => ({
		assets: [],
		updateAssets: (assets) => {
			set({ assets });
		},
	}));
};
