"use client";

import { TargetIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Coolshape } from "coolshapes-react";
import { addDays } from "date-fns";
import { getGoalProgress } from "jadebook";
import { getParsedIcon } from "jadebook/react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import {
	type GetApiGoals200Item,
	getGetApiGoalsQueryKey,
	getPostApiGoalsMutationOptions,
	type PostApiGoalsBody,
	useGetApiGoals,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { PageContainer } from "@/components/app/page-container";
import { ErrorRoute } from "@/components/routes/error";
import { PageLoading } from "@/components/routes/loading";
import { Button, buttonVariants } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { IconSelector } from "@/features/icon/icon-selector";
import { RenderTag } from "@/features/tag/tag";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/providers/app-store-provider";
import { useGoalsStore } from "@/stores/goal-store";

export function GoalsPage() {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const goalsQuery = useGetApiGoals(
		{
			state: "active",
			limit: "50",
		},
		{
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		},
	);

	const updateGoals = useGoalsStore((store) => store.updateGoals);

	React.useEffect(() => {
		if (goalsQuery.data && goalsQuery.data.status === 200) {
			updateGoals(goalsQuery.data.data);
		}

		if (goalsQuery.error) {
			console.error(goalsQuery.error);
		}
	}, [goalsQuery.data, goalsQuery.error, updateGoals]);

	if (goalsQuery.isLoading) {
		return <PageLoading />;
	}

	if (
		goalsQuery.isError ||
		!goalsQuery.data ||
		goalsQuery.data.status !== 200
	) {
		return <ErrorRoute />;
	}

	return <InternalGoalsPage />;
}

function InternalGoalsPage() {
	const goals = useGoalsStore((store) => store.goals);

	return (
		<PageContainer
			title="Goals"
			actions={
				<div className="flex gap-3 items-center">
					<CreateGoalButton />
				</div>
			}
		>
			{goals.length > 0 ? (
				<div className="border rounded-lg divide-y overflow-hidden">
					{goals.map((goal) => <Goal key={goal.id} goal={goal} />)}
				</div>
			) : (
				<EmptyContent
					title="Goals"
					description="Create a goal to get started. These are meant for long-term goals that are hard to quantify. Useful when todo lists are too restrictive."
					icon={
						<Coolshape type="rectangle" index={3} noise={true} size={100} />
					}
				/>
			)}
		</PageContainer>
	);
}

function Goal({ goal }: { goal: GetApiGoals200Item }) {
	const { tags } = useAppStore((store) => ({
		tags: store.tags,
	}));

	const progress = getGoalProgress(goal.created_at, goal.end_date);

	return (
		<Link href={`/goals/${goal.id}`} className="bg-card border-b last:border-b-0 hover:bg-accent hover:text-accent-foreground p-5 flex flex-col gap-4 transition-colors ease-in-out">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4 shrink-0">
					{(() => {
						if (!goal.icon) {
							return (
								<div
									className={cn(
										"shrink-0",
										buttonVariants({ variant: 'outline', size: "icon-lg" }),
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
										"shrink-0",
										buttonVariants({ variant: 'outline', size: "icon-lg" }),
									)}
								>
									<TargetIcon size={12} weight="duotone" />
								</div>
							);
						}

						return (
							<div
								className={cn(
									"shrink-0",
									buttonVariants({ variant: 'outline', size: "icon-lg" }),
								)}
							>
								<parsedIcon.Icon size={12} weight="duotone" />
							</div>
						);
					})()}

					<div className="grow">
						<p className="text-xs italic text-muted-foreground">
							{goal.state}
						</p>
						<p className="text-lg font-medium">{goal.title}</p>
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

			{goal.description && (
				<div>
					<p className="text-sm text-muted-foreground">{goal.description}</p>
				</div>
			)}

			{goal.tags && goal.tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{goal.tags.map((tag) => {
						const parsedTag = tags.find((t) => t.id === tag);

						if (!parsedTag) {
							return (
								<RenderTag
									key={tag}
									tag={{
										label: "Unknown tag",
										color: "amber",
										icon: "tag",
										variant: null,
									}}
								/>
							);
						}

						return <RenderTag key={parsedTag.id} tag={parsedTag} />;
					})}
				</div>
			)}
		</Link>
	);
}

function CreateGoalButton() {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const queryClient = useQueryClient();

	const [dialogOpen, setDialogOpen] = React.useState(false);

	const createGoalMutation = useMutation({
		...getPostApiGoalsMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			console.log(data);
		},
		onSuccess: (data) => {
			if (data.status !== 201) {
				return;
			}

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsQueryKey(),
			});

			setDialogOpen(false);
		},
		onError: (error) => {
			console.error(error);

			queryClient.invalidateQueries({
				queryKey: getGetApiGoalsQueryKey(),
			});
		},
	});

	function onSubmit(data: PostApiGoalsBody) {
		console.log("onSubmit");

		createGoalMutation.mutate({ data: { ...data } });
	}

	const form = useForm<PostApiGoalsBody>({
		defaultValues: {
			title: "",
			description: "",
			icon: "",
			end_date: addDays(new Date(), 60).toISOString(),
			tags: [],
		},
		disabled: createGoalMutation.isPending,
	});

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button size="sm">Create goal</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Goal</DialogTitle>
					<DialogDescription>
						Keep a log of your long-term goals
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icon</FormLabel>
									<FormControl>
										<IconSelector
											includeColor
											value={field.value || null}
											onChange={field.onChange}
											emptyState={
												<Button variant="outline" size="icon-lg">
													<TargetIcon size={12} weight="duotone" />
												</Button>
											}
											valueState={({ Icon, weight, color }) => (
												<Button variant="outline" size="icon-lg">
													<Icon size={12} weight={weight} color={color} />
												</Button>
											)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Build a house from scratch"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe what you're trying to achieve and how you're going to do it etc..."
											value={field.value || ""}
											onChange={field.onChange}
											disabled={field.disabled}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="end_date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>End date</FormLabel>
									<FormControl>
										<DatePicker
											date={new Date(field.value)}
											setDate={(date) => field.onChange(date.toISOString())}
											disabled={field.disabled}
										/>
									</FormControl>
									<FormDescription>
										This is used to track your progress — Goals are time-based
										and not quantifiable.
									</FormDescription>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									variant="outline"
									size="sm"
									disabled={createGoalMutation.isPending}
								>
									Cancel
								</Button>
							</DialogClose>

							<Button
								variant="default"
								size="sm"
								disabled={createGoalMutation.isPending}
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
