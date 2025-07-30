import { cn } from "@/lib/utils";

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
				<div className="text-sm font-semibold flex items-center gap-1 line-clamp-1">
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
