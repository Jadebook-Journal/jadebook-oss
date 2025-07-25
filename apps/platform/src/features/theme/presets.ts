import type { Theme } from ".";

/**
 * These are the base themes that impact all the colors available
 */
export const themeBasePresets = {
	light: {
		background: "oklch(1 0 0)",
		foreground: "oklch(0.147 0.004 49.25)",
		card: "oklch(1 0 0)",
		card_foreground: "oklch(0.147 0.004 49.25)",
		popover: "oklch(1 0 0)",
		popover_foreground: "oklch(0.147 0.004 49.25)",
		primary: "oklch(0.216 0.006 56.043)",
		primary_foreground: "oklch(0.985 0.001 106.423)",
		secondary: "oklch(0.97 0.001 106.424)",
		secondary_foreground: "oklch(0.216 0.006 56.043)",
		muted: "oklch(0.97 0.001 106.424)",
		muted_foreground: "oklch(0.553 0.013 58.071)",
		accent: "oklch(0.97 0.001 106.424)",
		accent_foreground: "oklch(0.216 0.006 56.043)",
		destructive: "oklch(0.577 0.245 27.325)",
		border: "oklch(0.923 0.003 48.717)",
		input: "oklch(0.923 0.003 48.717)",
		ring: "oklch(0.709 0.01 56.259)",
		color1: "oklch(0.646 0.222 41.116)",
		color2: "oklch(0.6 0.118 184.704)",
		color3: "oklch(0.398 0.07 227.392)",
		color4: "oklch(0.828 0.189 84.429)",
		color5: "oklch(0.769 0.188 70.08)",
		sidebar: "oklch(0.985 0.001 106.423)",
		sidebar_foreground: "oklch(0.147 0.004 49.25)",
		sidebar_primary: "oklch(0.216 0.006 56.043)",
		sidebar_primary_foreground: "oklch(0.985 0.001 106.423)",
		sidebar_accent: "oklch(0.97 0.001 106.424)",
		sidebar_accent_foreground: "oklch(0.216 0.006 56.043)",
		sidebar_border: "oklch(0.923 0.003 48.717)",
		sidebar_ring: "oklch(0.709 0.01 56.259)",
	},
	dark: {
		background: "oklch(0.147 0.004 49.25)",
		foreground: "oklch(0.985 0.001 106.423)",
		card: "oklch(0.216 0.006 56.043)",
		card_foreground: "oklch(0.985 0.001 106.423)",
		popover: "oklch(0.216 0.006 56.043)",
		popover_foreground: "oklch(0.985 0.001 106.423)",
		primary: "oklch(0.923 0.003 48.717)",
		primary_foreground: "oklch(0.216 0.006 56.043)",
		secondary: "oklch(0.268 0.007 34.298)",
		secondary_foreground: "oklch(0.985 0.001 106.423)",
		muted: "oklch(0.268 0.007 34.298)",
		muted_foreground: "oklch(0.709 0.01 56.259)",
		accent: "oklch(0.268 0.007 34.298)",
		accent_foreground: "oklch(0.985 0.001 106.423)",
		destructive: "oklch(0.704 0.191 22.216)",
		border: "oklch(1 0 0 / 10%)",
		input: "oklch(1 0 0 / 15%)",
		ring: "oklch(0.553 0.013 58.071)",
		color1: "oklch(0.488 0.243 264.376)",
		color2: "oklch(0.696 0.17 162.48)",
		color3: "oklch(0.769 0.188 70.08)",
		color4: "oklch(0.627 0.265 303.9)",
		color5: "oklch(0.645 0.246 16.439)",
		sidebar: "oklch(0.205 0 0)",
		sidebar_foreground: "oklch(0.985 0 0)",
		sidebar_primary: "oklch(0.488 0.243 264.376)",
		sidebar_primary_foreground: "oklch(0.985 0 0)",
		sidebar_accent: "oklch(0.269 0 0)",
		sidebar_accent_foreground: "oklch(0.985 0 0)",
		sidebar_border: "oklch(1 0 0 / 10%)",
		sidebar_ring: "oklch(0.439 0 0)",
	},
} as const;

export const baseThemes = Object.keys(
	themeBasePresets,
) as (keyof typeof themeBasePresets)[];

/**
 * These are accent colors — these impact the primary, primary_foreground, and ring (primary) variables
 */
export const themeAccentPresets = {
	green: {
		background: "hsl(160, 100%, 30%)",
		foreground: "hsl(0, 0%, 98%)",
	},
	blue: {
		background: "hsl(206, 100%, 50%)",
		foreground: "hsl(0, 0%, 98%)",
	},
	indigo: {
		background: "hsl(226, 70%, 55%)",
		foreground: "hsl(0, 0%, 98%)",
	},
	orange: {
		background: "hsl(29, 100%, 44%)",
		foreground: "hsl(0, 0%, 98%)",
	},
	mint: {
		background: "hsl(167, 46%, 65%)",
		foreground: "hsl(0, 0%, 98%)",
	},
	plum: {
		background: "hsl(292, 45%, 51%)",
		foreground: "hsl(0, 0%, 98%)",
	},
	bronze: {
		background: "hsl(18, 20%, 54%)",
		foreground: "hsl(0, 0%, 98%)",
	},
} as const;

export const accentThemes = Object.keys(
	themeAccentPresets,
) as (keyof typeof themeAccentPresets)[];

/**
 * This is the default theme that is used when no theme is selected, when the user creates an account or as the fallback
 */
export const defaultTheme: Theme = {
	features: {
		prompted: true,
		guided: true,
		search: true,
		goals: true,
		chat: true,
		insights: true,
	},
	behavior: {
		disablePromptRefresh: false,
	},
	layout: {
		sidebarVariant: "default",
		sidebarHiddenState: "icon",
		monochromeIcons: false,
		documentLayout: "list",
		sortDate: "updated_at",
		showItemIcon: true,
	},
	color: {
		base_theme: "light",
		accent_theme: "green",
	},
};
