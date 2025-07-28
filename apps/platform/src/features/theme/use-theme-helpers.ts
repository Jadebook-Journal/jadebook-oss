"use client";

import { useAppStore } from "@/providers/app-store-provider";
import { useCallback, useMemo } from "react";
import type { ThemePreset, ThemeStyleProps } from "@/types/theme";
import { toast } from "sonner";
import { defaultThemeState } from "./config.theme";
import {
	parseCssInput,
	parseShadowVariables,
	parseLetterSpacing,
} from "./parse-css-input";

type ThemeHelpersProps = {
	presets: Record<string, ThemePreset>;
	currentPreset: string | null;
	onPresetChange: (preset: string) => void;
};

export const useThemeHelpers = ({
	presets,
	currentPreset,
	onPresetChange,
}: ThemeHelpersProps) => {
	const { theme, updateTheme } = useAppStore((state) => ({
		theme: state.theme,
		updateTheme: state.updateTheme,
	}));

	const presetNames = useMemo(() => {
		const allPresets = Object.keys(presets);

		allPresets.sort((a, b) =>
			a.localeCompare(b, undefined, { sensitivity: "base" }),
		);

		return ["default", ...allPresets.filter((name) => name !== "default")];
	}, [presets]);

	const value = presetNames?.find((name) => name === currentPreset);

	const getThemeColor = (themeName: string, color: keyof ThemeStyleProps) => {
		const theme =
			themeName === "default" ? defaultThemeState : presets[themeName];

		return theme?.light?.[color] || theme?.dark?.[color] || "#000000";
	};

	// Randomize the preset
	const randomize = useCallback(() => {
		const random = Math.floor(Math.random() * presetNames.length);

		onPresetChange(presetNames[random]);
	}, [onPresetChange, presetNames]);

	const handleCssImport = (css: string) => {
		const { lightColors, darkColors } = parseCssInput(css);
		const { lightShadows, darkShadows } = parseShadowVariables(css);
		const letterSpacing = parseLetterSpacing(css);

		// Always preserve both themes and merge with new ones
		const currentLightStyles = theme.theme.light || {};
		const currentDarkStyles = theme.theme.dark || {};

		const updatedSettings = {
			...theme,
			theme: {
				...theme.theme,
				preset: null, // Reset preset as we're using custom theme
				styles: {
					light: {
						...currentLightStyles,
						...lightColors,
						...lightShadows,
						"letter-spacing": letterSpacing,
					},
					dark: {
						...currentDarkStyles,
						...darkColors,
						...darkShadows,
					},
				},
			},
		};

		updateTheme(updatedSettings);

		toast.success("Theme imported successfully", {
			description: "Both light and dark mode styles have been updated",
		});
	};

	return {
		presetNames,
		value,
		getThemeColor,
		randomize,
		handleCssImport,
	};
};
