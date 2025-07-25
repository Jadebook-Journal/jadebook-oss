export type AppConfig = {
	features: {
		prompted: boolean;
		guided: boolean;
		search: boolean;
		goals: boolean;
		chat: boolean;
		insights: boolean;
	};
	behavior: null;
	layout: {
		sidebarVariant: "default" | "floating" | "inset";
		sidebarHiddenState: "offcanvas" | "icon" | "none";
		monochromeIcons: boolean;
		documentLayout: "grid" | "list" | "monthly";
		sortDate: "created_at" | "updated_at" | "document_date";
		showItemIcon: boolean;
	};
};
