"use client";

import { PageSection } from "@/components/app/page";
import { PageContainer } from "@/components/app/page-container";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { ThemeSaveButton } from "@/components/settings/settings-save-button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colorFormatter } from "@/features/theme/color-converter";
import {
	DEFAULT_FONT_SANS,
	DEFAULT_FONT_SERIF,
} from "@/features/theme/config.theme";
import CssImportDialog from "@/features/theme/css-import-dialog";
import ThemeFontSelect from "@/features/theme/font-selector.theme";
import {
	getAppliedThemeFont,
	sansSerifFonts,
	serifFonts,
} from "@/features/theme/fonts.theme";
import ThemePresetSelect from "@/features/theme/preset-selector.theme";
import { getPresetThemeStyles, presets } from "@/features/theme/presets.theme";
import { RandomizerButton } from "@/features/theme/randomizer-button";
import { useThemeHelpers } from "@/features/theme/use-theme-helpers";
import { useAppStore } from "@/providers/app-store-provider";
import type { ThemeStyleProps } from "@/types/theme";
import React from "react";
import type { InputHTMLAttributes } from "react";

export function ThemePage() {
	return (
		<PageContainer title="Theme" actions={<ThemeSaveButton />}>
			<ThemePresets />
			<SettingsTheme />
		</PageContainer>
	);
}

const ThemePresets = () => {
	const { theme, updateTheme } = useAppStore((state) => ({
		theme: state.theme,
		updateTheme: state.updateTheme,
	}));

	const [importDialogOpen, setImportDialogOpen] = React.useState(false);

	const { randomize } = useThemeHelpers({
		presets,
		currentPreset: theme.preset,
		onPresetChange: (preset) => {
			updateTheme({
				...theme,
				preset,
				theme: getPresetThemeStyles(preset),
			});
		},
	});

	return (
		<PageSection
			title="Theme Presets"
			actions={
				<>
					<CssImportDialog
						open={importDialogOpen}
						onOpenChange={setImportDialogOpen}
						onImport={() => {
							setImportDialogOpen(false);
						}}
					/>
					<RandomizerButton randomize={randomize} />
				</>
			}
		>
			<SettingsPanel>
				<SettingsPanelSection title="Presets">
					<ThemePresetSelect
						presets={presets}
						currentPreset={theme.preset}
						onPresetChange={(preset) => {
							updateTheme({
								...theme,
								preset,
								theme: getPresetThemeStyles(preset),
							});
						}}
					/>
				</SettingsPanelSection>
			</SettingsPanel>
		</PageSection>
	);
};

const ColorItem = React.memo(
	({
		label,
		colorKey,
		updateColor,
		currentTheme,
	}: {
		label: string;
		colorKey: keyof ThemeStyleProps;
		updateColor: (key: keyof ThemeStyleProps, value: string) => void;
		currentTheme: Partial<ThemeStyleProps>;
	}) => {
		return (
			<SettingsPanelSection
				title={label}
				description={
					currentTheme?.[colorKey]
						? colorFormatter(currentTheme[colorKey], "hex")
						: currentTheme?.[colorKey]
				}
			>
				<ColorSwatch
					label={label}
					value={currentTheme?.[colorKey] ?? ""}
					onChange={(value) => {
						updateColor(colorKey as keyof ThemeStyleProps, value);
					}}
				/>
			</SettingsPanelSection>
		);
	},
);

