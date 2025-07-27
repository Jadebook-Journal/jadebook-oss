import {
	ListBulletsIcon,
	ListNumbersIcon,
	QuotesIcon,
	TextHOneIcon,
	TextHThreeIcon,
	TextHTwoIcon,
} from "@phosphor-icons/react";
import type { Group } from "./types";

export const GROUPS: Group[] = [
	{
		name: "format",
		title: "Format",
		commands: [
			{
				name: "heading1",
				label: "Heading 1",
				iconName: TextHOneIcon,
				description: "High priority section title",
				aliases: ["h1"],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 1 }).run();
				},
			},
			{
				name: "heading2",
				label: "Heading 2",
				iconName: TextHTwoIcon,
				description: "Medium priority section title",
				aliases: ["h2"],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 2 }).run();
				},
			},
			{
				name: "heading3",
				label: "Heading 3",
				iconName: TextHThreeIcon,
				description: "Low priority section title",
				aliases: ["h3"],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 3 }).run();
				},
			},
			{
				name: "bulletList",
				label: "Bullet List",
				iconName: ListBulletsIcon,
				description: "Unordered list of items",
				aliases: ["ul"],
				action: (editor) => {
					editor.chain().focus().toggleBulletList().run();
				},
			},
			{
				name: "numberedList",
				label: "Numbered List",
				iconName: ListNumbersIcon,
				description: "Ordered list of items",
				aliases: ["ol"],
				action: (editor) => {
					editor.chain().focus().toggleOrderedList().run();
				},
			},
			{
				name: "blockquote",
				label: "Blockquote",
				iconName: QuotesIcon,
				description: "Element for quoting",
				action: (editor) => {
					editor.chain().focus().setBlockquote().run();
				},
			},
		],
	},
];

export default GROUPS;
