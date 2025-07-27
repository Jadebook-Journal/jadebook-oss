import { ArrowArcLeftIcon } from "@phosphor-icons/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export type ColorButtonProps = {
	color?: string;
	active?: boolean;
	onColorChange?: (color: string) => void;
};

export const themeColors = [
	"#fb7185",
	"#fdba74",
	"#d9f99d",
	"#a7f3d0",
	"#a5f3fc",
	"#a5b4fc",
];

export const ColorButton = React.memo(
	({ color, active, onColorChange }: ColorButtonProps) => {
		const wrapperClassName = cn(
			"flex items-center justify-center px-1.5 py-1.5 rounded group",
			!active && "hover:bg-neutral-100",
			active && "bg-neutral-100",
		);
		const bubbleClassName = cn(
			"w-4 h-4 rounded bg-slate-100 shadow-xs ring-offset-2 ring-current",
			!active && `hover:ring-1`,
			active && `ring-1`,
		);

		const handleClick = React.useCallback(() => {
			if (onColorChange) {
				onColorChange(color || "");
			}
		}, [onColorChange, color]);

		return (
			<button type="button" onClick={handleClick} className={wrapperClassName}>
				<div
					style={{ backgroundColor: color, color: color }}
					className={bubbleClassName}
				/>
			</button>
		);
	},
);

ColorButton.displayName = "ColorButton";

export type ColorPickerProps = {
	color?: string;
	onChange?: (color: string) => void;
	onClear?: () => void;
};

export const ColorPicker = ({ color, onChange, onClear }: ColorPickerProps) => {
	const [colorInputValue, setColorInputValue] = React.useState(color || "");

	const handleColorUpdate = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setColorInputValue(event.target.value);
		},
		[],
	);

	const handleColorChange = React.useCallback(() => {
		const isCorrectColor = /^#([0-9A-F]{3}){1,2}$/i.test(colorInputValue);

		if (!isCorrectColor) {
			if (onChange) {
				onChange("");
			}

			return;
		}

		if (onChange) {
			onChange(colorInputValue);
		}
	}, [colorInputValue, onChange]);

	return (
		<div className="flex flex-col items-center gap-2 p-1 w-full">
			<div className="flex flex-wrap items-center gap-0.5 w-full">
				{themeColors.map((currentColor) => (
					<ColorButton
						active={currentColor === color}
						color={currentColor}
						key={currentColor}
						onColorChange={(color: string) => {
							if (onChange) {
								onChange(color);
							}

							setColorInputValue(color);
						}}
					/>
				))}
				<Button
					tooltip="Reset color to default"
					onClick={onClear}
					size="iconSm"
					variant="ghost"
				>
					<ArrowArcLeftIcon size={12} weight="bold" />
				</Button>
			</div>
		</div>
	);
};
