import React from "react";
import { Button } from "@/components/ui/button"; // Assuming Button can accept an 'active' prop or uses data attributes
import type { Command, MenuListProps } from "./types";

// Make sure your Button component can handle the 'active' prop
// or uses data attributes like data-state="active" if it's based on Radix UI primitives.
// If using shadcn/ui Button, it doesn't have an 'active' prop directly.
// You might need to conditionally apply a specific variant or className.
// Let's adjust the Button usage assuming conditional class or variant.

export const MenuList = React.forwardRef((props: MenuListProps, ref) => {
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);
	const activeItemRef = React.useRef<HTMLButtonElement>(null); // Keep this ref to target the active item for scrolling
	const [selectedGroupIndex, setSelectedGroupIndex] = React.useState(0);
	const [selectedCommandIndex, setSelectedCommandIndex] = React.useState(0);

	// Reset selection when items filter/change
	React.useEffect(() => {
		setSelectedGroupIndex(0);
		setSelectedCommandIndex(0);
		// Optionally scroll to top when items change drastically
		// scrollContainerRef.current?.scrollTo(0, 0);
	}, []);

	// Scroll the active item into view whenever selection changes
	React.useEffect(() => {
		if (activeItemRef.current) {
			activeItemRef.current.scrollIntoView({
				block: "nearest", // Use 'nearest', 'center', 'start', or 'end'
				// behavior: "smooth" // Optional: adds smooth scrolling
			});
		}
		// Dependency array includes the state that determines the active item
	}, []);

	const selectItem = React.useCallback(
		(groupIndex: number, commandIndex: number) => {
			const command = props.items[groupIndex].commands[commandIndex];
			props.command(command);
		},
		[props], // Keep props here as it contains props.items and props.command
	);

	React.useImperativeHandle(ref, () => ({
		onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
			if (event.key === "ArrowDown") {
				event.preventDefault(); // Prevent default page scrolling
				if (!props.items.length) return false;

				const currentGroupCommands =
					props.items[selectedGroupIndex]?.commands ?? [];
				const nextCommandIndex = selectedCommandIndex + 1;
				let nextGroupIndex = selectedGroupIndex;

				// Move to next command in the same group
				if (nextCommandIndex < currentGroupCommands.length) {
					setSelectedCommandIndex(nextCommandIndex);
					setSelectedGroupIndex(nextGroupIndex);
				}
				// Move to the first command of the next group
				else {
					nextGroupIndex = selectedGroupIndex + 1;
					// Wrap around to the first group if necessary
					if (nextGroupIndex >= props.items.length) {
						nextGroupIndex = 0;
					}
					// Check if the next group exists and has commands
					if (props.items[nextGroupIndex]?.commands?.length > 0) {
						setSelectedCommandIndex(0);
						setSelectedGroupIndex(nextGroupIndex);
					} else {
						// If next group is empty, try wrapping around (should ideally not happen with filtering)
						// Or handle complex scenarios where groups might be empty
						setSelectedCommandIndex(0);
						setSelectedGroupIndex(0); // Fallback to start
					}
				}
				return true;
			}

			if (event.key === "ArrowUp") {
				event.preventDefault(); // Prevent default page scrolling
				if (!props.items.length) return false;

				const prevCommandIndex = selectedCommandIndex - 1;
				let prevGroupIndex = selectedGroupIndex;

				// Move to previous command in the same group
				if (prevCommandIndex >= 0) {
					setSelectedCommandIndex(prevCommandIndex);
					setSelectedGroupIndex(prevGroupIndex);
				}
				// Move to the last command of the previous group
				else {
					prevGroupIndex = selectedGroupIndex - 1;
					// Wrap around to the last group if necessary
					if (prevGroupIndex < 0) {
						prevGroupIndex = props.items.length - 1;
					}
					const prevGroupCommands = props.items[prevGroupIndex]?.commands ?? [];
					if (prevGroupCommands.length > 0) {
						setSelectedCommandIndex(prevGroupCommands.length - 1);
						setSelectedGroupIndex(prevGroupIndex);
					} else {
						// Handle cases with empty previous groups if necessary
						setSelectedCommandIndex(
							props.items[props.items.length - 1]?.commands?.length - 1,
						);
						setSelectedGroupIndex(props.items.length - 1); // Fallback to end
					}
				}
				return true;
			}

			if (event.key === "Enter") {
				event.preventDefault(); // Prevent default form submission/etc.
				if (
					!props.items.length ||
					selectedGroupIndex < 0 || // Should not be < 0 with current logic, but good check
					selectedCommandIndex < 0 // Should not be < 0 with current logic, but good check
				) {
					return false;
				}
				// Check if the selected item actually exists before selecting
				if (props.items[selectedGroupIndex]?.commands[selectedCommandIndex]) {
					selectItem(selectedGroupIndex, selectedCommandIndex);
				} else {
					console.warn("Attempted to select non-existent command."); // Or handle more gracefully
					return false;
				}
				return true;
			}

			return false;
		},
	}));

	const createCommandClickHandler = React.useCallback(
		(groupIndex: number, commandIndex: number) => {
			return () => {
				selectItem(groupIndex, commandIndex);
			};
		},
		[selectItem],
	);

	if (!props.items.length) {
		// Optionally render a "No results" message
		// return <div className="p-2 text-sm text-muted-foreground">No commands match.</div>;
		return null;
	}

	// Helper function to check if an item is selected
	const isSelected = (groupIndex: number, commandIndex: number) => {
		return (
			selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex
		);
	};

	return (
		<>
			{/* Use scrollContainerRef here */}
			<div
				ref={scrollContainerRef}
				// Consider using Radix ScrollArea for better primitives if needed
				className="text-black bg-background shadow-sm border max-h-[300px] overflow-y-auto rounded-md flex-wrap mb-8 p-2" // Use overflow-y-auto
				// Add accessibility attributes
				role="menu"
				aria-orientation="vertical"
			>
				<div className="grid grid-cols-1 gap-0.5">
					{props.items.map((group, groupIndex: number) => (
						// Using Fragments requires careful key placement
						<React.Fragment key={group.title ?? `group-${groupIndex}`}>
							{group.title && ( // Only render title if it exists
								<div
									className="text-neutral-500 text-[0.65rem] col-[1/-1] mx-2 mt-4 font-semibold tracking-wider select-none uppercase first:mt-0.5"
									key={`${group.title}-header`}
								>
									<span id={`group-title-${groupIndex}`}>{group.title}</span>
								</div>
							)}
							{group.commands.map((command: Command, commandIndex: number) => {
								const Icon = command.iconName;
								const selected = isSelected(groupIndex, commandIndex);

								if (!props.uploadFilesEnabled) {
									const disabledCommands = ["image", "audio", "file"];

									if (disabledCommands.includes(command.name)) {
										return null;
									}
								}

								return (
									<Button
										key={
											command.label ?? `command-${groupIndex}-${commandIndex}`
										} // Ensure unique key
										// Attach ref only to the active item
										ref={selected ? activeItemRef : null}
										// Conditionally apply styles/variant for active state
										// Example using data attribute (common with Radix):
										data-state={selected ? "active" : "inactive"}
										// Example using className:
										// className={`justify-start text-foreground ${selected ? "bg-accent text-accent-foreground" : ""}`}
										// Or using variant:
										variant={selected ? "secondary" : "ghost"} // Use appropriate variants
										onClick={createCommandClickHandler(
											groupIndex,
											commandIndex,
										)}
										className="justify-start text-foreground w-full" // Ensure full width if needed
										size="sm"
										// Accessibility for menu items
										role="menuitem"
										aria-selected={selected}
										// Optional: generate unique IDs for aria-activedescendant if needed
										// id={`command-item-${groupIndex}-${commandIndex}`}
									>
										{Icon && <Icon size={16} weight="bold" className="mr-2" />}{" "}
										{/* Add margin */}
										{command.label}
									</Button>
								);
							})}
						</React.Fragment>
					))}
				</div>
			</div>
		</>
	);
});

MenuList.displayName = "MenuList";

export default MenuList;
