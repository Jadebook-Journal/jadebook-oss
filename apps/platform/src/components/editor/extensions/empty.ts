import { Node } from "@tiptap/react";

/**
 * Empty extension — we have cases where extensions have been removed from previous versions of the editor.
 * This let's the content still load correctly by mimicking the extensions using the same name.
 *
 * @param name - The name of the extension
 */
export const EmptyExtension = (name: string) =>
	Node.create({
		name,

		isolating: true,

		defining: true,

		group: "block",

		draggable: true,

		selectable: true,

		inline: false,

		parseHTML() {
			return [
				{
					tag: `div[data-type="${this.name}"]`,
				},
			];
		},

		renderHTML() {
			return ["div", { "data-type": this.name }];
		},
	});

export default EmptyExtension;
