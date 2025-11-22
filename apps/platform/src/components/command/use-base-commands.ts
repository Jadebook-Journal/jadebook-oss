"use client";

import {
	BrainIcon,
	CubeIcon,
	FileIcon,
	HouseIcon,
	MagnifyingGlassIcon,
	PaletteIcon,
	PlusIcon,
	TagIcon,
	TargetIcon,
	UserIcon,
} from "@phosphor-icons/react";
import { getParsedIcon } from "jadebook/react";
import React from "react";
import { useEntryMutations } from "@/mutations/use-entry-mutations";
import { useAppStore } from "@/providers/app-store-provider";
import { format } from "date-fns";

export const commandGroups = [
	"App",
	"Actions",
	"Settings",
	"Pinned Tags",
	"Pinned Entries",
	"Pinned Goals",
] as const;

export type Command = {
	id: string;
	title: string;
	Icon: React.ElementType;
	group: (typeof commandGroups)[number];
	secondary?: string;
} & (
	| {
			type: "link";
			href: string;
	  }
	| {
			type: "action";
			onClick: () => void;
	  }
);

export const useBaseCommands = () => {
	const { createEntryMutation } = useEntryMutations();

	const { pinnedResources, tags } = useAppStore((store) => ({
		pinnedResources: store.pinnedResources,
		tags: store.tags,
	}));

	// biome-ignore lint/correctness/useExhaustiveDependencies: We don't want to re-render this on every mutation
	const commands = React.useMemo(() => {
		const baseCommands: Command[] = [
			// create a blank journal entry
			{
				id: "create-document",
				title: "Create blank journal entry",
				Icon: PlusIcon,
				type: "action",
				group: "Actions",
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
				id: "create-daily-entry",
				title: "Create daily journal entry",
				Icon: PlusIcon,
				type: "action",
				group: "Actions",
				onClick: () => {
					createEntryMutation.mutate({
						data: {
							title: format(new Date(), "dd MMMM, yyyy"),
							type: "entry",
						},
					});
				},
			},
			// Main App Navigation
			{
				id: "home",
				title: "Home",
				Icon: HouseIcon,
				type: "link",
				group: "App",
				href: "/",
			},
			{
				id: "goals",
				title: "Goals",
				Icon: TargetIcon,
				type: "link",
				group: "App",
				href: "/goals",
			},
			{
				id: "search",
				title: "Search",
				Icon: MagnifyingGlassIcon,
				type: "link",
				group: "App",
				href: "/search",
			},
			// Settings
			{
				id: "account",
				title: "Account",
				Icon: UserIcon,
				type: "link",
				group: "Settings",
				href: "/settings",
			},
			{
				id: "behaviors",
				title: "Behaviors",
				Icon: BrainIcon,
				type: "link",
				group: "Settings",
				href: "/settings/behaviors",
			},
			{
				id: "theme",
				title: "Theme",
				Icon: PaletteIcon,
				type: "link",
				group: "Settings",
				href: "/settings/theme",
			},
			{
				id: "tags",
				title: "Tags",
				Icon: TagIcon,
				type: "link",
				group: "Settings",
				href: "/settings/tags",
			},
			{
				id: "data",
				title: "Import / Export",
				Icon: CubeIcon,
				type: "link",
				group: "Settings",
				href: "/settings/data",
			},
		];

		if (tags.length > 0) {
			const arr: Command[] = tags.map((tag) => ({
				id: tag.id,
				title: `Tag Page: ${tag.label}`,
				Icon: TagIcon,
				type: "link",
				group: "Pinned Tags",
				href: `/tags/${tag.id}`,
			}));

			arr.forEach((command) => {
				baseCommands.push(command);
			});
		}

		if (pinnedResources.entries.length > 0) {
			const arr: Command[] = pinnedResources.entries.map((doc) => {
				const { Icon } = getParsedIcon(doc.icon);

				return {
					id: doc.id,
					title: doc.title || doc.id,
					Icon: Icon || FileIcon,
					type: "link",
					group: "Pinned Entries",
					href: `/journal/${doc.id}`,
				};
			});

			arr.forEach((command) => {
				baseCommands.push(command);
			});
		}

		if (pinnedResources.goals.length > 0) {
			const arr: Command[] = pinnedResources.goals.map((goal) => {
				const { Icon } = getParsedIcon(goal.icon);

				return {
					id: goal.id,
					title: goal.title || goal.id,
					Icon: Icon || TargetIcon,
					type: "link",
					group: "Pinned Goals",
					href: `/goals/${goal.id}`,
				};
			});

			arr.forEach((command) => {
				baseCommands.push(command);
			});
		}

		return baseCommands;
	}, [pinnedResources.entries, pinnedResources.goals, tags]);

	return commands;
};
