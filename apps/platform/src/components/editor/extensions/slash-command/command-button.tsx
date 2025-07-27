import type { Icon } from "@phosphor-icons/react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type CommandButtonProps = {
	active?: boolean;
	description: string;
	icon: Icon;
	onClick: () => void;
	title: string;
};

export const CommandButton = forwardRef<HTMLButtonElement, CommandButtonProps>(
	({ active, icon: Icon, onClick, title }, ref) => {
		const wrapperClass = cn(
			"flex text-neutral-500 items-center text-xs font-semibold justify-start p-1.5 gap-2 rounded",
			!active && "bg-transparent hover:bg-neutral-50 hover:text-black",
			active && "bg-neutral-100 text-black hover:bg-neutral-100",
		);

		return (
			<button
				type="button"
				ref={ref}
				onClick={onClick}
				className={wrapperClass}
			>
				<Icon size={12} weight="bold" />
				<div className="flex flex-col items-start justify-start">
					<div className="text-sm font-medium">{title}</div>
				</div>
			</button>
		);
	},
);

CommandButton.displayName = "CommandButton";
