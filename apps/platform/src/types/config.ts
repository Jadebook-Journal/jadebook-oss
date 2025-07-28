export type AppConfig = {
	features: {
		prompted: boolean;
		search: boolean;
		goals: boolean;
	};
	behavior: null;
	layout: {
		sidebarVariant: "default" | "floating" | "inset";
		sidebarHiddenState: "offcanvas" | "icon" | "none";
		monochromeIcons: boolean;
		journalLayout: "grid" | "list" | "monthly";
		sortDate: "created_at" | "updated_at" | "entry_date";
		showItemIcon: boolean;
	};
};
