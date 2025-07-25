import type { themeAccentPresets, themeBasePresets } from "./presets";

export type Theme = {
	features: {
		prompted: boolean;
		guided: boolean;
		search: boolean;
		goals: boolean;
		chat: boolean;
		insights: boolean;
	};
	behavior: {
		disablePromptRefresh: boolean;
	};
	layout: {
		sidebarVariant: "default" | "floating" | "inset";
		sidebarHiddenState: "offcanvas" | "icon" | "none";
		monochromeIcons: boolean;
		documentLayout: "grid" | "list" | "monthly";
		sortDate: "created_at" | "updated_at" | "document_date";
		showItemIcon: boolean;
	};
	color: {
		base_theme: keyof typeof themeBasePresets;
		accent_theme: keyof typeof themeAccentPresets;
	};
};
