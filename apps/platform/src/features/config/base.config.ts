import type { AppConfig } from "@/types/config";

/**
 * This is the default theme that is used when no theme is selected, when the user creates an account or as the fallback
 */
export const BASE_CONFIG: AppConfig = {
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
};
