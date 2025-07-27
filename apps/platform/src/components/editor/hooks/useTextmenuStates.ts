import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { type Editor, useEditorState } from "@tiptap/react";
import React from "react";
import isTextSelected from "../utils/isTextSelected";

export type ShouldShowProps = {
	editor?: Editor;
	view: EditorView;
	state?: EditorState;
	oldState?: EditorState;
	from?: number;
	to?: number;
};

export const useTextmenuStates = (editor: Editor) => {
	const states = useEditorState({
		editor,
		selector: (ctx) => {
			return {
				isBold: ctx.editor.isActive("bold"),
				isItalic: ctx.editor.isActive("italic"),
				isStrike: ctx.editor.isActive("strike"),
				isUnderline: ctx.editor.isActive("underline"),
				isCode: ctx.editor.isActive("code"),
				isBlockquote: ctx.editor.isActive("blockquote"),
				isSubscript: ctx.editor.isActive("subscript"),
				isSuperscript: ctx.editor.isActive("superscript"),
				isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
				isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
				isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
				isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),
				currentColor: ctx.editor.getAttributes("textStyle")?.color || undefined,
				currentHighlight:
					ctx.editor.getAttributes("highlight")?.color || undefined,
				currentFont:
					ctx.editor.getAttributes("textStyle")?.fontFamily || undefined,
				currentSize:
					ctx.editor.getAttributes("textStyle")?.fontSize || undefined,
			};
		},
	});

	const shouldShow = React.useCallback(
		({ view }: ShouldShowProps) => {
			if (!view || editor.view.dragging) {
				return false;
			}

			return isTextSelected({ editor });
		},
		[editor],
	);

	return {
		shouldShow,
		...states,
	};
};
