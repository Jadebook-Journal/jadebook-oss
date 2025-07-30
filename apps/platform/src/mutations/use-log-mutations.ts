import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type GetApiGoalGoalIdLogs200DataItem,
	getDeleteApiGoalGoalIdLogsIdMutationOptions,
	getGetApiGoalGoalIdLogsQueryKey,
	getPutApiGoalGoalIdLogsIdMutationOptions,
} from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";
import { useGoalStoreOptional } from "@/providers/goal-provider";
import { useLogStore } from "@/providers/log-provider";

/**
 * handles log mutations and there optimistic updates + side effects
 */
export function useLogMutations({
	log,
}: {
	log: GetApiGoalGoalIdLogs200DataItem;
}) {
	const queryClient = useQueryClient();

	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const logStore = useGoalStoreOptional((store) => ({
		logs: store.logs,
		updateLogs: store.updateLogs,
	}));

	const { updateLog } = useLogStore((store) => ({
		updateLog: store.updateLog,
	}));

	const updateLogMutation = useMutation({
		...getPutApiGoalGoalIdLogsIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			const newLog = { ...log, ...data.data, id: log.id };

			updateLog(newLog);
		},
		onSuccess: (data) => {
			if (data.status !== 200) {
				return;
			}

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalGoalIdLogsQueryKey(log.id),
			});
		},
		onError: (error) => {
			console.error(error);

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalGoalIdLogsQueryKey(log.id),
			});
		},
	});

	const deleteLogMutation = useMutation({
		...getDeleteApiGoalGoalIdLogsIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: () => {
			if (!logStore) {
				throw new Error("Log store not found");
			}

			const { logs, updateLogs } = logStore;

			const newLogs = logs.filter((l) => l.id !== log.id);

			updateLogs(newLogs);
		},
		onSuccess: (data) => {
			if (data.status !== 200) {
				return;
			}

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalGoalIdLogsQueryKey(log.id),
			});
		},
		onError: (error) => {
			console.error(error);

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalGoalIdLogsQueryKey(log.id),
			});
		},
	});

	return {
		updateLogMutation,
		deleteLogMutation,
	};
}
