"use client";

import {
	DotsThreeIcon,
	MinusIcon,
	PencilLineIcon,
	TrashIcon,
	TrendDownIcon,
	TrendUpIcon,
} from "@phosphor-icons/react";
import { useEditor } from "@tiptap/react";
import { Coolshape } from "coolshapes-react";
import { formatDistanceToNow } from "date-fns";
import { handleEditorContent } from "jadebook";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
	type GetApiGoalGoalIdLogs200DataItem,
	type PostApiGoalGoalIdLogsBodyType,
	useGetApiGoalGoalIdLogsInfinite,
} from "@/api-client";
import { cn } from "@/lib/utils";
import { useGoalMutations } from "@/mutations/use-goal-mutations";
import { useLogMutations } from "@/mutations/use-log-mutations";
import { useAppStore } from "@/providers/app-store-provider";
import { useGoalStore } from "@/providers/goal-provider";
import { LogStoreProvider, useLogStore } from "@/providers/log-provider";
import { useGlobalLogStore } from "@/stores/log-store";
import { EmptyContent } from "../app/empty-content";
import { PageSection } from "../app/page";
import { MiniBlockEditor } from "../editor/block-editor";
import { editor_extensions } from "../editor/extensions";
import { PageLoading } from "../routes/loading";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

export function LogSection() {
	const { goalId, userId, updateLogs, logs } = useGoalStore((store) => ({
		goalId: store.id,
		userId: store.user_id,
		logs: store.logs,
		updateLogs: store.updateLogs,
	}));

	const setActiveLogId = useGlobalLogStore((store) => store.setActiveLogId);

	const session = useAppStore((store) => store.session);

	const logsQuery = useGetApiGoalGoalIdLogsInfinite(
		goalId,
		{},
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
		const items: GetApiGoalGoalIdLogs200DataItem[] = [];
		const seenLogIds = new Set<string>();

		if (!logsQuery.data) {
			updateLogs([]);

			return;
		}

		for (const page of logsQuery.data.pages) {
			if (page.status !== 200) {
				continue;
			}

			for (const log of page.data.data) {
				if (!seenLogIds.has(log.id)) {
					seenLogIds.add(log.id);
					items.push(log);
				}
			}
		}

		updateLogs(items);
	}, [logsQuery.data, updateLogs]);

	return (
		<PageSection
			title="Logs"
			actions={
				<Button
					disabled={logsQuery.isFetching}
					variant="outline"
					size="action"
					onClick={() => {
						// we create a transient log to be used for the editor
						// but then we handle the actual creation later
						const newLog: GetApiGoalGoalIdLogs200DataItem = {
							id: "transient",
							goal_id: goalId,
							user_id: userId,
							content: null,
							created_at: new Date().toISOString(),
							type: "neutral",
						};

						updateLogs([newLog, ...logs]);

						setActiveLogId(newLog.id);
					}}
				>
					Add log
				</Button>
			}
		>
			{(() => {
				if (logsQuery.isLoading) {
					return <PageLoading />;
				}

				if (logsQuery.isError) {
					return (
						<EmptyContent
							title="Error loading logs"
							description="Please try refreshing the page."
							icon={
								<Coolshape type="misc" index={0} noise={false} size={100} />
							}
						/>
					);
				}

				if (logs.length === 0) {
					return (
						<EmptyContent
							title="No logs yet"
							description="Start by creating your first log."
							icon={
								<Coolshape type="misc" index={0} noise={false} size={100} />
							}
						/>
					);
				}

				return (
					<InfiniteScroll
						scrollableTarget="scrollable-body"
						dataLength={logs.length}
						next={logsQuery.fetchNextPage}
						hasMore={logsQuery.hasNextPage}
						loader={<PageLoading />}
						refreshFunction={logsQuery.refetch}
						className="flex flex-col gap-2"
					>
						{logs.map((log) => (
							<LogStoreProvider key={log.id} initialState={log}>
								<LogItem log={log} />
							</LogStoreProvider>
						))}
					</InfiniteScroll>
				);
			})()}
		</PageSection>
	);
}

function LogItem({ log }: { log: GetApiGoalGoalIdLogs200DataItem }) {
	return (
		<div className="bg-card border rounded-xl p-4 space-y-4">
			<div className="flex justify-between items-center">
				<LogContentHeader log={log} />

				<LogOptionsMenu log={log} />
			</div>

			<LogEditor log={log} />
		</div>
	);
}

const statusOptions: {
	value: GetApiGoalGoalIdLogs200DataItem["type"];
	label: string;
	Icon: React.ElementType;
}[] = [
	{ value: "neutral", label: "Neutral", Icon: MinusIcon },
	{ value: "good", label: "On Track", Icon: TrendUpIcon },
	{ value: "bad", label: "Off Track", Icon: TrendDownIcon },
];

