"use client";

import {
	DotsThreeIcon,
	InfoIcon,
	MicrophoneIcon,
	StarIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import React from "react";
import { useGlobalEntryStore } from "@/stores/global-entry-store";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BrowserTranscriptionDialog } from "./browser-transcription-dialog";
import { EntryInformationDialog } from "./information-dialog";
import { useEntryMutations } from "@/mutations/use-entry-mutations";

export function OptionsMenu() {
	const entryId = useGlobalEntryStore((store) => store.id);
	const pinned = useGlobalEntryStore((store) => store.pinned);

	const { updateEntryMutation, deleteEntryMutation } = useEntryMutations();

	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [informationDialogOpen, setInformationDialogOpen] =
		React.useState(false);
	const [browserTranscriptionDialogOpen, setBrowserTranscriptionDialogOpen] =
		React.useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="action" size="iconAction">
						<DotsThreeIcon size={16} weight="bold" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-48" align="end">
					<DropdownMenuItem
						onSelect={() => {
							setInformationDialogOpen(true);
						}}
					>
						<InfoIcon size={16} weight="bold" />
						Information
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={() => {
							updateEntryMutation.mutate({
								id: entryId,
								data: { pinned: !pinned },
							});
						}}
					>
						<StarIcon size={16} weight="bold" />
						{pinned ? "Unfavorite" : "Favorite"}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onSelect={() => {
							setBrowserTranscriptionDialogOpen(true);
						}}
					>
						<MicrophoneIcon size={16} weight="bold" />
						Transcription
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						variant="destructive"
						onSelect={() => setDeleteDialogOpen(true)}
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
						id: entryId,
					});
				}}
			/>

			<EntryInformationDialog
				open={informationDialogOpen}
				onOpenChange={setInformationDialogOpen}
			/>

			<BrowserTranscriptionDialog
				open={browserTranscriptionDialogOpen}
				onOpenChange={setBrowserTranscriptionDialogOpen}
			/>
		</>
	);
}
