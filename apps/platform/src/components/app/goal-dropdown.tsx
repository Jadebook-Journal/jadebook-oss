"use client";

import { PencilIcon, StarIcon, TrashIcon } from "@phosphor-icons/react";
import type { DropdownMenuContent as DropdownMenuContentPrimitive } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { toast } from "sonner";
import type { GetApiMiscPinned200GoalsItem } from "@/api-client";
import { useGoalMutations } from "@/mutations/use-goal-mutations";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

export function GoalActionDropdown(props: {
	goal: GetApiMiscPinned200GoalsItem;
	children: React.ReactNode;
	side?: React.ComponentProps<typeof DropdownMenuContentPrimitive>["side"];
}) {
	const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const { updateGoalMutation, deleteGoalMutation } = useGoalMutations({
		goalId: props.goal.id,
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
							updateGoalMutation.mutate({
								id: props.goal.id,
								data: { pinned: !props.goal.pinned },
							});
						}}
					>
						<StarIcon size={16} weight="bold" />
						{props.goal.pinned ? "Unfavorite" : "Favorite"}
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
				title="Delete Goal"
				description="Are you sure you want to delete this goal? We generally recommend archiving instead. This action cannot be undone."
				onConfirm={() => {
					deleteGoalMutation.mutate({
						id: props.goal.id,
					});
				}}
			/>

			<Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Rename Goal</DialogTitle>
					</DialogHeader>

					<div className="py-4">
						<Input
							ref={inputRef}
							defaultValue={props.goal.title ?? undefined}
							placeholder="Untitled goal"
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

								await updateGoalMutation.mutateAsync({
									id: props.goal.id,
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
