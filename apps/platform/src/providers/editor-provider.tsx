"use client";

import { type Editor, useEditor as useTipTap } from "@tiptap/react";
import { handleEditorContent } from "jadebook";
import React from "react";
import { editor_extensions } from "@/components/editor/extensions";
import { cn } from "@/lib/utils";
import { useGlobalEntryStore } from "@/stores/global-entry-store";
import { PageLoading } from "@/components/routes/loading";

export const EntryEditorContext = React.createContext<
	| {
			editor: Editor;
			disabled: boolean;
	  }
	| undefined
>(undefined);

export interface EntryEditorProviderProps {
	children: React.ReactNode;
	initialContent: string;
}

/**
 * This provider is used to provide the editor to the entry page
 */
export const EntryEditorProvider = ({
	children,
	initialContent,
}: EntryEditorProviderProps) => {
	const updateContent = useGlobalEntryStore((state) => state.updateContent);
	const updateCharacterCount = useGlobalEntryStore(
		(state) => state.updateCharacterCount,
	);
	const updateExcerpt = useGlobalEntryStore((state) => state.updateExcerpt);

	const editor = useTipTap({
		editorProps: {
			attributes: {
				class: cn(
					"prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-hidden pb-20 lg:pb-32 leading-loose text-foreground/90 transition-all ease-in-out print:zen-mode",
				),
			},
		},
		extensions: editor_extensions,
		autofocus: true,
		immediatelyRender: false,
		shouldRerenderOnTransaction: true,
		content: handleEditorContent(initialContent),
		onCreate: ({ editor }) => {
			const text = editor.getText().replaceAll(/\n/g, " ");

			updateCharacterCount(text.length);
		},
		onUpdate: ({ editor }) => {
			const text = editor.getText();

			updateCharacterCount(text.replaceAll(/\n/g, " ").length);
			updateContent(JSON.stringify(editor.getJSON()));
			updateExcerpt(text.slice(0, 150));
		},
	});

	React.useEffect(() => {
		if (!editor) {
			return;
		}

		// Attempt to locate the scrollable container via its unique id
		const scrollContainer = document.getElementById("scrollable-body");
		if (!scrollContainer) {
			return;
		}

		const handleUpdate = () => {
			const { state } = editor;
			const { selection } = state;
			// Only act on cursor position, not selections
			if (!selection.empty) {
				return;
			}

			try {
				// Get coordinates relative to the viewport
				const caretPos = editor.view.coordsAtPos(selection.head);
				const containerRect = scrollContainer.getBoundingClientRect();

				const caretBottom = caretPos.bottom;
				const containerBottom = containerRect.bottom;
				const desiredBottomPadding = 150; // Keep 150px space below caret

				// Check if the caret is close to the bottom edge of the container
				if (containerBottom - caretBottom < desiredBottomPadding) {
					const scrollAmount =
						desiredBottomPadding - (containerBottom - caretBottom);
					// Scroll down smoothly
					scrollContainer.scrollBy({
						top: scrollAmount,
						behavior: "smooth",
					});
				}
			} catch (error) {
				// coordsAtPos can sometimes throw errors if the editor state is weird
				console.error("Error calculating caret position:", error);
			}
		};

		// Listen for selection changes (includes cursor movement)
		editor.on("selectionUpdate", handleUpdate);

		// Cleanup listener on component unmount or editor change
		return () => {
			editor.off("selectionUpdate", handleUpdate);
		};
	}, [editor]);

	if (!editor) {
		return <PageLoading />;
	}

	return (
		<EntryEditorContext.Provider
			value={{ editor, disabled: !editor || !editor.isFocused }}
		>
			{children}
		</EntryEditorContext.Provider>
	);
};

export const useEditor = () => {
	const editorContext = React.useContext(EntryEditorContext);

	if (!editorContext) {
		throw new Error(`useEditor`);
	}

	return editorContext;
};
