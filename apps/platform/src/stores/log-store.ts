import { create } from "zustand";
import type { GetApiGoalGoalIdLogs200DataItem } from "@/api-client";

export type LogState = GetApiGoalGoalIdLogs200DataItem & {
	updateLog: (log: GetApiGoalGoalIdLogs200DataItem) => void;
	updateContent: (content: string) => void;
};

export type LogStoreInitialState = Omit<
	LogState,
	"updateLog" | "updateContent"
>;

export const createLogStore = (initialState: LogStoreInitialState) => {
	return create<LogState>((set) => ({
		...initialState,
		updateLog: (log) => {
			set((state) => ({ ...state, ...log }));
		},
		updateContent: (content) => {
			set({ content });
		},
	}));
};

export type GlobalLogState = {
	activeLogId: string | null;
	setActiveLogId: (logId: string | null) => void;
};

export const useGlobalLogStore = create<GlobalLogState>((set) => ({
	activeLogId: null,
	setActiveLogId: (logId) => {
		set({ activeLogId: logId });
	},
}));
