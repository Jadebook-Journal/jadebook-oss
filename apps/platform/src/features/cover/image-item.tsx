import Image from "next/image";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ImageItem({
	onClick,
	data,
	label,
}: {
	onClick: () => void;
	label: string;
	data:
		| {
				type: "image";
				src: string;
		  }
		| {
				type: "color";
				className: string;
		  };
}) {
	return (
		<Tooltip disableHoverableContent>
			<TooltipTrigger asChild>
				<button
					type="button"
					className="rounded aspect-16/8 hover:scale-95 transition-all ease-in-out border overflow-clip relative block"
					onClick={onClick}
				>
					{data.type === "image" ? (
						<Image
							src={data.src}
							alt={label}
							loading="lazy"
							fill
							className="object-cover"
							unoptimized
						/>
					) : (
						<div className={cn(data.className, "size-full")} />
					)}
				</button>
			</TooltipTrigger>
			<TooltipContent className="capitalize" side="bottom">
				{label}
			</TooltipContent>
		</Tooltip>
	);
}
