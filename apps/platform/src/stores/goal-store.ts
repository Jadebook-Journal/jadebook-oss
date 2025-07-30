import { create } from "zustand";
import type {
	GetApiGoalGoalIdLogs200DataItem,
	GetApiGoals200Item,
} from "@/api-client";

export interface GoalsState {
	goals: GetApiGoals200Item[];
	updateGoals: (goals: GetApiGoals200Item[]) => void;
}

export const useGoalsStore = create<GoalsState>((set) => ({
	goals: [],
	updateGoals: (goals) => {
		set({ goals });
	},
}));

export type GoalState = GetApiGoals200Item & {
	updateGoal: (goal: GetApiGoals200Item) => void;
	// we include the goal's logs within the goal store
	logs: GetApiGoalGoalIdLogs200DataItem[];
	updateLogs: (logs: GetApiGoalGoalIdLogs200DataItem[]) => void;
	updatePartialGoal: (goal: Partial<GetApiGoals200Item>) => void;
};

export type GoalStoreInitialState = Omit<
	GoalState,
	"logs" | "updateGoal" | "updateLogs" | "updatePartialGoal"
>;

export const createGoalStore = (initialState: GoalStoreInitialState) => {
	return create<GoalState>((set) => ({
		...initialState,
		logs: [],
		updateLogs: (logs) => {
			set({ logs });
		},
		updateGoal: (goal) => {
			set((state) => ({ ...state, ...goal }));
		},
		updatePartialGoal: (goal) => {
			set((state) => ({ ...state, ...goal }));
		},
	}));
};
