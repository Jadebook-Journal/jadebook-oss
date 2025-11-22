import {
	DotsThreeIcon,
	FileIcon,
	QuestionIcon,
	StarIcon,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { getParsedIcon, ICON_TEXT_COLOR_CLASSNAMES } from "jadebook/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import type { GetApiEntries200DataItem } from "@/api-client";
import { EntryActionDropdown } from "@/components/app/entry-dropdown";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/providers/app-store-provider";

export type JournalViewType = "list" | "grid" | "monthly";

export function JournalView(props: {
	view: JournalViewType;
	entries: GetApiEntries200DataItem[];
	showTags?: boolean;
}) {
	if (props.view === "list") {
		return <JournalViewList entries={props.entries} />;
	}

	if (props.view === "grid") {
		return (
			<JournalViewGrid entries={props.entries} showTags={props.showTags} />
		);
	}

	if (props.view === "monthly") {
		return (
			<JournalViewMonthly entries={props.entries} showTags={props.showTags} />
		);
	}

	throw new Error(`Invalid view type: ${props.view}`);
}

function JournalViewList(props: { entries: GetApiEntries200DataItem[] }) {
	const router = useRouter();

	const { config } = useAppStore((store) => ({ config: store.config }));

	return (
		<Table className="relative group">
			<TableHeader>
				<TableRow>
					<TableHead>Title</TableHead>
					<TableHead>Type</TableHead>
					<TableHead className="text-right whitespace-nowrap hidden md:table-cell">
						Last edited
					</TableHead>
					<TableHead className="text-right"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{props.entries.map((entry) => {
					const { Icon, weight, color } = getParsedIcon(entry.icon);

					return (
						<TableRow key={entry.id} className="group">
							<TableCell
								className="font-medium cursor-pointer md:pr-20"
								tabIndex={0}
								onClick={() => router.push(`/journal/${entry.id}`)}
							>
								<div className="flex items-center gap-2">
									{config.layout.showItemIcon && (
										<div className="flex items-center shrink-0 justify-center gap-1 bg-accent text-accent-foreground size-8 rounded-lg">
											{Icon ? (
												<Icon
													size={16}
													weight={weight}
													className={ICON_TEXT_COLOR_CLASSNAMES[color]}
												/>
											) : entry.type === "entry" ? (
												<FileIcon size={16} weight="bold" />
											) : (
												<QuestionIcon size={16} weight="bold" />
											)}
										</div>
									)}

									<div className="flex items-center gap-2">
										<p className="font-medium text-sm truncate max-w-xs">
											{entry.title || "Untitled Entry"}
										</p>

										{entry.pinned && (
											<Tooltip>
												<TooltipTrigger>
													<StarIcon
														size={14}
														weight="duotone"
														className="shrink-0 mb-0.5 text-primary"
													/>
												</TooltipTrigger>
												<TooltipContent>Favorite</TooltipContent>
											</Tooltip>
										)}
									</div>
								</div>
							</TableCell>
							<TableCell className="whitespace-nowrap hidden md:table-cell">
								<Badge variant="outline" className="capitalize">
									{entry.type}
								</Badge>
							</TableCell>
							<TableCell className="text-right whitespace-nowrap hidden md:table-cell">
								<p className="text-xs font-medium">
									{format(new Date(entry.updated_at), "dd MMM, yyyy")}
								</p>
							</TableCell>
							<TableCell className="text-right">
								<EntryActionDropdown entry={entry}>
									<Button variant="ghost" size="icon-sm">
										<DotsThreeIcon size={16} weight="bold" />
									</Button>
								</EntryActionDropdown>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

function JournalViewGrid({
	entries,
	showTags = true,
}: {
	entries: GetApiEntries200DataItem[];
	showTags?: boolean;
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{entries.map((entry) => (
				<GridItem key={entry.id} entry={entry} showTags={showTags} />
			))}
		</div>
	);
}

function JournalViewMonthly({
	entries,
	showTags = true,
}: {
	entries: GetApiEntries200DataItem[];
	showTags?: boolean;
}) {
	const { config } = useAppStore((store) => ({ config: store.config }));

	const sortedMonthlyEntries = React.useMemo(() => {
		// Step 1: Map entries to include their "month" property
		const monthlyEntries = entries.map((entry) => {
			const month = format(
				new Date(entry[config.layout.sortDate]),
				"MMMM, yyyy",
			);

			return {
				...entry,
				month: month,
			};
		});

		// Step 2: Group entries by month
		const monthlyEntryGroups = monthlyEntries.reduce(
			(acc, entry) => {
				const month = entry.month;

				if (!acc[month]) {
					acc[month] = [];
				}

				acc[month].push(entry);

				return acc;
			},
			{} as Record<string, GetApiEntries200DataItem[]>,
		);

		// Step 3: Convert grouped data into an array and sort entries within each group
		const sortedMonthlyEntryGroups = Object.entries(monthlyEntryGroups).map(
			([month, entries]) => ({
				month,
				entries: entries.sort((a, b) => {
					const dateA = new Date(a[config.layout.sortDate]);
					const dateB = new Date(b[config.layout.sortDate]);
					return dateB.getTime() - dateA.getTime(); // Sort entries within group in descending order
				}),
			}),
		);

		// Sort the monthly groups by date in descending order
		sortedMonthlyEntryGroups.sort((a, b) => {
			// Use the month string for more reliable sorting
			const dateA = new Date(`01 ${a.month}`);
			const dateB = new Date(`01 ${b.month}`);
			return dateB.getTime() - dateA.getTime();
		});

		return sortedMonthlyEntryGroups;
	}, [entries, config.layout.sortDate]);

	return (
		<div className="space-y-8">
			{sortedMonthlyEntries.map((group) => (
				<div className="space-y-3" key={group.month}>
					<div className="flex flex-col @md:flex-row items-center justify-between md:gap-6 gap-3">
						<div className="space-y-0.5">
							<h2 className="font-light text-sm">{group.month}</h2>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-hidden">
						{group.entries.map((entry) => {
							return (
								<GridItem key={entry.id} entry={entry} showTags={showTags} />
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}

function GridItem({
	entry,
	showTags = true,
}: {
	entry: GetApiEntries200DataItem;
	showTags?: boolean;
}) {
	const { config, globalTags } = useAppStore((store) => ({
		config: store.config,
		globalTags: store.tags,
	}));

	const { Icon, weight, color } = getParsedIcon(entry.icon);

	return (
		<div className="relative group h-full">
			<Link
				href={`/journal/${entry.id}`}
				className="cursor-pointer bg-card text-card-foreground flex flex-col justify-between rounded-md overflow-hidden p-4 border border-border hover:border-border h-full transition-all ease-in-out"
			>
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 mb-2">
						{config.layout.showItemIcon && (
							<div
								className={cn(
									buttonVariants({
										variant: "outline",
										size: "icon-sm",
									}),
									"pointer-events-none",
								)}
							>
								{(() => {
									if (Icon) {
										return (
											<Icon
												size={18}
												weight={weight}
												className={ICON_TEXT_COLOR_CLASSNAMES[color]}
											/>
										);
									}

									if (entry.type === "prompted") {
										return (
											<QuestionIcon
												size={18}
												weight="bold"
												className="text-primary"
											/>
										);
									}

									return (
										<FileIcon
											size={18}
											weight="bold"
											className="text-primary"
										/>
									);
								})()}
							</div>
						)}

						{entry.pinned && (
							<Tooltip>
								<TooltipTrigger>
									<StarIcon
										size={14}
										weight="duotone"
										className="shrink-0 mb-0.5 text-primary"
									/>
								</TooltipTrigger>
								<TooltipContent>Favorite</TooltipContent>
							</Tooltip>
						)}
					</div>

					<h3 className="font-semibold line-clamp-2 text-sm">
						{entry.title || "Untitled"}
					</h3>

					{entry.excerpt && (
						<p className="text-xs text-muted-foreground line-clamp-3">
							{entry.excerpt}
						</p>
					)}

					{entry.tags && showTags && (
						<div className="flex flex-wrap gap-2 mt-2">
							{entry.tags.map((tag) => {
								const parsedTag = globalTags.find((t) => t.id === tag);

								if (!parsedTag) {
									return null;
								}

								return <p key={tag}>{parsedTag.label}</p>;
							})}
						</div>
					)}
				</div>
			</Link>

			<div className="absolute top-4 right-4">
				<EntryActionDropdown entry={entry}>
					<Button variant="ghost" size="icon-sm">
						<DotsThreeIcon size={16} weight="bold" />
					</Button>
				</EntryActionDropdown>
			</div>
		</div>
	);
}
