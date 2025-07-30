"use client";

import { create } from "zustand";
import type { GetApiEntriesId200 } from "@/api-client";

/**
 * We don't want to lose the user's changes when they navigate — we can't track client-side navigation in NextJS
 * So, we store the entry in the global state and update it when the user navigates to a new entry
 *
 * We use the entry ID to identify the entry and update the state when the user navigates to a new entry
 * Then we use a save layer at the top of the component tree to handle saving the document to the server
 */
export type GlobalEntryState = GetApiEntriesId200 & {
	// full update — used for initial server-client sync
	updateEntry: (entry: GetApiEntriesId200) => void;
	// granular state updates
	updateId: (entryId: string) => void;
	updateUserId: (userId: string) => void;
	updateTitle: (title: string) => void;
	updateCreatedAt: (createdAt: string) => void;
	updateUpdatedAt: (updatedAt: string) => void;
	updateEntryDate: (entryDate: string) => void;
	updateCover: (cover: string | null) => void;
	updateTags: (tags: string[]) => void;
	updateContent: (content: string | null) => void;
	updateCharacterCount: (characterCount: number) => void;
	updateExcerpt: (excerpt: string | null) => void;
	updatePinned: (pinned: boolean) => void;
	updateType: (type: string) => void;
	updateIcon: (icon: string | null) => void;
};

export const useGlobalEntryStore = create<GlobalEntryState>((set) => ({
	id: "",
	user_id: "",
	title: "",
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	entry_date: new Date().toISOString(),
	cover: null,
	tags: [],
	content: null,
	character_count: 0,
	excerpt: null,
	pinned: false,
	type: "",
	icon: null,
	updateEntry: (entry) => {
		set({
			id: entry.id,
			user_id: entry.user_id,
			title: entry.title,
			created_at: entry.created_at,
			updated_at: entry.updated_at,
			entry_date: entry.entry_date,
			cover: entry.cover,
			tags: entry.tags,
			content: entry.content,
			character_count: entry.character_count,
			excerpt: entry.excerpt,
			pinned: entry.pinned,
			type: entry.type,
			icon: entry.icon,
		});
	},
	updateId: (id) => {
		set({ id });
	},
	updateUserId: (userId) => {
		set({ user_id: userId });
	},
	updateTitle: (title) => {
		set({ title });
	},
	updateCreatedAt: (createdAt) => {
		set({ created_at: createdAt });
	},
	updateUpdatedAt: (updatedAt) => {
		set({ updated_at: updatedAt });
	},
	updateEntryDate: (entryDate) => {
		set({ entry_date: entryDate });
	},
	updateCover: (cover) => {
		set({ cover });
	},
	updateTags: (tags) => {
		set({ tags });
	},
	updateContent: (content) => {
		set({ content });
	},
	updateCharacterCount: (characterCount) => {
		set({ character_count: characterCount });
	},
	updateExcerpt: (excerpt) => {
		set({ excerpt });
	},
	updatePinned: (pinned) => {
		set({ pinned });
	},

	updateIcon: (icon) => {
		set({ icon });
	},
	updateType: (type) => {
		set({ type });
	},
}));
