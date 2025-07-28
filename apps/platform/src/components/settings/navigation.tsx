import {
	BrainIcon,
	CubeIcon,
	ImageIcon,
	PaletteIcon,
	TagIcon,
	UserIcon,
} from "@phosphor-icons/react";

export const settingsNavigation = [
	{
		pathname: "/settings",
		label: "Account",
		icon: <UserIcon size={8} weight="bold" />,
	},
	{
		pathname: "/settings/config",
		label: "Config",
		icon: <BrainIcon size={8} weight="bold" />,
	},
	{
		pathname: "/settings/theme",
		label: "Theme",
		icon: <PaletteIcon size={8} weight="bold" />,
	},
	{
		pathname: "/settings/tags",
		label: "Tags",
		icon: <TagIcon size={8} weight="bold" />,
	},
	{
		pathname: "/settings/assets",
		label: "Assets",
		icon: <ImageIcon size={8} weight="bold" />,
	},
	{
		pathname: "/settings/data",
		label: "Data",
		icon: <CubeIcon size={8} weight="bold" />,
	},
];
