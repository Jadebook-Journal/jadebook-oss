import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
				outline:
					"border bg-background hover:bg-accent hover:text-accent-foreground",
				outlineDestructive:
					"border border-input bg-transparent hover:bg-destructive hover:text-white",
				select:
					"border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				ghostDestructive: "hover:bg-destructive/90 hover:text-white",
				link: "text-primary underline-offset-4 hover:underline",
				action:
					"border border-input hover:bg-accent hover:text-accent-foreground opacity-50 hover:opacity-100 bg-background",
				logo: "border bg-muted hover:bg-accent hover:text-accent-foreground",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				action: "h-7 rounded-md gap-1.5 px-2.5 text-xs",
				icon: "size-9",
				iconSm: "size-7",
				iconAction: "h-7 w-8 [&_svg]:size-4.5",
				logo: "size-14 [&_svg]:size-6 [&_svg:not([class*='size-'])]:size-6",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	ref,
	type = "button",
	className,
	variant,
	size,
	asChild = false,
	tooltip,
	tooltipShortcut,
	active,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		tooltip?: string;
		tooltipShortcut?: string[];
		active?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	const parsedVariant = () => {
		if (active === undefined) {
			return variant;
		}

		if (active && variant === "ghost") {
			return "secondary";
		}

		return variant;
	};

	if (tooltip) {
		return (
			<Tooltip disableHoverableContent>
				<TooltipTrigger asChild>
					<Comp
						className={cn(
							buttonVariants({
								variant: parsedVariant(),
								size,
							}),
							className,
						)}
						ref={ref}
						type={type}
						{...props}
					/>
				</TooltipTrigger>
				<TooltipContent shortcut={tooltipShortcut}>{tooltip}</TooltipContent>
			</Tooltip>
		);
	}

	return (
		<Comp
			data-slot="button"
			className={cn(
				buttonVariants({ variant: parsedVariant(), size }),
				className,
			)}
			ref={ref}
			type={type}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
