import { PlusIcon } from "@phosphor-icons/react";
import React from "react";
import { CommandMenu } from "@/components/ui/command-menu";
import { useAppStore } from "@/providers/app-store-provider";
import { RenderTag } from "../tag/tag";

export function TagSelector({
	disabled,
	value,
	onValueChange,
}: {
	disabled?: boolean;
	value: string[];
	onValueChange: (value: string[]) => void;
}) {
	const { globalTags } = useAppStore((store) => ({ globalTags: store.tags }));

	const [open, setOpen] = React.useState(false);

	return (
		<div className="flex flex-wrap gap-1.5 group">
			{globalTags
				.filter((tag) => value.includes(tag.id))
				.map((tag) => (
					<RenderTag
						key={tag.id}
						tag={tag}
						onDelete={
							disabled
								? undefined
								: () => {
										const newValue = value.filter((t) => t !== tag.id);
										onValueChange(newValue);
									}
						}
					/>
				))}

			{!disabled && (
				<button
					type="button"
					onClick={() => {
						setOpen(true);
					}}
					className="opacity-50 sm:opacity-0 group-hover:opacity-50 flex items-center gap-x-1 hover:opacity-100 hover:bg-muted transition ease-in-out rounded text-xs py-1 px-1 cursor-pointer"
				>
					<PlusIcon size={14} weight="bold" />
					Add tag
				</button>
			)}

			<TagSelectorCommandMenu
				open={open}
				setOpen={setOpen}
				value={value}
				onValueChange={(tag) => {
					onValueChange([...value, tag]);
				}}
			/>
		</div>
	);
}

export function TagSelectorCommandMenu({
	open,
	setOpen,
	value,
	onValueChange,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	value: string[];
	onValueChange: (value: string) => void;
}) {
	const { globalTags } = useAppStore((store) => ({ globalTags: store.tags }));

	return (
		<CommandMenu
			open={open}
			setOpen={setOpen}
			items={globalTags
				.filter((tag) => !value.includes(tag.id))
				.map((tag) => ({
					value: tag.id,
					label: tag.label,
				}))}
			onValueChange={onValueChange}
		/>
	);
}
