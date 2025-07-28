"use client";

// React Imports
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

// React Imports
import type { ThemeStyleProps, ThemeStyles } from "@/types/theme";

// Utils Imports
import { colorFormatter } from "@/features/theme/color-converter";
import { setShadowVariables } from "@/features/theme/shadows.theme";

// Config Imports
import { COMMON_STYLES } from "@/features/theme/config.theme";
import { useAppStore } from "@/providers/app-store-provider";
import { PenNibStraightIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";

type Theme = "dark" | "light";

const COMMON_NON_COLOR_KEYS = COMMON_STYLES;

const applyCommonStyles = (root: HTMLElement, themeStyles: ThemeStyles) => {
	Object.entries(themeStyles)
		.filter(([key]) =>
			COMMON_NON_COLOR_KEYS.includes(
				key as (typeof COMMON_NON_COLOR_KEYS)[number],
			),
		)
		.forEach(([key, value]) => {
			if (typeof value === "string") {
				root.style.setProperty(`--${key}`, value);
			}
		});
};

const applyThemeColors = (
	root: HTMLElement,
	themeStyles: ThemeStyles,
	mode: Theme,
) => {
	Object.entries(themeStyles[mode]).forEach(([key, value]) => {
		if (
			typeof value === "string" &&
			!COMMON_NON_COLOR_KEYS.includes(
				key as (typeof COMMON_NON_COLOR_KEYS)[number],
			)
		) {
			const hslValue = colorFormatter(value, "oklch");

			root.style.setProperty(`--${key}`, hslValue);
		}
	});
};

export function ThemeLoader({ children }: { children: ReactNode }) {
	const { theme } = useAppStore((state) => ({
		theme: state.theme,
	}));

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		try {
			const root = window.document.documentElement;
			const themeStyles = theme.theme;

			if (!themeStyles) {
				root.removeAttribute("style");

				return;
			}

			const parsedMode = theme.mode === "system" ? "light" : theme.mode;

			// Apply common styles (fonts, radius, etc.)
			applyCommonStyles(root, themeStyles.light as ThemeStyles);

			// Apply theme colors
			applyThemeColors(root, themeStyles as ThemeStyles, parsedMode);

			// Apply shadow variables if they exist in the current mode's styles
			setShadowVariables(themeStyles[parsedMode] as ThemeStyleProps);

			setLoading(false);
		} catch (error) {
			console.error(error);

			setLoading(false);
		}
	}, [theme]);

	// we don't want to have a sharp change in the UI, so we wait for the theme to load
	if (loading) {
		return (
			<div className="size-full min-h-screen flex items-center justify-center transition-all ease-out duration-75">
				<PenNibStraightIcon size={48} weight="bold" className="text-primary" />
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.35, ease: "easeInOut", delay: 0.35 }}
			className="bg-background"
		>
			{children}
		</motion.div>
	);
}
