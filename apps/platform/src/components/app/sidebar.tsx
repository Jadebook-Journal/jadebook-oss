"use client";

import {
	ArrowLeftIcon,
	ArrowUpRightIcon,
	CaretUpDownIcon,
	CircleIcon,
	ClockCounterClockwiseIcon,
	CommandIcon,
	DotsThreeVerticalIcon,
	EyeIcon,
	FileIcon,
	GearIcon,
	HouseIcon,
	MagnifyingGlassIcon,
	PenNibStraightIcon,
	SealQuestionIcon,
	SidebarSimpleIcon,
	SignOutIcon,
	SparkleIcon,
	TargetIcon,
} from "@phosphor-icons/react";
import { getParsedIcon, ICON_TEXT_COLOR_CLASSNAMES } from "jadebook/react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { signOutAction } from "@/actions/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/providers/app-store-provider";
import { settingsNavigation } from "../settings/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import { Shortcut } from "@/components/ui/shortcut-key";
import { EntryActionDropdown } from "./entry-dropdown";
// import { EntryActionDropdown } from "./entry-dropdown";
// import { GoalActionDropdown } from "./goal-dropdown";

export function AppSidebar() {
	const router = useRouter();
	const pathname = usePathname();

	const { profile, session, config, updateCommandCenterOpen } = useAppStore(
		(state) => ({
			session: state.session,
			profile: state.profile,
			config: state.config,
			updateCommandCenterOpen: state.updateCommandCenterOpen,
		}),
	);

	return (
		<Sidebar
			className="print:hidden"
			collapsible={config.layout.sidebarHiddenState}
			variant={
				config.layout.sidebarVariant === "default"
					? "sidebar"
					: config.layout.sidebarVariant
			}
		>
			<SidebarHeader>
				<div className="flex items-center gap-2 text-primary">
					<div className="h-8 w-8 flex items-center justify-center shrink-0">
						<PenNibStraightIcon className="h-5 w-5" weight="bold" />
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				{pathname.startsWith("/settings") ? (
					<>
						<SidebarGroup className="mt-2">
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton tooltip="Back to app" asChild>
											<Link href="/">
												<ArrowLeftIcon size={16} weight="bold" />
												<span>Back to app</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>

						<SidebarGroup>
							<SidebarGroupLabel>Settings</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{settingsNavigation.map((link) => (
										<SidebarMenuItem key={link.pathname}>
											<SidebarMenuButton
												tooltip={link.label}
												isActive={pathname === link.pathname}
												asChild
											>
												<Link href={link.pathname}>
													{link.icon}
													<span>{link.label}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</>
				) : (
					<>
						<SidebarGroup>
							<SidebarContent>
								<SidebarMenu>
									{config.features.search && (
										<SidebarMenuItem>
											<SidebarMenuButton
												tooltip="Search"
												isActive={pathname === "/search"}
												asChild
											>
												<Link href="/search">
													<MagnifyingGlassIcon weight="bold" />
													<span>Search</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									)}

									<SidebarMenuItem>
										<SidebarMenuButton
											tooltip="Entries"
											isActive={pathname === "/"}
											asChild
										>
											<Link href="/">
												<HouseIcon weight="bold" />
												<span>Home</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>

									{config.features.goals && (
										<SidebarMenuItem>
											<SidebarMenuButton
												tooltip="Goals"
												isActive={pathname === "/goals"}
												asChild
											>
												<Link href="/goals">
													<TargetIcon weight="bold" />
													<span>Goals</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									)}
								</SidebarMenu>
							</SidebarContent>
						</SidebarGroup>

						<PinnedEntries />

						<PinnedGoals />

						<TagsGroup />
					</>
				)}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={
												profile.profile_image ||
												session.user.user_metadata.avatar_url ||
												"https://images.unsplash.com/photo-1690321607822-669326f4e3cc?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
											}
											alt="profile image"
										/>
										<AvatarFallback className="rounded-lg">
											{profile.username ||
												session.user.email?.split("@")[0] ||
												"User"}
										</AvatarFallback>
									</Avatar>

									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{profile.username ||
												session.user.email?.split("@")[0] ||
												"User"}
										</span>

										<span className="truncate text-xs">
											Open Source Edition
										</span>
									</div>

									<CaretUpDownIcon className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
								side="bottom"
								align="end"
								sideOffset={4}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium opacity-90">
												{session.user.email}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem
										onClick={() => updateCommandCenterOpen(true)}
									>
										<CommandIcon />
										Open Commands
										<span className="ml-auto">
											<Shortcut shortcut={["Mod", "K"]} />
										</span>
									</DropdownMenuItem>

									<DropdownMenuItem onClick={() => router.push("/settings")}>
										<GearIcon />
										Settings
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onSelect={async () => {
										const res = await signOutAction();

										if (res.success) {
											// we don't want to use router because we want a full page navigation
											window.open("/sign-in", "_self");
										}
									}}
								>
									<SignOutIcon />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}

export function SidebarToggle() {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			tooltip="Toggle Sidebar"
			variant="ghost"
			size="iconSm"
			onClick={toggleSidebar}
		>
			<SidebarSimpleIcon size={16} weight="bold" />
		</Button>
	);
}

function PinnedEntries() {
	const params = useParams();

	const {
		pinnedResources: { entries },
		config,
	} = useAppStore((state) => ({
		pinnedResources: state.pinnedResources,
		config: state.config,
	}));

	if (entries.length === 0) return null;

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Favorites Entries</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{(() => {
						return entries.map((entry) => {
							const { Icon, weight, color } = getParsedIcon(entry.icon);

							return (
								<SidebarMenuItem
									key={entry.id}
									className="group/item animate-in fade-in-0 slide-in-from-left-0"
								>
									<SidebarMenuButton
										isActive={entry.id === params.entryId}
										tooltip={entry.title ?? "Untitled"}
										asChild
									>
										<Link href={`/journal/${entry.id}`}>
											{Icon ? (
												<Icon
													size={16}
													weight={weight}
													className={
														config.layout.monochromeIcons
															? ""
															: ICON_TEXT_COLOR_CLASSNAMES[color]
													}
												/>
											) : (
												<FileIcon size={16} weight="bold" />
											)}
											<span>{entry.title ?? "Untitled"}</span>
										</Link>
									</SidebarMenuButton>

									<EntryActionDropdown entry={entry} side="right">
										<SidebarMenuAction className="group-hover/item:opacity-100 opacity-0 data-[state=open]:opacity-100">
											<DotsThreeVerticalIcon size={12} weight="bold" />
										</SidebarMenuAction>
									</EntryActionDropdown>
								</SidebarMenuItem>
							);
						});
					})()}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function PinnedGoals() {
	const params = useParams();

	const {
		pinnedResources: { goals },
		config,
	} = useAppStore((state) => ({
		pinnedResources: state.pinnedResources,
		config: state.config,
	}));

	if (goals.length === 0) return null;

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Favorites Goals</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{(() => {
						return goals.map((goal) => {
							const { Icon, weight, color } = getParsedIcon(goal.icon);

							return (
								<SidebarMenuItem
									key={goal.id}
									className="group/item animate-in fade-in-0 slide-in-from-left-0"
								>
									<SidebarMenuButton
										isActive={goal.id === params.goalId}
										tooltip={goal.title ?? "Untitled"}
										asChild
									>
										<Link href={`/goals/${goal.id}`}>
											{Icon ? (
												<Icon
													size={16}
													weight={weight}
													className={
														config.layout.monochromeIcons
															? ""
															: ICON_TEXT_COLOR_CLASSNAMES[color]
													}
												/>
											) : (
												<TargetIcon size={16} weight="bold" />
											)}
											<span>{goal.title ?? "Untitled"}</span>
										</Link>
									</SidebarMenuButton>

									{/* <GoalActionDropdown goal={goal} side="right">
										<SidebarMenuAction className="group-hover/item:opacity-100 opacity-0 data-[state=open]:opacity-100">
											<DotsThreeVerticalIcon size={12} weight="bold" />
										</SidebarMenuAction>
									</GoalActionDropdown> */}
								</SidebarMenuItem>
							);
						});
					})()}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function TagsGroup() {
	const params = useParams();

	const { tags: globalTags, config } = useAppStore((state) => ({
		tags: state.tags,
		config: state.config,
	}));

	const tags = React.useMemo(() => {
		return globalTags.filter((tag) => tag.pinned);
	}, [globalTags]);

	if (tags.length === 0) return null;

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Tags</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{(() => {
						return tags.map((tag) => {
							const { Icon, weight } = getParsedIcon(tag.icon);

							return (
								<SidebarMenuItem key={tag.id}>
									<SidebarMenuButton
										isActive={params.tagId === tag.id}
										tooltip={tag.label}
										asChild
									>
										<Link href={`/tags/${tag.id}`}>
											{Icon ? (
												<Icon
													size={16}
													weight={weight}
													className={cn(
														config.layout.monochromeIcons || !tag.color
															? undefined
															: ICON_TEXT_COLOR_CLASSNAMES[
																	tag.color as keyof typeof ICON_TEXT_COLOR_CLASSNAMES
																],
														"bg-transparent",
													)}
												/>
											) : (
												<CircleIcon
													size={16}
													weight="fill"
													className={cn(
														config.layout.monochromeIcons
															? undefined
															: ICON_TEXT_COLOR_CLASSNAMES.primary,
														"bg-transparent",
													)}
												/>
											)}
											<span>{tag.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						});
					})()}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
