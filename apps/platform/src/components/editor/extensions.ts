import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Placeholder, CharacterCount } from "@tiptap/extensions";
import type { AnyExtension } from "@tiptap/react";

// Custom extension for web platform
import { SlashCommand } from "./extensions/slash-command";

export const editor_extensions: AnyExtension[] = [
	StarterKit.configure({
		link: {
			openOnClick: false,
			autolink: true,
			defaultProtocol: "https",
		},
	}),
	TextStyleKit,
	Placeholder.configure({
		placeholder: "Start typing...",
	}),
	CharacterCount,
	SlashCommand,
];
