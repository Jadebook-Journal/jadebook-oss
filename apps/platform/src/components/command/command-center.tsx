"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";
import { useAppStore } from "@/providers/app-store-provider";
import { commandGroups, useBaseCommands } from "./use-base-commands";

export function GlobalCommandCenter() {
	const router = useRouter();

	const { commandCenterOpen: open, updateCommandCenterOpen: setOpen } =
		useAppStore((store) => ({
			commandCenterOpen: store.commandCenterOpen,
			updateCommandCenterOpen: store.updateCommandCenterOpen,
		}));

	const commands = useBaseCommands();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen(!open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [open, setOpen]);

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				{commandGroups.map((group) => {
					return (
						<CommandGroup key={group} heading={group}>
							{commands
								.filter((command) => command.group === group)
								.map((command) => {
									if (command.type === "link") {
										return (
											<CommandItem
												value={`${command.title} ${command.id}`}
												key={`${group}-${command.id}`}
												onSelect={() => {
													router.push(command.href);

													setOpen(false);
												}}
											>
												<command.Icon />
												<span>{command.title}</span>

												{command.secondary && (
													<CommandShortcut>{command.secondary}</CommandShortcut>
												)}
											</CommandItem>
										);
									}

									if (command.type === "action") {
										return (
											<CommandItem
												value={`${command.title} ${command.id}`}
												key={`${group}-${command.id}`}
												onSelect={() => {
													command.onClick();

													setOpen(false);
												}}
											>
												<command.Icon />
												<span>{command.title}</span>

												{command.secondary && (
													<CommandShortcut>{command.secondary}</CommandShortcut>
												)}
											</CommandItem>
										);
									}
								})}
						</CommandGroup>
					);
				})}
			</CommandList>
		</CommandDialog>
	);
}
