import { create } from "zustand";
import type { GetApiEntries200DataItem } from "@/api-client";

export interface JournalState {
	journal: GetApiEntries200DataItem[];
	updateJournal: (journal: GetApiEntries200DataItem[]) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
	journal: [],
	updateJournal: (journal) => {
		set({ journal });
	},
}));
