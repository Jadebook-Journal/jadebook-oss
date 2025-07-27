import type { Editor } from "@tiptap/react";

/**
 * @deprecated should be removed if no custom nodes are planned to be added
 */
export const isCustomNodeSelected = (_editor: Editor, _node: HTMLElement) => {
	return false;
	// const customNodes = [];

	// return (
	//   customNodes.some((type) => editor.isActive(type)) ||
	//   isTableGripSelected(node)
	// );
};

export default isCustomNodeSelected;
