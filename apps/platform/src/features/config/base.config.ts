import type { AppConfig } from "@/types/config";

/**
 * This is the default theme that is used when no theme is selected, when the user creates an account or as the fallback
 */
export const BASE_CONFIG: AppConfig = {
	features: {
		prompted: true,
		search: true,
		goals: true,
	},
	behavior: null,
	layout: {
		sidebarVariant: "default",
		sidebarHiddenState: "icon",
		monochromeIcons: false,
		journalLayout: "list",
		sortDate: "entry_date",
		showItemIcon: true,
	},
};
