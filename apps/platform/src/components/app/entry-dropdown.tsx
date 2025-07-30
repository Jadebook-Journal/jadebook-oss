"use client";

import { PencilIcon, StarIcon, TrashIcon } from "@phosphor-icons/react";
import type { DropdownMenuContent as DropdownMenuContentPrimitive } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import {
	type GetApiEntriesId200,
	type GetApiMiscPinned200,
	getDeleteApiEntriesIdMutationOptions,
	getGetApiEntriesQueryKey,
	getGetApiMiscPinnedQueryKey,
	getPutApiEntriesIdMutationOptions,
} from "@/api-client";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/providers/app-store-provider";
import { useJournalStore } from "@/stores/journal-store";

export function EntryActionDropdown(props: {
	entry: Pick<GetApiEntriesId200, "id" | "pinned" | "title" | "type" | "icon">;
	children: React.ReactNode;
	side?: React.ComponentProps<typeof DropdownMenuContentPrimitive>["side"];
}) {
	const queryClient = useQueryClient();

	const { pinnedResources, updatePinnedResources, session } = useAppStore(
		(store) => ({
			pinnedResources: store.pinnedResources,
			updatePinnedResources: store.updatePinnedResources,
			session: store.session,
		}),
	);

	const journal = useJournalStore((store) => store.journal);
	const updateJournal = useJournalStore((store) => store.updateJournal);

	const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

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
					entry.id === props.entry.id ? { ...entry, ...variables.data } : entry,
				),
			);

			// optimistic update - update pinned resources
			if (variables.data.pinned !== undefined) {
				if (variables.data.pinned) {
					updatePinnedResources({
						...pinnedResources,
						entries: [...pinnedResources.entries, props.entry],
					});
				} else {
					updatePinnedResources({
						...pinnedResources,
						entries: pinnedResources.entries.filter(
							(resource) => resource.id !== props.entry.id,
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
		onError: () => {
			toast.error("Failed to update entry");

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
			updateJournal(journal.filter((entry) => entry.id !== props.entry.id));

			// optimistic update - update pinned resources
			if (props.entry.pinned) {
				updatePinnedResources({
					...pinnedResources,
					entries: pinnedResources.entries.filter(
						(resource) => resource.id !== props.entry.id,
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

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
				<DropdownMenuContent side={props.side}>
					<DropdownMenuItem
						onClick={() => {
							setRenameDialogOpen(true);
						}}
					>
						<PencilIcon size={16} weight="bold" />
						Rename
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							updateEntryMutation.mutate({
								id: props.entry.id,
								data: { pinned: !props.entry.pinned },
							});
						}}
					>
						<StarIcon size={16} weight="bold" />
						{props.entry.pinned ? "Unfavorite" : "Favorite"}
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => {
							setDeleteDialogOpen(true);
						}}
					>
						<TrashIcon size={16} weight="bold" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title="Delete Entry"
				description="Are you sure you want to delete this entry?"
				onConfirm={() => {
					deleteEntryMutation.mutate({
						id: props.entry.id,
					});
				}}
			/>

			<Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Rename Entry</DialogTitle>
					</DialogHeader>

					<div className="py-4">
						<Input
							ref={inputRef}
							defaultValue={props.entry.title ?? undefined}
							placeholder="Untitled entry"
						/>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="ghost">Cancel</Button>
						</DialogClose>

						<Button
							onClick={async () => {
								if (!inputRef.current?.value) {
									toast.warning("Please enter a valid title");

									return;
								}

								await updateEntryMutation.mutateAsync({
									id: props.entry.id,
									data: {
										title: inputRef.current.value,
									},
								});

								setRenameDialogOpen(false);
							}}
						>
							Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