export function RatingSelector({
	log,
}: {
	log: GetApiGoalGoalIdLogs200DataItem;
}) {
	const { type, updateLog } = useLogStore((store) => ({
		type: store.type,
		updateLog: store.updateLog,
	}));

	return (
		<Select
			value={String(type)}
			onValueChange={(val) =>
				updateLog({
					...log,
					type: val as GetApiGoalGoalIdLogs200DataItem["type"],
				})
			}
		>
			<SelectTrigger
				size="sm"
				className="w-[150px] h-7 text-xs border rounded-full px-3 py-1"
			>
				<SelectValue placeholder="Select Rating" />
			</SelectTrigger>
			<SelectContent>
				{statusOptions.map(({ value: itemValue, label, Icon }) => (
					<SelectItem key={itemValue} value={String(itemValue)}>
						<div className="flex items-center gap-2">
							<Icon size={16} weight="bold" />
							<span>{label}</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function LogContentHeader({ log }: { log: GetApiGoalGoalIdLogs200DataItem }) {
	const type = useLogStore((store) => store.type);
	const activeLogId = useGlobalLogStore((store) => store.activeLogId);

	if (activeLogId !== log.id) {
		return (
			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">
					{(() => {
						switch (type) {
							case "neutral":
								return "Neutral";
							case "good":
								return "On Track";
							case "bad":
								return "Off Track";
							default:
								return "Neutral";
						}
					})()}
				</span>

				<Separator
					orientation="vertical"
					className="data-[orientation=vertical]:h-4 w-0.5"
				/>

				<p className="text-xs text-muted-foreground italic">
					Created {formatDistanceToNow(new Date(log.created_at))} ago
				</p>
			</div>
		);
	}

	return <RatingSelector log={log} />;
}

function LogEditor({ log }: { log: GetApiGoalGoalIdLogs200DataItem }) {
	const { logs, updateLogs } = useGoalStore((store) => ({
		logs: store.logs,
		updateLogs: store.updateLogs,
	}));

	const type = useLogStore((store) => store.type);
	const logId = useLogStore((store) => store.id);
	const activeLogId = useGlobalLogStore((store) => store.activeLogId);
	const setActiveLogId = useGlobalLogStore((store) => store.setActiveLogId);

	const { content } = useLogStore((store) => ({
		content: store.content,
	}));

	const { updateLogMutation } = useLogMutations({ log });
	const { createLogMutation } = useGoalMutations({ goalId: log.goal_id });

	const [internalContent, setInternalContent] = React.useState(content);

	const isActive = React.useMemo(
		() => activeLogId === logId,
		[activeLogId, logId],
	);

	const editor = useEditor({
		editorProps: {
			attributes: {
				class: cn(
					"focus:outline-hidden leading-loose text-foreground/90 transition-all ease-in-out p-2.5",
				),
			},
		},
		extensions: editor_extensions,
		content: handleEditorContent(internalContent),
		editable: activeLogId === logId,
		autofocus: false,
		immediatelyRender: true,
		shouldRerenderOnTransaction: true,
		onUpdate: (e) => {
			setInternalContent(JSON.stringify(e.editor.getJSON()));
		},
	});

	// when the "server" content changes, we need to update the editor
	React.useEffect(() => {
		if (!editor) return;

		const parsedContent = handleEditorContent(content);

		if (parsedContent) {
			editor.commands.setContent(parsedContent);
		}
	}, [editor, content]);

	React.useEffect(() => {
		if (!editor) return;

		if (isActive) {
			editor.setEditable(true);

			setTimeout(() => {
				editor.commands.focus();
			}, 500);
		} else {
			editor.setEditable(false);
		}
	}, [editor, isActive]);

	if (!editor) {
		return <PageLoading />;
	}

	return (
		<>
			<MiniBlockEditor
				editor={editor}
				placeholder="No content within this log"
			/>

			<div
				className={cn(
					"flex justify-end items-center gap-2",
					activeLogId !== logId && "hidden",
				)}
			>
				<Button
					variant="outline"
					size="action"
					onClick={() => {
						const parsedContent = handleEditorContent(content);

						if (parsedContent) {
							editor.commands.setContent(parsedContent);
						}

						setActiveLogId(null);

						if (log.id === "transient") {
							// remove the transient log
							updateLogs(logs.filter((l) => l.id !== "transient"));
						}
					}}
				>
					Cancel
				</Button>

				<Button
					size="action"
					variant="default"
					onClick={() => {
						if (internalContent) {
							if (log.id === "transient") {
								createLogMutation.mutate({
									goalId: log.goal_id,
									data: {
										content: internalContent,
										type: type as PostApiGoalGoalIdLogsBodyType,
									},
								});
							} else {
								updateLogMutation.mutate({
									goalId: log.goal_id,
									id: log.id,
									data: {
										content: internalContent,
										type: type as PostApiGoalGoalIdLogsBodyType,
									},
								});
							}
						}

						setActiveLogId(null);
					}}
				>
					Save
				</Button>
			</div>
		</>
	);
}

function LogOptionsMenu({ log }: { log: GetApiGoalGoalIdLogs200DataItem }) {
	const logId = useLogStore((store) => store.id);
	const activeLogId = useGlobalLogStore((store) => store.activeLogId);
	const setActiveLogId = useGlobalLogStore((store) => store.setActiveLogId);

	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

	const { deleteLogMutation } = useLogMutations({ log });

	if (logId === "transient") {
		return null;
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="action" size="iconAction">
						<DotsThreeIcon size={16} weight="bold" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-48" align="end">
					{activeLogId !== logId && (
						<DropdownMenuItem
							onSelect={() => {
								setActiveLogId(logId);
							}}
						>
							<PencilLineIcon size={16} weight="bold" />
							Edit
						</DropdownMenuItem>
					)}

					<DropdownMenuSeparator />

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
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title="Delete log"
				description="Are you sure you want to delete this log? This action cannot be undone."
				onConfirm={() => {
					console.log("deleting log", log.id);

					deleteLogMutation.mutate({
						goalId: log.goal_id,
						id: log.id,
					});
				}}
			/>
		</>
	);
}
