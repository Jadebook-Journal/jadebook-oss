"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export const actionDatePickerStyle =
	"transition-all ease-in-out w-fit text-xs [&_svg]:size-3 [&_svg:not([class*='size-'])]:size-3 h-7 opacity-50 hover:opacity-100 border-input";

export function DatePicker({
	date,
	setDate,
	className,
	disabled,
	tooltip,
	label,
	side = "bottom",
	align = "end",
}: {
	date: Date;
	setDate: (date: Date) => void;
	className?: string;
	disabled?: ComponentProps<typeof Calendar>["disabled"];
	tooltip?: string;
	label?: string;
	side?: ComponentProps<typeof PopoverContent>["side"];
	align?: ComponentProps<typeof PopoverContent>["align"];
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					tooltip={tooltip}
					size="sm"
					variant="outline"
					data-empty={!date}
					className={cn(
						"data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal",
						className,
					)}
				>
					<CalendarIcon />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent side={side} align={align} className="w-auto p-0">
				{label && (
					<div className="p-3 border-b bg-muted flex items-center justify-between shrink-0">
						<Label asChild>
							<p>{label}</p>
						</Label>
					</div>
				)}
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					disabled={disabled}
					required
				/>
			</PopoverContent>
		</Popover>
	);
}
