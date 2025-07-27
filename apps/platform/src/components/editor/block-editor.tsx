"use client";

import { type Editor, EditorContent } from "@tiptap/react";
import React from "react";
import { LinkMenu, TextMenu } from "./editor-bubble-menu";
import { ContentItemMenu } from "./editor-drag-handle";

export function BlockEditor({
	editor,
	contentMenu = true,
	mini = false,
}: {
	editor: Editor;
	contentMenu?: boolean;
	floatingMenu?: boolean;
	mini?: boolean;
	contentSize?: "default" | "large" | "wide";
}) {
	const menuContainerRef = React.useRef<HTMLDivElement>(null);

	return (
		<div ref={menuContainerRef} className="w-full">
			<EditorContent
				editor={editor}
				className="cursor-auto max-w-3xl w-full mx-auto"
			/>

			{contentMenu && <ContentItemMenu editor={editor} />}
			<LinkMenu editor={editor} appendTo={menuContainerRef} />
			<TextMenu editor={editor} mini={mini} />
		</div>
	);
}

export function MiniBlockEditor({
	editor,
	placeholder,
}: {
	editor: Editor;
	placeholder?: string;
}) {
	const menuContainerRef = React.useRef<HTMLDivElement>(null);

	return (
		<div ref={menuContainerRef} className="w-full">
			<EditorContent
				editor={editor}
				className="cursor-auto w-full"
				placeholder={placeholder}
			/>

			<TextMenu editor={editor} mini />
			<LinkMenu editor={editor} appendTo={menuContainerRef} />
		</div>
	);
}
