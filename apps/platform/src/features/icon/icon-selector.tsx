import * as PhosphorIcons from "@phosphor-icons/react";
import {
	generateIconString,
	getParsedIcon,
	ICON_PHOSPHOR_KEYS,
	ICON_TEXT_COLOR_CLASSNAMES,
	PHOSPHOR_ICON_WEIGHTS_ARRAY,
	type PhosphorIconWeight,
} from "jadebook/react";
import { motion } from "motion/react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function IconSelector({
	value,
	onChange,
	includeColor = false,
	emptyState,
	valueState,
	disabled,
	required,
}: {
	onChange: (value: string | null) => void;
	includeColor?: boolean;
	emptyState: React.ReactNode;
	valueState: (props: {
		weight: PhosphorIconWeight;
		color: keyof typeof ICON_TEXT_COLOR_CLASSNAMES;
		key: keyof typeof ICON_PHOSPHOR_KEYS;
		Icon: PhosphorIcons.Icon;
	}) => React.ReactNode;
	disabled?: boolean;
} & (
	| { required: true; value: string }
	| { required?: false; value: string | null }
)) {
	const parsedIcon = React.useMemo(() => getParsedIcon(value), [value]);

	const [tab, setTab] = React.useState<"icons" | "weight" | "color">("icons");

	const [weight, setWeight] = React.useState<PhosphorIconWeight>(
		parsedIcon.weight ?? "regular",
	);

	const [key, setKey] = React.useState<
		keyof typeof ICON_PHOSPHOR_KEYS | null | "null"
	>(parsedIcon?.key ?? "null");

	const [color, setColor] = React.useState<
		keyof typeof ICON_TEXT_COLOR_CLASSNAMES
	>(parsedIcon.color ?? "primary");

	return (
		<Popover modal>
			<PopoverTrigger disabled={disabled} asChild>
				{value
					? (() => {
							// let the parent component decide how to show the empty state
							// we use this for the tag create form and document editor page
							if (
								!parsedIcon ||
								!parsedIcon.key ||
								!key ||
								parsedIcon.key === null
							) {
								return emptyState;
							}

							// Type guard to ensure we have a valid parsed icon
							if (
								parsedIcon.Icon !== null &&
								parsedIcon.weight !== null &&
								parsedIcon.color !== null &&
								parsedIcon.key !== null
							) {
								return valueState(parsedIcon);
							}

							return emptyState;
						})()
					: emptyState}
			</PopoverTrigger>
			<PopoverContent
				side="top"
				align="start"
				className={cn(
					"relative isolate z-[100] w-[16rem] max-h-[500px] p-0",
					tab === "icons" ? "h-[40dvh] max-h-[500px] overflow-hidden" : "h-fit",
				)}
			>
				<motion.div
					className="w-full overflow-hidden"
					animate={{
						height: tab === "icons" ? "100%" : "auto",
					}}
				>
					<Tabs
						className="h-full flex flex-col"
						value={tab}
						onValueChange={(value) =>
							setTab(value as "icons" | "weight" | "color")
						}
					>
						<div className="flex items-center gap-2 shrink-0 w-full bg-muted border-b p-2">
							<p className="text-sm font-semibold w-full capitalize line-clamp-1">
								{value ? parsedIcon.key?.replaceAll("_", " ") : "Select icon"}
							</p>

							<TabsList className="bg-muted/40">
								<TabsTrigger value="icons">
									<PhosphorIcons.DiamondsFourIcon size={12} weight="bold" />
								</TabsTrigger>

								<TabsTrigger value="weight">
									<PhosphorIcons.CubeIcon size={12} weight="bold" />
								</TabsTrigger>

								{includeColor && (
									<TabsTrigger value="color">
										<PhosphorIcons.PaletteIcon
											size={12}
											weight="fill"
											className={ICON_TEXT_COLOR_CLASSNAMES[color]}
										/>
									</TabsTrigger>
								)}
							</TabsList>
						</div>

						<TabsContent
							value="color"
							className="p-2 grid grid-cols-6 h-fit overflow-y-auto"
						>
							{Object.keys(ICON_TEXT_COLOR_CLASSNAMES).map((colorKey) => {
								const typedColorKey =
									colorKey as keyof typeof ICON_TEXT_COLOR_CLASSNAMES;

								return (
									<Button
										disabled={disabled}
										tooltip={
											colorKey.charAt(0).toUpperCase() +
											colorKey.slice(1).toLowerCase()
										}
										key={`icon-color-${typedColorKey}`}
										value={colorKey}
										variant={colorKey === color ? "secondary" : "ghost"}
										size="icon"
										onClick={() => {
											setColor(typedColorKey);

											if (!key || key === "null") return;

											const iconString = generateIconString({
												key,
												weight,
												color: typedColorKey,
											});

											onChange(iconString);
										}}
										className="w-full h-full aspect-square"
									>
										<span className="ring-1 ring-inset ring-foreground/10 rounded-full">
											<PhosphorIcons.CircleIcon
												size={12}
												weight="fill"
												className={ICON_TEXT_COLOR_CLASSNAMES[typedColorKey]}
											/>
										</span>
									</Button>
								);
							})}
						</TabsContent>

						<TabsContent
							value="weight"
							className="p-2 flex flex-col grow overflow-y-auto"
						>
							{PHOSPHOR_ICON_WEIGHTS_ARRAY.map((weightKey) => (
								<Button
									disabled={disabled}
									key={`icon-weight-${weightKey}`}
									value={weightKey}
									variant={weightKey === weight ? "secondary" : "ghost"}
									size="sm"
									className="capitalize w-full justify-start"
									onClick={() => {
										setWeight(weightKey);

										if (!key || key === "null") return;

										const iconString = generateIconString({
											key,
											weight: weightKey,
											color: includeColor ? color : "primary",
										});

										onChange(iconString);
									}}
								>
									<PhosphorIcons.CubeIcon size={12} weight={weightKey} />
									{weightKey}
								</Button>
							))}
						</TabsContent>

						<TabsContent
							value="icons"
							className="p-2 flex flex-col grow overflow-y-auto text-foreground"
						>
							<div className="grid grid-cols-6 gap-1">
								{!required && (
									<button
										type="button"
										disabled={disabled}
										key="icon-null"
										className="hover:bg-accent hover:text-accent-foreground aspect-square w-full flex items-center justify-center rounded-lg"
										onClick={() => {
											setKey("null");
											onChange(null);
										}}
									>
										<PhosphorIcons.EmptyIcon
											size={16}
											weight={weight}
											className={cn(
												includeColor && ICON_TEXT_COLOR_CLASSNAMES[color],
											)}
										/>
									</button>
								)}

								{Object.keys(ICON_PHOSPHOR_KEYS).map((iconKey) => {
									const typedIconKey =
										iconKey as keyof typeof ICON_PHOSPHOR_KEYS;
									const parsedIconKey = ICON_PHOSPHOR_KEYS[
										typedIconKey
									] as keyof typeof PhosphorIcons;

									// biome-ignore lint/performance/noDynamicNamespaceImportAccess: this is a valid use case — we literally have no other choice. Might be worth optimizing in the future.
									const Icon = PhosphorIcons[
										parsedIconKey
									] as PhosphorIcons.Icon;

									return (
										<button
											type="button"
											disabled={disabled}
											key={`icon-${iconKey}`}
											className={cn(
												"hover:bg-accent hover:text-accent-foreground aspect-square w-full flex items-center justify-center rounded-lg transition-all ease-in-out",
												iconKey === key && "bg-secondary",
											)}
											onClick={() => {
												setKey(typedIconKey);

												console.log(typedIconKey, weight, color);

												const generatedIcon = generateIconString({
													key: typedIconKey,
													weight,
													color: includeColor ? color : "primary",
												});

												onChange(generatedIcon);
											}}
										>
											<Icon
												size={16}
												weight={weight}
												className={cn(
													includeColor && ICON_TEXT_COLOR_CLASSNAMES[color],
												)}
											/>
										</button>
									);
								})}
							</div>
						</TabsContent>
					</Tabs>
				</motion.div>
			</PopoverContent>
		</Popover>
	);
}
