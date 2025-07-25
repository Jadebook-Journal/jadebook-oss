"use client";

import {
	ArrowRightIcon,
	CalendarIcon,
	FireIcon,
	PathIcon,
	PlantIcon,
	QuestionIcon,
	TargetIcon,
} from "@phosphor-icons/react";
import { Coolshape } from "coolshapes-react";
import { format } from "date-fns";
import { getGoalProgress } from "jadebook";
import { getParsedIcon } from "jadebook/react";
import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
	type GetApiEntries200DataItem,
	getApiEntries,
	useGetApiEntriesInfinite,
	useGetApiGoals,
	useGetApiPrompts,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { JournalView } from "@/components/app/journal-view";
import { PageHeading, PageSection } from "@/components/app/page";
import { PageContainer } from "@/components/app/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntryMutations } from "@/mutations/use-entry-mutations";
import { useAppStore } from "@/providers/app-store-provider";
import { PageLoading } from "@/components/routes/loading";
import { useJournalStore } from "@/stores/journal-store";
import { cn } from "@/lib/utils";

export function HomePage() {
	const { session, config, profile } = useAppStore((store) => ({
		session: store.session,
		config: store.config,
		profile: store.profile,
	}));

	const journal = useJournalStore((store) => store.journal);
	const updateJournal = useJournalStore((store) => store.updateJournal);

	const [entryType, setEntryType] = React.useState<
		"all" | "entry" | "prompted"
	>("all");

	const baseParams = React.useMemo(
		() => ({
			dateType: config.layout.sortDate,
			type: entryType,
		}),
		[config.layout.sortDate, entryType],
	);

	const entriesQuery = useGetApiEntriesInfinite(baseParams, {
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
			queryFn: ({ pageParam = 0, signal }) =>
				getApiEntries(
					{ ...baseParams, page: String(pageParam) },
					{
						signal,
						headers: {
							Authorization: `Bearer ${session.access_token}`,
						},
					},
				),
		},
	});

	React.useEffect(() => {
		const items: GetApiEntries200DataItem[] = [];
		const seenEntryIds = new Set<string>();

		if (!entriesQuery.data) {
			return;
		}

		for (const page of entriesQuery.data.pages) {
			if (page.status !== 200) {
				continue;
			}

			for (const entry of page.data.data) {
				if (!seenEntryIds.has(entry.id)) {
					seenEntryIds.add(entry.id);
					items.push(entry);
				}
			}
		}

		updateJournal(items);
	}, [entriesQuery.data, updateJournal]);

	return (
		<PageContainer title="Home">
			<PageHeading
				title="Welcome"
				actions={
					profile.current_streak > 0 && (
						<p className="flex items-center gap-1 text-sm font-medium text-foreground">
							<FireIcon size={16} weight="duotone" className="text-primary" />
							{profile.current_streak} day streak
						</p>
					)
				}
			/>

			<QuickActions />

			<PageSection
				title="Prompts"
				description="Some recommended prompts for you to start thinking"
			>
				<Prompts />
			</PageSection>

			<Goals />

			<PageSection
				title="Journal"
				actions={
					<div className="flex items-center justify-between gap-4">
						<Tabs
							className="hidden md:block"
							value={entryType}
							onValueChange={(value) => {
								setEntryType(value as "all" | "entry" | "prompted");
							}}
						>
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="document">Main</TabsTrigger>
								<TabsTrigger value="prompted">Prompted</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				}
			>
				{(() => {
					if (entriesQuery.isLoading) {
						return <PageLoading />;
					}

					if (entriesQuery.isError || !entriesQuery.data) {
						return <p>Error</p>;
					}

					if (journal.length === 0) {
						return (
							<EmptyContent
								icon={<Coolshape type="flower" index={8} size={100} noise />}
								title="Empty journal"
								description="Start by creating your first journal entry. There are 2 types of entries you can create: main and prompted"
							/>
						);
					}

					return (
						<InfiniteScroll
							scrollableTarget="scrollable-body"
							dataLength={journal.length}
							next={() => {
								entriesQuery.fetchNextPage();
							}}
							hasMore={entriesQuery.hasNextPage}
							loader={<PageLoading />}
							refreshFunction={entriesQuery.refetch}
						>
							<JournalView
								view={config.layout.journalLayout}
								entries={journal}
							/>
						</InfiniteScroll>
					);
				})()}
			</PageSection>
		</PageContainer>
	);
}

