"use client";

import {
	ArchiveIcon,
	DotsThreeIcon,
	ImageIcon,
	StarIcon,
	TagIcon,
	TargetIcon,
	TrashIcon,
	UploadSimpleIcon,
} from "@phosphor-icons/react";
import { addDays } from "date-fns";
import { getGoalProgress } from "jadebook";
import { ICON_TEXT_COLOR_CLASSNAMES } from "jadebook/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useGetApiGoalsId } from "@/api-client";
import { PageContainer } from "@/components/app/page-container";
import { LogSection } from "@/components/logs/log-components";
import { ErrorRoute } from "@/components/routes/error";
import { PageLoading } from "@/components/routes/loading";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { actionDatePickerStyle, DatePicker } from "@/components/ui/date-picker";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { transparentInputStyle } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AssetsList } from "@/features/assets/assets-list";
import { UploadAssetDialog } from "@/features/assets/upload-asset-dialog";
import { CoverDisplay } from "@/features/cover/cover-display";
import { CoverPicker } from "@/features/cover/cover-picker";
import { IconSelector } from "@/features/icon/icon-selector";
import {
	TagSelector,
	TagSelectorCommandMenu,
} from "@/features/tag/tag-selector";
import { cn } from "@/lib/utils";
import { useGoalMutations } from "@/mutations/use-goal-mutations";
import { useAppStore } from "@/providers/app-store-provider";
import { useAssetStore } from "@/providers/assets-provider";
import { GoalStoreProvider, useGoalStore } from "@/providers/goal-provider";
import { useGoalsStore } from "@/stores/goal-store";
import { useDocumentTitle } from "usehooks-ts";

export function GoalPage({ goalId }: { goalId: string }) {
	const goals = useGoalsStore((store) => store.goals);

	const goal = goals.find((goal) => goal.id === goalId);

	if (!goal) {
		console.log("Goal not found in store, loading from API");

		return <LoadGoalPage goalId={goalId} />;
	}

	console.log("Goal found in store, loading from store", goals);

	return (
		<GoalStoreProvider initialState={{ ...goal }}>
			<InternalGoalPage />
		</GoalStoreProvider>
	);
}

// If we don't have the goal in the store then maybe it's archived or something — manually load it
function LoadGoalPage({ goalId }: { goalId: string }) {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const goalQuery = useGetApiGoalsId(goalId, {
		fetch: {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		},
	});

	if (goalQuery.isLoading) {
		return <PageLoading />;
	}

	if (goalQuery.isError || !goalQuery.data || goalQuery.data.status !== 200) {
		return <ErrorRoute />;
	}

	const goal = goalQuery.data.data;

	return (
		<GoalStoreProvider initialState={{ ...goal }}>
			<InternalGoalPage />
		</GoalStoreProvider>
	);
}

function InternalGoalPage() {
	const goalId = useGoalStore((store) => store.id);
	const createdAt = useGoalStore((store) => store.created_at);
	const endDate = useGoalStore((store) => store.end_date);
	const title = useGoalStore((store) => store.title);
	const cover = useGoalStore((store) => store.cover);
	const tags = useGoalStore((store) => store.tags);
	const state = useGoalStore((store) => store.state);

	const progress = getGoalProgress(createdAt, endDate);

	const { updateGoalMutation } = useGoalMutations({
		goalId,
	});

	// we need to update the document title when the title changes
	useDocumentTitle(title || "Untitled goal");

	return (
		<PageContainer
			title={title}
			actions={
				<div className="flex items-center gap-2">
					<AddAssetButton />
					<AddGoalTag />
					<GoalEndDate />
					<GoalOptionsMenu />
				</div>
			}
			externalContent={
				<CoverDisplay cover={cover} actions={<CoverPickerButton />} />
			}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4 shrink-0">
					<IconSelectorButton />

					<div className="grow space-y-0.5">
						<p className="text-xs italic text-muted-foreground">{state}</p>

						<GoalTitle />
					</div>
				</div>

				<div className="hidden @sm:block">
					<div className="flex items-center gap-1">
						<p className="text-xs text-muted-foreground">{progress}%</p>
						<div className="w-24">
							<Progress value={progress} />
						</div>
					</div>
				</div>
			</div>

			<GoalDescription />

			{tags && tags.length > 0 && (
				<div className="-mt-3">
					<TagSelector
						value={tags}
						onValueChange={(tags) => {
							updateGoalMutation.mutate({
								id: goalId,
								data: {
									tags,
								},
							});
						}}
					/>
				</div>
			)}

			<AssetsList entityType="goal" entityId={goalId} />

			<Separator />

			<LogSection />
		</PageContainer>
	);
}

