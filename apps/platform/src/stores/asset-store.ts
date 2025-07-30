import { create } from "zustand";
import type { GetApiAssets200DataItem } from "@/api-client";

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