function QuickActions() {
	const { createEntryMutation } = useEntryMutations();

	const actions = [
		{
			icon: PlantIcon,
			title: "Untitled",
			description: "An empty main journal entry",
			onClick: () => {
				createEntryMutation.mutate({
					data: {
						title: "",
						type: "entry",
					},
				});
			},
		},
		{
			icon: CalendarIcon,
			title: format(new Date(), "dd MMMM, yyyy"),
			description: "Use this day to reflect on your day",
			onClick: () => {
				createEntryMutation.mutate({
					data: {
						title: format(new Date(), "dd MMMM, yyyy"),
						type: "entry",
					},
				});
			},
		},
	];

	return (
		<div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
			{actions.map((action) => (
				<button
					key={action.title}
					className="bg-card border rounded-lg p-4 flex flex-col justify-between gap-4 h-full group"
					type="button"
					onClick={action.onClick}
				>
					<div className="flex justify-between items-center gap-5">
						<action.icon size={20} weight="duotone" className="text-primary" />

						<ArrowRightIcon
							size={12}
							weight="bold"
							className="text-primary @md:opacity-0 group-hover:opacity-100 transition-opacity ease-in-out"
						/>
					</div>

					<div className="space-y-0.5 text-start">
						<p className="text-sm font-medium">{action.title}</p>
						<p className="text-xs text-muted-foreground">
							{action.description}
						</p>
					</div>
				</button>
			))}
		</div>
	);
}

function Prompts() {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const promptsQuery = useGetApiPrompts({
		fetch: {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		},
	});

	const { createEntryMutation } = useEntryMutations();

	return (
		<div className="grid grid-cols-1 @sm:grid-cols-3 gap-3">
			{(() => {
				if (promptsQuery.isLoading) {
					return (
						<>
							<Skeleton className="h-20 w-full" />
							<Skeleton className="h-20 w-full" />
							<Skeleton className="h-20 w-full" />
						</>
					);
				}

				if (
					promptsQuery.isError ||
					!promptsQuery.data ||
					promptsQuery.data.status !== 200
				) {
					return (
						<EmptyContent
							className="@sm:col-span-3"
							icon={<Coolshape type="wheel" index={6} size={100} noise />}
							title="No prompts"
							description="Unable to generate prompts"
						/>
					);
				}

				return promptsQuery.data.data.prompts.map((prompt, index) => (
					<button
						// biome-ignore lint/suspicious/noArrayIndexKey: prompts are a string[] and thus, do not have unique keys attached to them
						key={`prompt-${index}`}
						className="bg-card border rounded-lg p-4 flex flex-col justify-between gap-4 h-full group text-start"
						type="button"
						onClick={() => {
							createEntryMutation.mutate({
								data: {
									title: prompt,
									type: "prompted",
								},
							});
						}}
					>
						<div className="flex items-center justify-between">
							<p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
								<QuestionIcon size={12} weight="duotone" /> Static
							</p>

							<ArrowRightIcon
								size={12}
								weight="bold"
								className="text-primary @md:opacity-0 group-hover:opacity-100 transition-opacity ease-in-out"
							/>
						</div>
						<p className="text-xs font-medium">{prompt}</p>
					</button>
				));
			})()}
		</div>
	);
}

function Goals() {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const goalsQuery = useGetApiGoals(
		{
			limit: "3",
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

	if (
		goalsQuery.status === "success" &&
		goalsQuery.data.status === 200 &&
		goalsQuery.data.data.length === 0
	) {
		return null;
	}

	return (
		<PageSection title="Goals">
			<div className="grid grid-cols-1 @sm:grid-cols-3 gap-3">
				{(() => {
					if (goalsQuery.isLoading) {
						return (
							<>
								<Skeleton className="h-20 w-full" />
								<Skeleton className="h-20 w-full" />
								<Skeleton className="h-20 w-full" />
							</>
						);
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

					return goalsQuery.data.data.map((goal) => (
						<Link
							key={goal.id}
							className="bg-card border rounded-lg p-4 flex flex-col justify-between gap-4 h-full group text-start"
							type="button"
							href={`/goals/${goal.id}`}
						>
							<div className="flex items-center justify-between">
								{(() => {
									// TODO: remove this once we have a proper icon management
									if (!goal.icon || goal.icon.length < 3) {
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
									<p className="text-xs font-medium line-clamp-1">
										{goal.title}
									</p>

									<p className="text-xs font-medium text-muted-foreground">
										{getGoalProgress(goal.created_at, goal.end_date)}%
									</p>
								</div>

								<Progress
									value={getGoalProgress(goal.created_at, goal.end_date)}
								/>
							</div>
						</Link>
					));
				})()}
			</div>
		</PageSection>
	);
}
