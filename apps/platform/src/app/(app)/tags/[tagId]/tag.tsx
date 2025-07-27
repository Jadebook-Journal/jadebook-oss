"use client";

import {
	ArrowRightIcon,
	DotsThreeIcon,
	ImageIcon,
	StarIcon,
	TagIcon,
	TargetIcon,
} from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Coolshape } from "coolshapes-react";
import { generateCover, getGoalProgress } from "jadebook";
import { getParsedIcon } from "jadebook/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import {
	type GetApiEntries200DataItem,
	type GetApiTags200Item,
	getGetApiEntriesQueryKey,
	getGetApiTagsQueryKey,
	getPostApiEntriesMutationOptions,
	getPutApiTagsIdMutationOptions,
	useGetApiEntriesInfinite,
	useGetApiTagsIdGoals,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { JournalView } from "@/components/app/journal-view";
import { PageSection } from "@/components/app/page";
import { PageContainer } from "@/components/app/page-container";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoverDisplay } from "@/features/cover/cover-display";
import { CoverPicker } from "@/features/cover/cover-picker";
import { RenderTag } from "@/features/tag/tag";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/providers/app-store-provider";
import { useJournalStore } from "@/stores/journal-store";
import { ErrorRoute } from "@/components/routes/error";
import { PageLoading } from "@/components/routes/loading";

export function TagPage({ tagId }: { tagId: string }) {
	const { tags } = useAppStore((store) => ({
		tags: store.tags,
	}));

	const tag = tags.find((tag) => tag.id === tagId);

	if (!tag) {
		console.log("Tag not found", tagId, tags);
		return <ErrorRoute />;
	}

	return <InternalTagPage tag={tag} />;
}

function InternalTagPage({ tag }: { tag: GetApiTags200Item }) {
	return (
		<PageContainer
			title={tag.label}
			actions={
				<div className="flex gap-3 items-center">
					<CreateEntryButton tag={tag} />
					<TagOptionsMenu tag={tag} />
				</div>
			}
			externalContent={
				<CoverDisplay
					cover={tag.cover}
					actions={<CoverPickerButton tag={tag} />}
				/>
			}
		>
			<TagHeader tag={tag} />

			<Goals tag={tag} />

			<Journals tag={tag} />
		</PageContainer>
	);
}