function CoverPickerButton({ children }: { children?: React.ReactNode }) {
	const goalId = useGoalStore((store) => store.id);
	const cover = useGoalStore((store) => store.cover);

	const { updateGoalMutation } = useGoalMutations({
		goalId,
	});

	return (
		<CoverPicker
			cover={cover}
			onValueChange={(value) => {
				updateGoalMutation.mutate({
					id: goalId,
					data: {
						cover: value,
					},
				});
			}}
		>
			{children}
		</CoverPicker>
	);
}

function IconSelectorButton() {
	const goalId = useGoalStore((store) => store.id);
	const icon = useGoalStore((store) => store.icon);

	const { updateGoalMutation } = useGoalMutations({
		goalId,
	});

	return (
		<IconSelector
			includeColor
			value={icon}
			onChange={(value) => {
				updateGoalMutation.mutate({
					id: goalId,
					data: {
						icon: value,
					},
				});
			}}
			emptyState={
				<Button variant="logo" size="logo" className="hover:border-primary">
					<TargetIcon
						size={24}
						weight="bold"
						className={ICON_TEXT_COLOR_CLASSNAMES.primary}
					/>
				</Button>
			}
			valueState={({ Icon, color, weight }) => (
				<Button variant="logo" size="logo" className="hover:border-primary">
					<Icon
						size={24}
						weight={weight}
						className={ICON_TEXT_COLOR_CLASSNAMES[color]}
					/>
				</Button>
			)}
		/>
	);
}

function GoalTitle() {
	const title = useGoalStore((store) => store.title);
	const goalId = useGoalStore((store) => store.id);

	const { updateGoalMutation } = useGoalMutations({
		goalId,
	});

	return (
		<input
			className={cn(transparentInputStyle, "text-lg font-medium")}
			defaultValue={title}
			onBlur={(e) => {
				updateGoalMutation.mutate({
					id: goalId,
					data: {
						title: e.target.value,
					},
				});
			}}
		/>
	);
}

function GoalDescription() {
	const description = useGoalStore((store) => store.description);
	const goalId = useGoalStore((store) => store.id);

	const { updateGoalMutation } = useGoalMutations({
		goalId,
	});

	return (
		<textarea
			rows={3}
			placeholder="Add a description to this goal"
			className={cn(transparentInputStyle, "text-sm focus:py-2 min-h-16")}
			defaultValue={description || undefined}
			onBlur={(e) => {
				updateGoalMutation.mutate({
					id: goalId,
					data: {
						description: e.target.value,
					},
				});
			}}
		/>
	);
}

function GoalEndDate() {
	const endDate = useGoalStore((store) => store.end_date);
	const goalId = useGoalStore((store) => store.id);

	const { updateGoalMutation } = useGoalMutations({
		goalId,
	});

	const [date, setDate] = useState(new Date(endDate));

	React.useEffect(() => {
		setDate(new Date(endDate));
	}, [endDate]);

	return (
		<DatePicker
			tooltip="End date"
			label="End date"
			className={cn(actionDatePickerStyle)}
			date={date}
			setDate={(date) => {
				setDate(date);

				updateGoalMutation.mutate({
					id: goalId,
					data: {
						end_date: date.toISOString(),
					},
				});
			}}
			disabled={(date) => date < addDays(new Date(), 1)}
		/>
	);
}

