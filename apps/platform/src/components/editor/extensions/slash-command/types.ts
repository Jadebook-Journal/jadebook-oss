import type { Icon } from "@phosphor-icons/react";
import type { Editor } from "@tiptap/react";

export interface Group {
	name: string;
	title: string;
	commands: Command[];
}

export interface Command {
	name: string;
	label: string;
	description: string;
	aliases?: string[];
	iconName: Icon;
	action: (editor: Editor) => void;
	shouldBeHidden?: (editor: Editor) => boolean;
}

export interface MenuListProps {
	editor: Editor;
	items: Group[];
	command: (command: Command) => void;
}
