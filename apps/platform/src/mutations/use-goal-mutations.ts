import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	type GetApiGoalGoalIdLogs200DataItem,
	getDeleteApiGoalsIdMutationOptions,
	getGetApiGoalGoalIdLogsQueryKey,
	getGetApiGoalsIdQueryKey,
	getGetApiGoalsQueryKey,
	getGetApiMiscPinnedQueryKey,
	getPostApiGoalGoalIdLogsMutationOptions,
	getPutApiGoalsIdMutationOptions,
} from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";
import { useGoalStoreOptional } from "@/providers/goal-provider";
import { useGoalsStore } from "@/stores/goal-store";

/**
 * Can only be used within GoalStoreProvider
 *
 * handles goal mutations and there optimistic updates + side effects
 */
export function useGoalMutations({ goalId }: { goalId: string }) {
	const queryClient = useQueryClient();

	const { session, pinnedResources, updatePinnedResources } = useAppStore(
		(store) => ({
			session: store.session,
			pinnedResources: store.pinnedResources,
			updatePinnedResources: store.updatePinnedResources,
		}),
	);

	// this is global
	const globalGoals = useGoalsStore((store) => store.goals);
	const updateGoals = useGoalsStore((store) => store.updateGoals);

	// this is tied to the provider
	const conditionalGoal = useGoalStoreOptional((store) => store);

	const updateGoalMutation = useMutation({
		...getPutApiGoalsIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			// unpin can occur from outside the goal context
			if (data.data.pinned === false) {
				updatePinnedResources({
					...pinnedResources,
					goals: pinnedResources.goals.filter((goal) => goal.id !== goalId),
				});
			}

			if (!conditionalGoal) {
				return;
			}

			if (data.data.pinned === true) {
				updatePinnedResources({
					...pinnedResources,
					goals: [
						...pinnedResources.goals,
						{
							id: goalId,
							title: data.data.title ?? "",
							pinned: true,
							icon: data.data.icon ?? null,
						},
					],
				});
			}

			// biome-ignore lint/correctness/noUnusedVariables: we need to destructure the goal store to get the goal
			const { updateGoal, updateLogs, updatePartialGoal, logs, ...goal } =
				conditionalGoal;

			const newGoal = { ...goal, ...data.data, id: goal.id };

			updateGoal(newGoal);

			// optimistic update
			const global = globalGoals.filter((g) => g.id !== newGoal.id);

			updateGoals([...global, newGoal]);
		},
		onSuccess: (data, variables) => {
			if (data.status !== 200) {
				return;
			}

			if (
				variables.data.pinned ||
				variables.data.title ||
				variables.data.icon
			) {
				queryClient.invalidateQueries({
					queryKey: getGetApiMiscPinnedQueryKey(),
				});
			}

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsQueryKey(),
			});

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsIdQueryKey(goalId),
			});
		},
		onError: (error, variables) => {
			toast.error("Failed to update goal");

			console.error(error);

			if (variables.data.pinned !== undefined) {
				queryClient.invalidateQueries({
					queryKey: getGetApiMiscPinnedQueryKey(),
				});
			}

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsQueryKey(),
			});

			// optimistic update
			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsIdQueryKey(goalId),
			});
		},
	});

	const deleteGoalMutation = useMutation({
		...getDeleteApiGoalsIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			updatePinnedResources({
				...pinnedResources,
				goals: pinnedResources.goals.filter((goal) => goal.id !== goalId),
			});

			// optimistic update
			const global = globalGoals.filter((g) => g.id !== goalId);

			updateGoals([...global]);
		},
		onSuccess: (data) => {
			if (data.status !== 200) {
				return;
			}

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsQueryKey(),
			});

			// optimistic update
			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsIdQueryKey(goalId),
			});
		},
		onError: (error) => {
			console.error(error);

			toast.error("Failed to delete goal");

			queryClient.invalidateQueries({
				queryKey: getGetApiMiscPinnedQueryKey(),
			});

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsQueryKey(),
			});

			// optimistic update
			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsIdQueryKey(goalId),
			});
		},
	});

	const createLogMutation = useMutation({
		...getPostApiGoalGoalIdLogsMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			if (!conditionalGoal) {
				throw new Error("Goal store not found");
			}

			const { updateLogs, logs } = conditionalGoal;

			// create a temp log to be used for the editor
			// it'll be auto disabled always
			const newLog: GetApiGoalGoalIdLogs200DataItem = {
				id: "temp",
				goal_id: goalId,
				user_id: session.user.id,
				content: data.data.content || null,
				type: data.data.type || "neutral",
				created_at: new Date().toISOString(),
			};

			// remove the transient log and replace it with the temp one
			const filteredLogs = logs.filter((l) => l.id !== "transient");

			updateLogs([newLog, ...filteredLogs]);
		},
		onSuccess: (data) => {
			if (data.status !== 201) {
				return;
			}

			// will remove the temp/transient logs automatically
			queryClient.invalidateQueries({
				queryKey: getGetApiGoalGoalIdLogsQueryKey(goalId),
			});
		},
		onError: (error) => {
			toast.error("Failed to create log");

			console.error(error);

			if (!conditionalGoal) {
				return;
			}

			const { updateLogs, logs } = conditionalGoal;

			// we don't invalidate the logs query because we don't want to remove the user's content
			// instead we find the temp log, and rename it to transient
			const tempLog = logs.find((l) => l.id === "temp");
			const filteredLogs = logs.filter((l) => l.id !== "temp");

			if (tempLog) {
				updateLogs([{ ...tempLog, id: "transient" }, ...filteredLogs]);
			}
		},
	});

	return {
		updateGoalMutation,
		createLogMutation,
		deleteGoalMutation,
	};
}
