"use client";

import { CircleNotchIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { generateText } from "@tiptap/react";
import { Coolshape } from "coolshapes-react";
import { format } from "date-fns";
import { handleEditorContent } from "jadebook";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	type GetApiSearch200,
	type GetApiSearchParams,
	getGetApiSearchQueryOptions,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { PageContainer } from "@/components/app/page-container";
import { editor_extensions } from "@/components/editor/extensions";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/providers/app-store-provider";

export function SearchPage() {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const [searchTerm, setSearchTerm] = useState<string>("");

	const searchQuery = useQuery({
		...getGetApiSearchQueryOptions(
			{
				searchTerm,
			},
			{
				query: {
					// we manually refetch the query when the user submits
					enabled: searchTerm.length > 0,
				},
				fetch: {
					headers: {
						Authorization: `Bearer ${session.access_token}`,
					},
				},
			},
		),
	});

	return (
		<PageContainer
			title="Search"
			actions={
				searchQuery.isFetching ? (
					<CircleNotchIcon className="animate-spin" size={16} />
				) : null
			}
		>
			<div>
				<FormInput
					onMutate={(values) => {
						setSearchTerm(values.searchTerm);

						searchQuery.refetch();
					}}
					isDisabled={searchQuery.isFetching}
				/>
			</div>

			{(() => {
				if (searchTerm.length === 0) {
					return null;
				}

				if (searchQuery.isFetching) {
					return <Skeleton className="w-full h-32" />;
				}

				if (
					searchQuery.isError ||
					!searchQuery.data ||
					searchQuery.data.status !== 200
				) {
					return (
						<EmptyContent
							title="Search Failed"
							description="We failed to search for your query. Please try again."
							icon={<Coolshape type="flower" index={14} size={100} noise />}
						/>
					);
				}

				const noContent =
					searchQuery.data.data.entries.length === 0 &&
					searchQuery.data.data.goals.length === 0 &&
					searchQuery.data.data.logs.length === 0;

				if (noContent) {
					return (
						<EmptyContent
							title="No results found"
							description="No results found for your search. Try a different search term."
							icon={<Coolshape type="flower" index={14} size={100} noise />}
						/>
					);
				}

				return <SearchViewList data={searchQuery.data.data} />;
			})()}
		</PageContainer>
	);
}

function FormInput({
	onMutate,
	isDisabled,
}: {
	onMutate: (values: Pick<GetApiSearchParams, "searchTerm">) => void;
	isDisabled: boolean;
}) {
	const form = useForm<Pick<GetApiSearchParams, "searchTerm">>({
		defaultValues: {
			searchTerm: "",
		},
		disabled: isDisabled,
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((values) => onMutate(values))}
				className="h-full bg-background text-foreground flex flex-col items-center justify-center w-full p-1"
			>
				<div className="w-full">
					<FormField
						control={form.control}
						name="searchTerm"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										autoFocus
										type="text"
										placeholder="A keyword or phrase"
										autoComplete="off"
										maxLength={100}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												onMutate(form.getValues());
											}
										}}
										className="h-12 md:text-lg"
										{...field}
										disabled={isDisabled}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</form>
		</Form>
	);
}

function SearchViewList({ data }: { data: GetApiSearch200 }) {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium">Entries</p>

				{data.entries.length === 0 ? (
					<EmptyContent
						title="No entries found"
						description="No entries found for your search term."
						icon={<Coolshape type="flower" index={8} size={100} noise />}
					/>
				) : (
					<div className="border rounded-lg divide-y overflow-hidden">
						{data.entries.map((entry) => {
							return (
								<Link
									key={entry.id}
									href={`/journal/${entry.id}`}
									className="bg-card hover:bg-accent hover:text-accent-foreground p-5 transition-all ease-in-out flex flex-col gap-2"
								>
									<p className="font-medium text-sm line-clamp-1">
										{entry.title || "Untitled Entry"}
									</p>

									{entry.excerpt && (
										<p className="text-sm line-clamp-3">{entry.excerpt}</p>
									)}

									<div className="flex items-center gap-2">
										<p className="text-xs text-muted-foreground">
											Last updated:{" "}
											{format(new Date(entry.updated_at), "dd MMM, yyyy")}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium">Goals</p>

				{data.goals.length === 0 ? (
					<EmptyContent
						title="No goals found"
						description="No goals found for your search term."
						icon={
							<Coolshape type="rectangle" index={3} noise={true} size={100} />
						}
					/>
				) : (
					<div className="border rounded-lg divide-y overflow-hidden">
						{data.goals.map((goal) => {
							return (
								<Link
									key={goal.id}
									href={`/goals/${goal.id}`}
									className="bg-card hover:bg-accent hover:text-accent-foreground p-5 transition-all ease-in-out flex flex-col gap-2"
								>
									<p className="font-medium text-sm line-clamp-1">
										{goal.title || "Untitled Goal"}
									</p>

									{goal.description && (
										<p className="text-sm line-clamp-3">{goal.description}</p>
									)}

									<div className="flex items-center gap-2">
										<p className="text-xs text-muted-foreground">
											Last updated:{" "}
											{format(new Date(goal.updated_at), "dd MMM, yyyy")}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium">Logs</p>

				{data.logs.length === 0 ? (
					<EmptyContent
						title="No logs found"
						description="No logs found for your search term."
						icon={<Coolshape type="misc" index={0} noise={false} size={100} />}
					/>
				) : (
					<div className="border rounded-lg divide-y overflow-hidden">
						{data.logs.map((log) => {
							const content = handleEditorContent(log.content);

							const text =
								content && typeof content !== "string"
									? generateText(content, editor_extensions)
									: null;

							return (
								<Link
									key={log.id}
									href={`/goals/${log.goal_id}`}
									className="bg-card hover:bg-accent hover:text-accent-foreground p-5 transition-all ease-in-out flex flex-col gap-2"
								>
									<p className="font-medium text-sm line-clamp-1">
										Goal: {log.goal_title || "Untitled Goal"}
									</p>

									{text && (
										<p className="text-sm line-clamp-3">{text.slice(0, 100)}</p>
									)}

									<div className="flex items-center gap-2">
										<p className="text-xs text-muted-foreground">
											Last updated:{" "}
											{format(new Date(log.updated_at), "dd MMM, yyyy")}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
