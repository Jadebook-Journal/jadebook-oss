"use client";

import {
	BookIcon,
	CircleIcon,
	DotsThreeIcon,
	PencilSimpleIcon,
	StarIcon,
	TagIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { Coolshape } from "coolshapes-react";
import { generateIconString } from "jadebook/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type {
	GetApiTags200Item,
	PostApiTagsBody,
	PutApiTagsIdBody,
	PutApiTagsIdBodyColor,
	PutApiTagsIdBodyVariant,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { PageSection } from "@/components/app/page";
import { PageContainer } from "@/components/app/page-container";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconSelector } from "@/features/icon/icon-selector";
import { tagColors, tagVariants } from "@/features/tag";
import { RenderTag } from "@/features/tag/tag";
import { cn } from "@/lib/utils";
import { useTagMutations } from "@/mutations/use-tag-mutations";
import { useAppStore } from "@/providers/app-store-provider";

export function TagsPage() {
	return (
		<PageContainer title="Tags">
			<PageSection
				title="Tags"
				description="Used to categorize your journal entries."
				actions={<SettingsTagCreate />}
			>
				<TagsList />
			</PageSection>
		</PageContainer>
	);
}

function TagsList() {
	const { tags } = useAppStore((state) => ({
		tags: state.tags,
	}));

	if (tags.length === 0) {
		return (
			<EmptyContent
				icon={<Coolshape type="star" index={9} noise={true} size={100} />}
				title="No tags found"
				description="Looks like you've got no tags. Create one to start categorizing your journal. You can also create pages so tags act as `folders`."
			/>
		);
	}

	return (
		<SettingsPanel>
			{tags.map((tag) => {
				return (
					<SettingsPanelSection
						key={tag.id}
						title={
							<div className="flex items-center gap-3">
								<RenderTag tag={tag} />

								{tag.pinned && (
									<Tooltip>
										<TooltipTrigger>
											<StarIcon
												weight="duotone"
												size={12}
												className="text-primary"
											/>
										</TooltipTrigger>
										<TooltipContent>Favorite</TooltipContent>
									</Tooltip>
								)}
							</div>
						}
					>
						<SettingsTagOptionsMenu tag={tag} />
					</SettingsPanelSection>
				);
			})}
		</SettingsPanel>
	);
}

