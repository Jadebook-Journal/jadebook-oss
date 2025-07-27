"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useAppStore } from "@/providers/app-store-provider";
import {
	type GlobalEntryState,
	useGlobalEntryStore,
} from "@/stores/global-entry-store";
import {
	getGetApiEntriesIdQueryKey,
	getPutApiEntriesIdMutationOptions,
} from "@/api-client";

// Handles the syncing of the journal document
export function SaveLayer() {
	const pathname = usePathname();
	const entryState = useGlobalEntryStore();
	const entryId = entryState.id;
	const queryClient = useQueryClient();

	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	// Track the last synced entry state
	const [lastSyncedEntry, setLastSyncedEntry] = React.useState<Omit<
		GlobalEntryState,
		| "updateEntry"
		| "updateId"
		| "updateUserId"
		| "updateTitle"
		| "updateCreatedAt"
		| "updateUpdatedAt"
		| "updateEntryDate"
		| "updateCover"
		| "updateTags"
		| "updateContent"
		| "updateCharacterCount"
		| "updateExcerpt"
		| "updatePinned"
		| "updateType"
		| "updateIcon"
	> | null>(null);

	// Check if entry has changes compared to last synced version
	const hasChanges = React.useMemo(() => {
		if (!entryId) return false;

		if (!lastSyncedEntry) return true;

		// Compare relevant fields that would indicate changes
		return (
			entryState.title !== lastSyncedEntry.title ||
			entryState.content !== lastSyncedEntry.content ||
			entryState.cover !== lastSyncedEntry.cover ||
			JSON.stringify(entryState.tags) !==
				JSON.stringify(lastSyncedEntry.tags) ||
			entryState.entry_date !== lastSyncedEntry.entry_date ||
			entryState.pinned !== lastSyncedEntry.pinned ||
			entryState.icon !== lastSyncedEntry.icon
		);
	}, [entryState, lastSyncedEntry, entryId]);

	const updateEntryMutation = useMutation({
		...getPutApiEntriesIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onSuccess: () => {
			// After successful save, update the last synced entry
			setLastSyncedEntry({
				id: entryState.id,
				user_id: entryState.user_id,
				title: entryState.title,
				created_at: entryState.created_at,
				updated_at: entryState.updated_at,
				entry_date: entryState.entry_date,
				cover: entryState.cover,
				tags: entryState.tags,
				content: entryState.content,
				character_count: entryState.character_count,
				excerpt: entryState.excerpt,
				pinned: entryState.pinned,
				type: entryState.type,
				icon: entryState.icon,
			});

			queryClient.invalidateQueries({
				queryKey: getGetApiEntriesIdQueryKey(entryId),
			});
		},
		onError: (error) => {
			toast.error("Failed to save entry", {
				description: error.message,
			});
		},
	});

	// Save entry to server
	const saveEntry = React.useCallback(() => {
		if (!entryId || !hasChanges || updateEntryMutation.isPending) {
			console.log({
				hasChanges,
				entryId,
			});

			return;
		}

		// Prepare entry data for API matching PutApiEntriesIdBody
		const entryData = {
			title: entryState.title,
			content: entryState.content,
			entry_date: entryState.entry_date,
			cover: entryState.cover,
			tags: entryState.tags,
			pinned: entryState.pinned,
			icon: entryState.icon,
			character_count: entryState.character_count,
			excerpt: entryState.excerpt,
		};

		updateEntryMutation.mutate({
			id: entryId,
			data: entryData,
		});
	}, [entryId, hasChanges, entryState, updateEntryMutation]);

	// Auto-save every 10 seconds
	React.useEffect(() => {
		if (!entryId) return;

		const interval = setInterval(() => {
			saveEntry();
		}, 10000); // 10 seconds

		return () => clearInterval(interval);
	}, [entryId, saveEntry]);

	// Save on Cmd+S / Ctrl+S
	React.useEffect(() => {
		if (!entryId) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "s") {
				event.preventDefault();

				saveEntry();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [entryId, saveEntry]);

	// Save on page leave
	React.useEffect(() => {
		if (!entryId) return;

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			// Only block leaving if there are unsaved changes
			if (hasChanges) {
				saveEntry();

				event.preventDefault();
				event.returnValue = true;
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [entryId, saveEntry, hasChanges]);

	// Track pathname changes for client-side navigation saves
	const previousPathnameRef = React.useRef(pathname);

	React.useEffect(() => {
		if (!entryId) return;

		// Save when pathname changes (client-side navigation)
		if (previousPathnameRef.current !== pathname) {
			saveEntry();
			previousPathnameRef.current = pathname;
		}
	}, [pathname, entryId, saveEntry]);

	return null;
}
