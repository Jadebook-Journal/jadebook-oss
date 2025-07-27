import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

export function CommandMenu({
	items,
	open,
	setOpen,
	onValueChange,
}: {
	items: { value: string; label: string }[];
	open: boolean;
	setOpen: (open: boolean) => void;
	onValueChange: (value: string) => void;
}) {
	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Search for a Tag" />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{items.map((item) => (
						<CommandItem
							key={item.value}
							onSelect={() => {
								onValueChange(item.value);

								setOpen(false);
							}}
						>
							{item.label}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
