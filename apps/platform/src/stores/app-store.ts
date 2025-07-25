import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import type {
	GetApiMiscPinned200,
	GetApiProfile200,
	GetApiTags200Item,
} from "@/api-client";

import type { AppConfig } from "@/types/config";
import type { SavedThemeSettings } from "@/types/theme";

export interface AppState {
	profile: GetApiProfile200;
	pinnedResources: GetApiMiscPinned200;
	tags: GetApiTags200Item[];
	session: Session;
	theme: SavedThemeSettings;
	config: AppConfig;
	commandCenterOpen: boolean;
	updatePinnedResources: (pinnedResources: GetApiMiscPinned200) => void;
	updateTag: (tag: GetApiTags200Item) => void;
	updateTags: (tags: GetApiTags200Item[]) => void;
	updateProfile: (profile: Partial<GetApiProfile200>) => void;
	updateTheme: (theme: SavedThemeSettings) => void;
	updateConfig: (config: AppConfig) => void;
	updateCommandCenterOpen: (open: boolean) => void;
}

export const createAppStore = (
	initialState: Pick<
		AppState,
		"profile" | "pinnedResources" | "tags" | "theme" | "session" | "config"
	>,
) => {
	return create<AppState>((set) => ({
		...initialState,
		commandCenterOpen: false,
		updatePinnedResources: (pinnedResources) => {
			set({ pinnedResources });
		},
		updateTag: (tag) => {
			set((state) => {
				const newTags = state.tags.map((t) => (t.id === tag.id ? tag : t));

				return { tags: newTags };
			});
		},
		updateTags: (tags) => {
			set({ tags });
		},
		updateProfile: (profile) => {
			set((state) => ({
				...state.profile,
				...profile,
				config: state.config,
				theme: state.theme,
			}));
		},
		updateTheme: (theme) => {
			set({ theme });
		},
		updateConfig: (config) => {
			set({ config });
		},
		updateCommandCenterOpen: (open) => {
			set({ commandCenterOpen: open });
		},
	}));
};
