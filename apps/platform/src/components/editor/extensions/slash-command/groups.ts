import {
	CodeIcon,
	ListBulletsIcon,
	ListNumbersIcon,
	QuotesIcon,
	TextHFiveIcon,
	TextHFourIcon,
	TextHOneIcon,
	TextHSixIcon,
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
				name: "heading4",
				label: "Heading 4",
				iconName: TextHFourIcon,
				description: "Low priority section title",
				aliases: ["h4"],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 4 }).run();
				},
			},
			{
				name: "heading5",
				label: "Heading 5",
				iconName: TextHFiveIcon,
				description: "Low priority section title",
				aliases: ["h5"],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 5 }).run();
				},
			},
			{
				name: "heading6",
				label: "Heading 6",
				iconName: TextHSixIcon,
				description: "Low priority section title",
				aliases: ["h6"],
				action: (editor) => {
					editor.chain().focus().setHeading({ level: 6 }).run();
				},
			},
		],
	},
	{
		name: "lists",
		title: "Lists",
		commands: [
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
		],
	},
	{
		name: "blocks",
		title: "Blocks",
		commands: [
			{
				name: "blockquote",
				label: "Blockquote",
				iconName: QuotesIcon,
				description: "Element for quoting",
				action: (editor) => {
					editor.chain().focus().setBlockquote().run();
				},
			},
			{
				name: "codeBlock",
				label: "Code Block",
				iconName: CodeIcon,
				description: "Element for code",
				action: (editor) => {
					editor.chain().focus().setCodeBlock().run();
				},
			},
		],
	},
];

export default GROUPS;
