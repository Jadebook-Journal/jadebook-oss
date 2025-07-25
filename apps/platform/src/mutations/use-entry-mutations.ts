import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	type GetApiEntriesId200,
	type GetApiMiscPinned200,
	getDeleteApiEntriesIdMutationOptions,
	getGetApiEntriesQueryKey,
	getGetApiMiscPinnedQueryKey,
	getPostApiEntriesMutationOptions,
	getPutApiEntriesIdMutationOptions,
} from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";
import { useJournalStore } from "@/stores/journal-store";
import { useGlobalEntryStore } from "@/stores/global-entry-store";

/**
 * handles entry mutations and there optimistic updates + side effects
 */
export function useEntryMutations() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { pinnedResources, updatePinnedResources, session } = useAppStore(
		(store) => ({
			pinnedResources: store.pinnedResources,
			updatePinnedResources: store.updatePinnedResources,
			session: store.session,
		}),
	);

	const entryId = useGlobalEntryStore((store) => store.id);
	const pinned = useGlobalEntryStore((store) => store.pinned);
	const title = useGlobalEntryStore((store) => store.title);
	const type = useGlobalEntryStore((store) => store.type);
	const icon = useGlobalEntryStore((store) => store.icon);
	const updatePinned = useGlobalEntryStore((store) => store.updatePinned);

	const journal = useJournalStore((store) => store.journal);
	const updateJournal = useJournalStore((store) => store.updateJournal);

	const createEntryMutation = useMutation({
		...getPostApiEntriesMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onSuccess: (data, variables) => {
			if (data.status !== 201) {
				return;
			}

			queryClient.invalidateQueries({
				queryKey: getGetApiEntriesQueryKey(),
			});

			const newEntry: GetApiEntriesId200 = {
				id: data.data.id,
				user_id: session.user.id,
				title: variables.data.title,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				entry_date: new Date().toISOString(),
				tags: null,
				excerpt: null,
				content: null,
				character_count: 0,
				pinned: false,
				type: variables.data.type,
				icon: null,
				cover: null,
			};

			updateJournal([...journal, newEntry]);

			router.push(`/journal/${newEntry.id}`);
		},
		onError: (error) => {
			console.error(error);

			toast.error("Failed to create journal entry");
		},
	});

	const updateEntryMutation = useMutation({
		...getPutApiEntriesIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (variables) => {
			// optimistic update - update journal
			updateJournal(
				journal.map((entry) =>
					entry.id === entryId ? { ...entry, ...variables.data } : entry,
				),
			);

			// optimistic update - update pinned resources
			if (variables.data.pinned !== undefined) {
				updatePinned(variables.data.pinned);

				if (variables.data.pinned) {
					updatePinnedResources({
						...pinnedResources,
						entries: [
							...pinnedResources.entries,
							{
								id: entryId,
								title: title,
								type: type,
								icon: icon,
								pinned: variables.data.pinned,
							},
						],
					});
				} else {
					updatePinnedResources({
						...pinnedResources,
						entries: pinnedResources.entries.filter(
							(resource) => resource.id !== entryId,
						),
					});
				}
			}
		},
		onSuccess: () => {
			toast.success("Entry updated");

			queryClient.invalidateQueries({
				queryKey: getGetApiMiscPinnedQueryKey(),
			});

			queryClient.invalidateQueries({
				queryKey: getGetApiEntriesQueryKey(),
			});
		},
		onError: (_error, variables) => {
			toast.error("Failed to update entry");

			// revert optimistic update
			const previousPinnedResources = queryClient.getQueryData(
				getGetApiMiscPinnedQueryKey(),
			);

			const previousJournal = queryClient.getQueryData(
				getGetApiEntriesQueryKey(),
			);

			// undo optimistic update
			if (variables.data.pinned !== undefined) {
				updatePinned(!variables.data.pinned);
			}

			if (
				previousPinnedResources &&
				typeof previousPinnedResources === "object"
			) {
				updatePinnedResources(previousPinnedResources as GetApiMiscPinned200);
			}

			if (previousJournal && typeof previousJournal === "object") {
				updateJournal(previousJournal as GetApiEntriesId200[]);
			}
		},
	});

	const deleteEntryMutation = useMutation({
		...getDeleteApiEntriesIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: () => {
			// optimistic update - update journal
			updateJournal(journal.filter((entry) => entry.id !== entryId));

			// optimistic update - update pinned resources
			if (pinned) {
				updatePinnedResources({
					...pinnedResources,
					entries: pinnedResources.entries.filter(
						(resource) => resource.id !== entryId,
					),
				});
			}
		},
		onSuccess: () => {
			toast.success("Entry deleted");

			queryClient.invalidateQueries({
				queryKey: getGetApiMiscPinnedQueryKey(),
			});

			queryClient.invalidateQueries({
				queryKey: getGetApiEntriesQueryKey(),
			});
		},
		onError: () => {
			toast.error("Failed to delete entry");

			// revert optimistic update
			const previousPinnedResources = queryClient.getQueryData(
				getGetApiMiscPinnedQueryKey(),
			);

			const previousJournal = queryClient.getQueryData(
				getGetApiEntriesQueryKey(),
			);

			if (
				previousPinnedResources &&
				typeof previousPinnedResources === "object"
			) {
				updatePinnedResources(previousPinnedResources as GetApiMiscPinned200);
			}

			if (previousJournal && typeof previousJournal === "object") {
				updateJournal(previousJournal as GetApiEntriesId200[]);
			}
		},
	});

	return {
		createEntryMutation,
		updateEntryMutation,
		deleteEntryMutation,
	};
}
