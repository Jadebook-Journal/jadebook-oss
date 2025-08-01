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

	const onChangeBackgroundColor = useCallback(
		(color: string) => editor.chain().setBackgroundColor(color).run(),
		[editor],
	);
	const onClearBackgroundColor = useCallback(
		() => editor.chain().focus().unsetBackgroundColor().run(),
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
		onChangeBackgroundColor,
		onClearBackgroundColor,
		onLink,
		onBlockquote,
	};
};