function SettingsTheme() {
	const { theme, updateTheme } = useAppStore((state) => ({
		theme: state.theme,
		updateTheme: state.updateTheme,
	}));

	const currentTheme = theme.theme[
		theme.mode === "system" ? "light" : theme.mode
	] as Partial<ThemeStyleProps>;

	// biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to re-run the effect when the updateTheme changes
	const updateStyle = React.useCallback(
		(key: keyof ThemeStyleProps, value: string) => {
			if (!currentTheme) return;

			// apply common styles to both light and dark modes
			if (
				key === "font-sans" ||
				key === "font-serif" ||
				key === "font-mono" ||
				key === "radius"
			) {
				updateTheme({
					mode: theme.mode,
					preset: theme.preset,
					theme: {
						light: { ...theme.theme.light, [key]: value },
						dark: { ...theme.theme.dark, [key]: value },
					},
				});

				return;
			}

			updateTheme({
				mode: theme.mode,
				preset: theme.preset,
				theme: {
					...theme.theme,
					[key]: value,
				},
			});
		},
		[currentTheme, theme.theme],
	);

	return (
		<>
			<PageSection
				title="Fonts"
				description="Almost everything will use the sans-serif font, but there might be rare cases where we use a different font."
			>
				<SettingsPanel>
					<SettingsPanelSection title="Sans-Serif">
						<ThemeFontSelect
							fonts={sansSerifFonts}
							defaultValue={DEFAULT_FONT_SANS}
							currentFont={getAppliedThemeFont(currentTheme, "font-sans")}
							onFontChange={(value) => updateStyle("font-sans", value)}
						/>
					</SettingsPanelSection>
					<SettingsPanelSection title="Serif">
						<ThemeFontSelect
							fonts={serifFonts}
							defaultValue={DEFAULT_FONT_SERIF}
							currentFont={getAppliedThemeFont(currentTheme, "font-serif")}
							onFontChange={(value) => updateStyle("font-serif", value)}
						/>
					</SettingsPanelSection>
					<SettingsPanelSection title="Mono">
						<ThemeFontSelect
							fonts={serifFonts}
							defaultValue={DEFAULT_FONT_SERIF}
							currentFont={getAppliedThemeFont(currentTheme, "font-serif")}
							onFontChange={(value) => updateStyle("font-serif", value)}
						/>
					</SettingsPanelSection>
				</SettingsPanel>
			</PageSection>

			<PageSection title="Color Theme">
				<SettingsPanel>
					<SettingsPanelSection title="Base Mode">
						<Tabs
							value={theme.mode}
							onValueChange={(value) => {
								updateTheme({
									...theme,
									mode: value as "light" | "dark",
								});
							}}
						>
							<TabsList>
								<TabsTrigger value="light">Light</TabsTrigger>
								<TabsTrigger value="dark">Dark</TabsTrigger>
							</TabsList>
						</Tabs>
					</SettingsPanelSection>
				</SettingsPanel>
			</PageSection>

			<PageSection title="Brand Colors">
				<SettingsPanel>
					<ColorItem
						label="Primary"
						colorKey="primary"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Primary Foreground"
						colorKey="primary-foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Secondary"
						colorKey="secondary"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Secondary Foreground"
						colorKey="secondary-foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Destructive"
						colorKey="destructive"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
				</SettingsPanel>
			</PageSection>

			<PageSection title="Base Colors">
				<SettingsPanel>
					<ColorItem
						label="Background"
						colorKey="background"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Foreground"
						colorKey="foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Card"
						colorKey="card"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Card Foreground"
						colorKey="card-foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Popover"
						colorKey="popover"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Popover Foreground"
						colorKey="popover-foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
				</SettingsPanel>
			</PageSection>

			<PageSection title="Other Colors">
				<SettingsPanel>
					<ColorItem
						label="Muted"
						colorKey="muted"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Muted Foreground"
						colorKey="muted-foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Accent"
						colorKey="accent"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Accent Foreground"
						colorKey="accent-foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Border"
						colorKey="border"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Input"
						colorKey="input"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Ring"
						colorKey="ring"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
				</SettingsPanel>
			</PageSection>

			<PageSection title="Sidebar Colors">
				<SettingsPanel>
					<ColorItem
						label="Background"
						colorKey="sidebar"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Foreground"
						colorKey="sidebar-foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Primary"
						colorKey="sidebar-primary"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Primary Foreground"
						colorKey="sidebar-primary-foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Accent"
						colorKey="sidebar-accent"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Accent Foreground"
						colorKey="sidebar-accent-foreground"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Border"
						colorKey="sidebar-border"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Ring"
						colorKey="sidebar-ring"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
				</SettingsPanel>
			</PageSection>

			<PageSection title="Chart Colors">
				<SettingsPanel>
					<ColorItem
						label="Chart 1"
						colorKey="chart-1"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Chart 2"
						colorKey="chart-2"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Chart 3"
						colorKey="chart-3"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Chart 4"
						colorKey="chart-4"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
					<ColorItem
						label="Chart 5"
						colorKey="chart-5"
						currentTheme={currentTheme}
						updateColor={updateStyle}
					/>
				</SettingsPanel>
			</PageSection>
		</>
	);
}

/**
 * This part is a modified version of the debounced input from shadcn-studio
 * https://github.com/themeselection/shadcn-studio/blob/main/src/components/customizer/ThemeColorPanel.tsx
 */

const DebouncedInput = ({
	value: initialValue,
	onChange,
	debounce = 300,
	...props
}: {
	value: string;
	onChange: (value: string) => void;
	debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
	// States
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to re-run the effect when the debounce changes
	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<input
			{...props}
			type="color"
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
};

export const ColorSwatch = ({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) => {
	const [localValue, setLocalValue] = React.useState(value);

	// Update local value when theme value changes
	React.useEffect(() => {
		setLocalValue(value);
	}, [value]);

	return (
		<div className="flex items-center rounded-md border overflow-hidden hover:border-primary transition-all ease-in-out">
			<div
				className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden aspect-square"
				style={{ backgroundColor: localValue }}
			>
				<DebouncedInput
					id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
					value={localValue}
					onChange={(localValue) => {
						setLocalValue(localValue);
						onChange(localValue);
					}}
					className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
				/>
			</div>

			<input
				type="text"
				value={localValue}
				onChange={(e) => {
					setLocalValue(e.target.value);
					onChange(e.target.value);
				}}
				className="flex-1 px-3 py-2 text-sm h-8 focus-visible:outline-none"
			/>
		</div>
	);
};