function AddGoalTag() {
	const tags = useGoalStore((store) => store.tags);
	const goalId = useGoalStore((store) => store.id);

	const [open, setOpen] = React.useState(false);

	const { updateGoalMutation } = useGoalMutations({
		goalId,
	});

	if (tags && tags.length > 0) {
		return null;
	}

	return (
		<>
			<Button
				variant="action"
				size="action"
				onClick={() => {
					setOpen(true);
				}}
			>
				<TagIcon /> Add Tag
			</Button>

			<TagSelectorCommandMenu
				open={open}
				setOpen={setOpen}
				value={[]}
				onValueChange={(tag) => {
					updateGoalMutation.mutate({
						id: goalId,
						data: {
							tags: [tag],
						},
					});
				}}
			/>
		</>
	);
}

function GoalOptionsMenu() {
	const cover = useGoalStore((store) => store.cover);
	const state = useGoalStore((store) => store.state);
	const goalId = useGoalStore((store) => store.id);
	const pinned = useGoalStore((store) => store.pinned);
	const { updateGoalMutation, deleteGoalMutation } = useGoalMutations({
		goalId,
	});

	const defaultCover = "color:beige";

	const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
							updateGoalMutation.mutate({
								id: goalId,
								data: {
									pinned: !pinned,
								},
							});
						}}
					>
						<StarIcon size={16} weight="bold" />
						{pinned ? "Unfavorite" : "Favorite"}
					</DropdownMenuItem>

					{!cover && (
						<DropdownMenuItem
							onSelect={() => {
								updateGoalMutation.mutate({
									id: goalId,
									data: {
										cover: defaultCover,
									},
								});
							}}
						>
							<ImageIcon size={16} weight="bold" />
							Add cover
						</DropdownMenuItem>
					)}

					<DropdownMenuSeparator />

					{state === "active" && (
						<DropdownMenuItem
							variant="destructive"
							onSelect={() => {
								setArchiveDialogOpen(true);
							}}
						>
							<ArchiveIcon size={16} weight="bold" />
							Archive
						</DropdownMenuItem>
					)}

					<DropdownMenuItem
						variant="destructive"
						onSelect={() => {
							setDeleteDialogOpen(true);
						}}
					>
						<TrashIcon size={16} weight="bold" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmDialog
				open={archiveDialogOpen}
				onOpenChange={setArchiveDialogOpen}
				title="Archive goal"
				description="Are you sure you want to archive this goal? Archiving let's you see this goal in the future but updating it will be disabled. This action cannot be undone."
				onConfirm={() => {
					updateGoalMutation.mutate({
						id: goalId,
						data: {
							state: "archived",
						},
					});
				}}
			/>

			<ConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title="Delete goal"
				description="Are you sure you want to delete this goal? We generally recommend archiving instead. This action cannot be undone."
				onConfirm={() => {
					deleteGoalMutation.mutate({
						id: goalId,
					});
				}}
			/>
		</>
	);
}

function AddAssetButton() {
	const goalId = useGoalStore((store) => store.id);

	const [open, setOpen] = React.useState(false);

	const { assets } = useAssetStore((store) => ({
		assets: store.assets,
	}));

	if (assets && assets.length > 0) {
		return null;
	}

	return (
		<>
			<Button
				variant="action"
				size="action"
				onClick={() => {
					setOpen(true);
				}}
			>
				<UploadSimpleIcon /> Add Asset
			</Button>

			<UploadAssetDialog
				open={open}
				setOpen={setOpen}
				onSuccess={() => {
					toast.success("Asset uploaded");

					setOpen(false);
				}}
				entityType="goal"
				entityId={goalId}
			/>
		</>
	);
}
