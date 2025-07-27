import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import type { Command, MenuListProps } from "./types";

// Flatten commands from groups for easier navigation
type FlatCommand = Command & { groupTitle?: string; flatIndex: number };

export const MenuList = forwardRef<any, MenuListProps>((props, ref) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	// Flatten commands from all groups for easier navigation
	const flatCommands: FlatCommand[] = useMemo(() => {
		const commands: FlatCommand[] = [];
		let currentIndex = 0;

		props.items.forEach((group) => {
			group.commands.forEach((command) => {
				commands.push({
					...command,
					groupTitle: group.title,
					flatIndex: currentIndex,
				});
				currentIndex++;
			});
		});

		return commands;
	}, [props.items]);

	// Group commands by their group title for rendering
	const groupedCommands = useMemo(() => {
		const groups: { [key: string]: FlatCommand[] } = {};

		flatCommands.forEach((command) => {
			const groupTitle = command.groupTitle || "Commands";
			if (!groups[groupTitle]) {
				groups[groupTitle] = [];
			}
			groups[groupTitle].push(command);
		});

		return groups;
	}, [flatCommands]);

	const selectItem = useCallback(
		(index: number) => {
			const command = flatCommands[index];
			if (command) {
				props.command(command);
			}
		},
		[flatCommands, props.command],
	);

	const upHandler = useCallback(() => {
		setSelectedIndex(
			(prev) => (prev + flatCommands.length - 1) % flatCommands.length,
		);
	}, [flatCommands.length]);

	const downHandler = useCallback(() => {
		setSelectedIndex((prev) => (prev + 1) % flatCommands.length);
	}, [flatCommands.length]);

	const enterHandler = useCallback(() => {
		selectItem(selectedIndex);
	}, [selectedIndex, selectItem]);

	// Reset selection when items change
	// biome-ignore lint/correctness/useExhaustiveDependencies: We need to update the index whenever the items change
	useEffect(() => {
		setSelectedIndex(0);
	}, [props.items]);

	useImperativeHandle(
		ref,
		() => ({
			onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
				if (event.key === "ArrowUp") {
					event.preventDefault();
					upHandler();
					return true;
				}

				if (event.key === "ArrowDown") {
					event.preventDefault();
					downHandler();
					return true;
				}

				if (event.key === "Enter") {
					event.preventDefault();
					enterHandler();
					return true;
				}

				return false;
			},
		}),
		[upHandler, downHandler, enterHandler],
	);

	if (flatCommands.length === 0) {
		return null;
	}

	return (
		<div
			className="text-black bg-background shadow-sm border max-h-[300px] overflow-y-auto rounded-md flex-wrap mb-8 p-2"
			role="menu"
			aria-orientation="vertical"
		>
			<div className="grid grid-cols-1 gap-0.5">
				{Object.entries(groupedCommands).map(
					([groupTitle, commands], groupIndex) => (
						<React.Fragment key={groupTitle}>
							{groupTitle && (
								<div
									className="text-neutral-500 text-[0.65rem] col-[1/-1] mx-2 mt-4 font-semibold tracking-wider select-none uppercase first:mt-0.5"
									key={`${groupTitle}-header`}
								>
									<span id={`group-title-${groupIndex}`}>{groupTitle}</span>
								</div>
							)}
							{commands.map((command) => {
								const Icon = command.iconName;
								const isSelected = selectedIndex === command.flatIndex;

								return (
									<Button
										key={`${command.name}-${command.flatIndex}`}
										variant={isSelected ? "secondary" : "ghost"}
										onClick={() => selectItem(command.flatIndex)}
										className="justify-start text-foreground w-full"
										size="sm"
										role="menuitem"
										aria-selected={isSelected}
										data-state={isSelected ? "active" : "inactive"}
									>
										{Icon && <Icon size={16} weight="bold" className="mr-2" />}
										{command.label}
									</Button>
								);
							})}
						</React.Fragment>
					),
				)}
			</div>
		</div>
	);
});

MenuList.displayName = "MenuList";

export default MenuList;