function CoverPickerButton({
	children,
	tag,
}: {
	children?: React.ReactNode;
	tag: GetApiTags200Item;
}) {
	// we don't have react-query to act as a source of truth that we can rollback to
	// in case of a mutation error — This is a workaround.
	const initialTag = React.useRef(tag);

	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const { updateTag } = useAppStore((store) => ({
		updateTag: store.updateTag,
	}));

	const updateTagMutation = useMutation({
		...getPutApiTagsIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			updateTag({ ...tag, ...data.data });
		},
		onSuccess: (data) => {
			initialTag.current = { ...tag, ...data.data };
		},
		onError: (error) => {
			console.error(error);

			updateTag(initialTag.current);
		},
	});

	return (
		<CoverPicker
			cover={tag.cover}
			onValueChange={(value) => {
				updateTagMutation.mutate({
					id: tag.id,
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

function TagOptionsMenu({ tag }: { tag: GetApiTags200Item }) {
	const queryClient = useQueryClient();
	const router = useRouter();

	// we don't have react-query to act as a source of truth that we can rollback to
	// in case of a mutation error — This is a workaround.
	const initialTag = React.useRef(tag);

	const defaultCover = generateCover({
		type: "color",
		value: "beige",
	});

	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const { updateTag } = useAppStore((store) => ({
		updateTag: store.updateTag,
	}));

	const updateTagMutation = useMutation({
		...getPutApiTagsIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			const newTag = {
				...tag,
				...data.data,
				pinned: data.data.pinned ?? tag.pinned,
			};

			updateTag(newTag);
		},
		onSuccess: (data, variables) => {
			if (data.status !== 200) {
				return;
			}

			const newTag = {
				...tag,
				...data.data,
				pinned: variables.data.pinned ?? tag.pinned,
			};

			initialTag.current = newTag;

			queryClient.invalidateQueries({
				queryKey: getGetApiTagsQueryKey(),
			});
		},
		onError: (error) => {
			console.error(error);

			updateTag(initialTag.current);
		},
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="action" size="iconAction">
					<DotsThreeIcon size={16} weight="bold" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48" align="end">
				{!tag.cover && (
					<DropdownMenuItem
						onSelect={() => {
							updateTagMutation.mutate({
								id: tag.id,
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

				<DropdownMenuItem
					onSelect={() => {
						updateTagMutation.mutate({
							id: tag.id,
							data: {
								pinned: !tag.pinned,
							},
						});
					}}
				>
					<StarIcon size={16} weight="bold" />
					{tag.pinned ? "Unfavorite" : "Favorite"}
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => {
						router.push(`/settings/tags`);
					}}
				>
					<TagIcon size={16} weight="bold" />
					Manage tags
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function CreateEntryButton({ tag }: { tag: GetApiTags200Item }) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const createDocument = useMutation({
		...getPostApiEntriesMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onSuccess: (data) => {
			if (data.status !== 201) {
				return;
			}

			queryClient.invalidateQueries({
				queryKey: getGetApiEntriesQueryKey(),
			});

			// we need to wait for the query to be invalidated before we can navigate to the new entry
			setTimeout(() => {
				router.push(`/journal/${data.data.id}`);
			}, 1000);
		},
		onError: (error) => {
			console.error(error);

			toast.error("Failed to create journal entry");
		},
	});

	return (
		<Button
			variant="action"
			size="action"
			onClick={() => {
				createDocument.mutate({
					data: {
						title: "",
						tags: [tag.id],
						type: "entry",
					},
				});
			}}
		>
			Create entry
		</Button>
	);
}

function TagHeader({ tag }: { tag: GetApiTags200Item }) {
	return (
		<div className="flex flex-col md:flex-row justify-between gap-5 md:items-center">
			<div className="flex items-center gap-5">
				<div className="flex justify-center items-center py-6 px-9 w-fit bg-muted rounded border">
					<RenderTag tag={tag} />
				</div>

				<div className="space-y-1">
					<p className="text-sm font-semibold text-muted-foreground">Tag</p>
					<p className="text-2xl sm:text-3xl font-medium">
						{tag.label || tag.id}
					</p>
				</div>
			</div>
		</div>
	);
}

function Goals({ tag }: { tag: GetApiTags200Item }) {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const goalsQuery = useGetApiTagsIdGoals(
		tag.id,
		{
			state: "active",
		},
		{
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		},
	);

	if (goalsQuery.isLoading) {
		return null;
	}

	if (
		goalsQuery.isError ||
		!goalsQuery.data ||
		goalsQuery.data.status !== 200
	) {
		return (
			<EmptyContent
				className="@sm:col-span-3"
				icon={<Coolshape type="polygon" index={5} size={100} noise />}
				title="No goals"
				description="Unable to retrieve goals"
			/>
		);
	}

	if (goalsQuery.data.data.length === 0) {
		return null;
	}

	return (
		<PageSection title="Goals" description="Currently active goals">
			<div className="grid grid-cols-1 @sm:grid-cols-3 gap-3">
				{goalsQuery.data.data.map((goal) => (
					<Link
						key={goal.id}
						className="bg-card border rounded-lg p-4 flex flex-col justify-between gap-4 h-full group text-start"
						type="button"
						href={`/goals/${goal.id}`}
					>
						<div className="flex items-center justify-between">
							{(() => {
								if (!goal.icon) {
									return (
										<div
											className={cn(
												buttonVariants({ variant: "logo", size: "icon" }),
											)}
										>
											<TargetIcon size={12} weight="duotone" />
										</div>
									);
								}

								const parsedIcon = getParsedIcon(goal.icon);

								if (!parsedIcon || !parsedIcon.Icon) {
									return (
										<div
											className={cn(
												buttonVariants({ variant: "logo", size: "icon" }),
											)}
										>
											<TargetIcon size={12} weight="duotone" />
										</div>
									);
								}

								return (
									<div
										className={cn(
											buttonVariants({ variant: "logo", size: "icon" }),
										)}
									>
										<parsedIcon.Icon size={12} weight="duotone" />
									</div>
								);
							})()}

							<ArrowRightIcon
								size={12}
								weight="bold"
								className="text-primary @md:opacity-0 group-hover:opacity-100 transition-opacity ease-in-out"
							/>
						</div>

						<div className="space-y-1">
							<div className="flex items-center justify-between gap-2">
								<p className="text-xs font-medium line-clamp-1">{goal.title}</p>

								<p className="text-xs font-medium text-muted-foreground">
									{getGoalProgress(goal.created_at, goal.end_date)}%
								</p>
							</div>

							<Progress
								value={getGoalProgress(goal.created_at, goal.end_date)}
							/>
						</div>
					</Link>
				))}
			</div>
		</PageSection>
	);
}

function Journals({ tag }: { tag: GetApiTags200Item }) {
	const { session, config } = useAppStore((store) => ({
		session: store.session,
		config: store.config,
	}));

	const journal = useJournalStore((store) => store.journal);
	const updateJournal = useJournalStore((store) => store.updateJournal);

	const [documentType, setDocumentType] = React.useState<
		"all" | "entry" | "prompted"
	>("all");

	const documentsQuery = useGetApiEntriesInfinite(
		{
			dateType: config.layout.sortDate,
			type: documentType,
			tagId: tag.id,
		},
		{
			query: {
				initialPageParam: 0,
				getNextPageParam: (page) => {
					if (page.status !== 200) {
						return;
					}

					if (!page.data.meta.hasNextPage) {
						return;
					}

					return page.data.meta.currentPage + 1;
				},
			},
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		},
	);

	React.useEffect(() => {
		const items: GetApiEntries200DataItem[] = [];
		const seenDocumentIds = new Set<string>();

		if (!documentsQuery.data) {
			return;
		}

		for (const page of documentsQuery.data.pages) {
			if (page.status !== 200) {
				continue;
			}

			for (const document of page.data.data) {
				if (!seenDocumentIds.has(document.id)) {
					seenDocumentIds.add(document.id);
					items.push(document);
				}
			}
		}

		updateJournal(items);
	}, [documentsQuery.data, updateJournal]);

	return (
		<PageSection
			title="Journal"
			actions={
				<div className="flex items-center justify-between gap-4">
					<Tabs
						className="hidden md:block"
						value={documentType}
						onValueChange={(value) => {
							setDocumentType(value as "all" | "entry" | "prompted");
						}}
					>
						<TabsList>
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="entry">Main</TabsTrigger>
							<TabsTrigger value="prompted">Prompted</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			}
		>
			{(() => {
				if (documentsQuery.isLoading) {
					return <PageLoading />;
				}

				if (documentsQuery.isError || !documentsQuery.data) {
					return (
						<EmptyContent
							icon={<Coolshape type="polygon" index={5} size={100} noise />}
							title="Error"
							description="Unable to retrieve journal entries"
						/>
					);
				}

				if (journal.length === 0) {
					return (
						<EmptyContent
							icon={<Coolshape type="flower" index={8} size={100} noise />}
							title="Empty journal"
							description="Start by creating your first journal entry. There are 2 types of entries you can create: main and prompted."
						/>
					);
				}

				return (
					<InfiniteScroll
						scrollableTarget="scrollable-body"
						dataLength={journal.length}
						next={documentsQuery.fetchNextPage}
						hasMore={documentsQuery.hasNextPage}
						loader={<PageLoading />}
						refreshFunction={documentsQuery.refetch}
					>
						<JournalView
							view={config.layout.journalLayout}
							entries={journal}
							showTags={false}
						/>
					</InfiniteScroll>
				);
			})()}
		</PageSection>
	);
}
