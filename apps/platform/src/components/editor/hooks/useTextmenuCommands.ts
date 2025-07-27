import type { Editor } from "@tiptap/react";
import { useCallback } from "react";

export const useTextmenuCommands = (editor: Editor) => {
	const onBold = useCallback(
		() => editor.chain().focus().toggleBold().run(),
		[editor],
	);
	const onItalic = useCallback(
		() => editor.chain().focus().toggleItalic().run(),
		[editor],
	);
	const onStrike = useCallback(
		() => editor.chain().focus().toggleStrike().run(),
		[editor],
	);
	const onUnderline = useCallback(
		() => editor.chain().focus().toggleUnderline().run(),
		[editor],
	);
	const onCode = useCallback(
		() => editor.chain().focus().toggleCode().run(),
		[editor],
	);
	const onBlockquote = useCallback(
		() => editor.chain().focus().toggleBlockquote().run(),
		[editor],
	);
	const onChangeColor = useCallback(
		(color: string) => editor.chain().setColor(color).run(),
		[editor],
	);
	const onClearColor = useCallback(
		() => editor.chain().focus().unsetColor().run(),
		[editor],
	);

	const onChangeHighlight = useCallback(
		(color: string) => editor.chain().setHighlight({ color }).run(),
		[editor],
	);
	const onClearHighlight = useCallback(
		() => editor.chain().focus().unsetHighlight().run(),
		[editor],
	);

	const onLink = useCallback(
		(url: string, inNewTab?: boolean) =>
			editor
				.chain()
				.focus()
				.setLink({ href: url, target: inNewTab ? "_blank" : "" })
				.run(),
		[editor],
	);

	return {
		onBold,
		onItalic,
		onStrike,
		onUnderline,
		onCode,
		onChangeColor,
		onClearColor,
		onChangeHighlight,
		onClearHighlight,
		onLink,
		onBlockquote,
	};
};
