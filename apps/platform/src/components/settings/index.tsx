import React, { useId } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";

export function SettingsContainer({ children }: { children: React.ReactNode }) {
	return <div className="divide-y">{children}</div>;
}

export function SettingsTitle({
	title,
	description,
	actions,
}: {
	title: string;
	description: string;
	actions?: React.ReactNode;
}) {
	return (
		<div className="py-4 flex items-start gap-5">
			<div className="grow">
				<h2 className="text-lg font-bold">{title}</h2>
				<p className="text-xs opacity-60">{description}</p>
			</div>

			{actions && <div className="shrink-0">{actions}</div>}
		</div>
	);
}

export function SettingsSection({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="grid grid-cols-3 py-4 items-start gap-16">
			<div className="space-y-0.5">
				<h2 className="text-sm font-semibold">{title}</h2>
				<p className="text-xs opacity-60">{description}</p>
			</div>

			<div className="col-span-2">{children}</div>
		</div>
	);
}

export function SettingsPropertySection({
	title,
	description,
	children,
}: {
	title: React.ReactNode;
	description?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-2">
			<div className="space-y-1">
				<p className="text-sm font-semibold">{title}</p>

				{description && (
					<p className="text-xs font-medium opacity-80">{description}</p>
				)}
			</div>

			{children}
		</div>
	);
}

// Not fully usable yet
export const SettingsToggle = React.memo(function SettingsToggle({
	label,
	checked,
	onCheckedChange,
	disabled,
}: {
	label: string;
	checked: boolean | null | undefined;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
}) {
	const id = useId();

	return (
		<label
			htmlFor={id}
			className="justify-between items-center cursor-pointer gap-x-5 flex p-2 transition-all ease-in-out animate-in fade-in"
		>
			<p className="select-none">{label}</p>

			<Switch
				id={id}
				checked={checked || false}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
			/>
		</label>
	);
});

export function SettingsPanel({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"px-3 rounded-lg bg-card border divide-y w-full",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function SettingsPanelSection({
	children,
	title,
	description,
}: {
	children: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
}) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: the input is in the children prop
		<label className="flex gap-x-5 md:gap-x-10 py-4 justify-between items-center">
			<div>
				<div className="text-sm font-semibold flex items-center gap-1 whitespace-nowrap">
					{title}
				</div>
				{description && (
					<p className="text-xs text-muted-foreground">{description}</p>
				)}
			</div>

			{children}
		</label>
	);
}

export function SettingsPanelSectionMini({
	children,
	title,
	description,
}: {
	children: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
}) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: the input is in the children prop
		<label className="flex gap-x-5 md:gap-x-10 py-2 justify-between items-center group">
			<div>
				<div className="text-sm font-semibold flex items-center gap-1">
					{title}
				</div>
				{description && (
					<p className="text-xs text-muted-foreground">{description}</p>
				)}
			</div>

			{children}
		</label>
	);
}