export function SettingsTagCreate() {
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const { createTagMutation } = useTagMutations({
		onSuccess: () => {
			setDialogOpen(false);
		},
	});

	function onSubmit(data: PostApiTagsBody) {
		console.log(data);

		createTagMutation.mutate({ data });
	}

	const form = useForm<PostApiTagsBody>({
		defaultValues: {
			label: "",
			variant: "color",
			color: "neutral",
			icon: generateIconString({
				key: "tag",
				weight: "regular",
			}),
		},
		disabled: createTagMutation.isPending,
	});

	const [previewTag, setPreviewTag] = React.useState<PostApiTagsBody>(
		form.getValues(),
	);

	React.useEffect(() => {
		const subscription = form.watch((value) => {
			setPreviewTag(value as PostApiTagsBody);
		});
		return () => subscription.unsubscribe();
	}, [form]);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button size="action">Create tag</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Tag</DialogTitle>
					<DialogDescription>
						Tags are used to categorize your journal entries. You can create a
						tag with a title and a color.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-row gap-4">
							<FormField
								control={form.control}
								name="label"
								render={({ field }) => (
									<FormItem className="grow">
										<FormLabel>Label</FormLabel>
										<FormControl>
											<Input
												placeholder="Travel, Work, Ideas etc..."
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="color"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Color</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-[180px] capitalize">
														<SelectValue placeholder="Color" />
													</SelectTrigger>
												</FormControl>

												<SelectContent>
													{Object.keys(tagColors).map((color) => (
														<SelectItem
															key={`color-${color}`}
															value={color}
															className="capitalize"
														>
															<span className="flex items-center gap-2">
																<CircleIcon
																	weight="fill"
																	size={12}
																	className={cn(
																		tagColors[color as keyof typeof tagColors]
																			.text,
																		"bg-transparent",
																	)}
																/>
																{color}
															</span>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="flex flex-row gap-4">
							<FormField
								control={form.control}
								name="variant"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tag Variant</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-[180px] capitalize">
														<SelectValue placeholder="Color" />
													</SelectTrigger>
												</FormControl>

												<SelectContent>
													{tagVariants.map((variant) => (
														<SelectItem
															key={`variant-${variant}`}
															value={variant}
															className="capitalize"
														>
															{variant}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="icon"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Icon</FormLabel>
										<FormControl>
											<IconSelector
												value={field.value || null}
												onChange={field.onChange}
												emptyState={
													<Button variant="outline">
														<TagIcon size={12} weight="duotone" />
													</Button>
												}
												// we don't use color for tag icons since the color is tracked by the tag color
												valueState={({ Icon, weight, key }) => (
													<Button variant="select">
														<Icon size={12} weight={weight} />
														<span className="capitalize">
															{key.replaceAll("_", " ")}
														</span>
													</Button>
												)}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label>Preview</Label>

							<div className="flex items-center justify-center py-12 bg-muted rounded-lg border">
								<RenderTag
									tag={{
										label: previewTag.label ?? "",
										variant: previewTag.variant,
										color: previewTag.color,
										icon: previewTag.icon || null,
									}}
								/>
							</div>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									variant="outline"
									size="sm"
									disabled={createTagMutation.isPending}
									onClick={() => {
										form.reset();
									}}
								>
									Cancel
								</Button>
							</DialogClose>

							<Button
								variant="default"
								size="sm"
								disabled={createTagMutation.isPending}
								type="submit"
							>
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function SettingsTagOptionsMenu({ tag }: { tag: GetApiTags200Item }) {
	const router = useRouter();

	const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
	const [editDialogOpen, setEditDialogOpen] = React.useState(false);

	const { deleteTagMutation } = useTagMutations({
		onSuccess: () => {
			setConfirmDialogOpen(false);
		},
	});

	const { updateTagMutation } = useTagMutations({
		onSuccess: () => {
			toast.success("Tag updated");
		},
	});

	const disabled = updateTagMutation.isPending || deleteTagMutation.isPending;

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<DotsThreeIcon size={12} weight="bold" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						disabled={disabled}
						onClick={() => {
							setEditDialogOpen(true);
						}}
					>
						<PencilSimpleIcon size={12} />
						Edit
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						disabled={disabled}
						onClick={() => {
							updateTagMutation.mutate({
								id: tag.id,
								data: {
									pinned: !tag.pinned,
								},
							});
						}}
					>
						<StarIcon size={12} />
						{tag.pinned ? "Unfavorite" : "Favorite"}
					</DropdownMenuItem>

					<DropdownMenuItem
						disabled={disabled}
						onClick={() => {
							router.push(`/tags/${tag.id}`);
						}}
					>
						<BookIcon size={12} />
						View Tag Page
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						disabled={disabled}
						variant="destructive"
						onClick={() => {
							setConfirmDialogOpen(true);
						}}
					>
						<TrashIcon size={12} />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmDialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				title="Delete tag"
				description="Are you sure you want to delete this tag? This action cannot be undone."
				onConfirm={() => {
					deleteTagMutation.mutate({ id: tag.id });
				}}
			/>

			<SettingsTagEdit
				tag={tag}
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
			/>
		</>
	);
}

export function SettingsTagEdit({
	tag,
	open,
	onOpenChange,
}: {
	tag: GetApiTags200Item;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { updateTagMutation } = useTagMutations({
		onSuccess: () => {
			onOpenChange(false);
		},
	});

	function onSubmit(data: PutApiTagsIdBody) {
		updateTagMutation.mutate({ id: tag.id, data });
	}

	const form = useForm<PutApiTagsIdBody>({
		defaultValues: {
			label: tag.label,
			variant: tag.variant as PutApiTagsIdBodyVariant,
			color: tag.color as PutApiTagsIdBodyColor,
			icon: tag.icon,
		},
		disabled: updateTagMutation.isPending,
	});

	const [previewTag, setPreviewTag] = React.useState<PutApiTagsIdBody>(
		form.getValues(),
	);

	React.useEffect(() => {
		const subscription = form.watch((value) => {
			setPreviewTag(value as PostApiTagsBody);
		});
		return () => subscription.unsubscribe();
	}, [form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Tag</DialogTitle>
					<DialogDescription>
						Tags are used to categorize your journal entries. You can edit a tag
						with a title and a color.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-row gap-4">
							<FormField
								control={form.control}
								name="label"
								render={({ field }) => (
									<FormItem className="grow">
										<FormLabel>Label</FormLabel>
										<FormControl>
											<Input
												placeholder="Travel, Work, Ideas etc..."
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="color"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Color</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-[180px] capitalize">
														<SelectValue placeholder="Color" />
													</SelectTrigger>
												</FormControl>

												<SelectContent>
													{Object.keys(tagColors).map((color) => (
														<SelectItem
															key={`color-${color}`}
															value={color}
															className="capitalize"
														>
															<span className="flex items-center gap-2">
																<CircleIcon
																	weight="fill"
																	size={12}
																	className={cn(
																		tagColors[color as keyof typeof tagColors]
																			.text,
																		"bg-transparent",
																	)}
																/>
																{color}
															</span>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="flex flex-row gap-4">
							<FormField
								control={form.control}
								name="variant"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tag Variant</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-[180px] capitalize">
														<SelectValue placeholder="Color" />
													</SelectTrigger>
												</FormControl>

												<SelectContent>
													{tagVariants.map((variant) => (
														<SelectItem
															key={`variant-${variant}`}
															value={variant}
															className="capitalize"
														>
															{variant}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="icon"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Icon</FormLabel>
										<FormControl>
											<IconSelector
												value={field.value || null}
												onChange={field.onChange}
												emptyState={
													<Button variant="outline">
														<TagIcon size={12} weight="duotone" />
													</Button>
												}
												// we don't use color for tag icons since the color is tracked by the tag color
												valueState={({ Icon, weight, key }) => (
													<Button variant="select">
														<Icon size={12} weight={weight} />
														<span className="capitalize">
															{key.replaceAll("_", " ")}
														</span>
													</Button>
												)}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label>Preview</Label>

							<div className="flex items-center justify-center py-12 bg-muted rounded-lg border">
								<RenderTag
									tag={{
										label: previewTag.label ?? tag.label,
										variant: previewTag.variant ?? tag.variant,
										color: previewTag.color ?? tag.color,
										icon: previewTag.icon ?? tag.icon,
									}}
								/>
							</div>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									variant="outline"
									size="sm"
									disabled={updateTagMutation.isPending}
									onClick={() => {
										form.reset();
									}}
								>
									Cancel
								</Button>
							</DialogClose>
							<Button
								variant="default"
								size="sm"
								disabled={updateTagMutation.isPending}
								type="submit"
							>
								Update
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
