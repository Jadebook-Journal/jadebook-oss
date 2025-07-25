import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import type {
	GetMiscPinned200,
	GetApiProfile200,
	GetApiTags200Item,
} from "@/api-client";
import type { Theme } from "@/features/theme";

export interface AppState {
	profile: GetApiProfile200;
	pinnedResources: GetMiscPinned200;
	tags: GetApiTags200Item[];
	isPro: boolean;
	session: Session;
	theme: Theme;
	commandCenterOpen: boolean;
	updatePinnedResources: (pinnedResources: GetMiscPinned200) => void;
	updateTag: (tag: GetApiTags200Item) => void;
	updateTags: (tags: GetApiTags200Item[]) => void;
	updateProfile: (profile: Partial<GetApiProfile200>) => void;
	updateTheme: (theme: Theme) => void;
	updateCommandCenterOpen: (open: boolean) => void;
}

export const createAppStore = (
	initialState: Pick<
		AppState,
		"profile" | "pinnedResources" | "tags" | "theme" | "session" | "isPro"
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
				theme: state.theme,
			}));
		},
		updateTheme: (theme) => {
			set({ theme });
		},
		updateCommandCenterOpen: (open) => {
			set({ commandCenterOpen: open });
		},
	}));
};
