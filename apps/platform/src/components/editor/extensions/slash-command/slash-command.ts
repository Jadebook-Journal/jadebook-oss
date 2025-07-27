/* eslint-disable @typescript-eslint/no-explicit-any */

import { computePosition } from "@floating-ui/dom";
import { PluginKey } from "@tiptap/pm/state";
import { type Editor, Extension, ReactRenderer } from "@tiptap/react";
import Suggestion, {
	type SuggestionKeyDownProps,
	type SuggestionProps,
} from "@tiptap/suggestion";

import { GROUPS } from "./groups";
import MenuList from "./menu-list";

const extensionName = "slashCommand";

// Define storage interface for TypeScript
declare module "@tiptap/react" {
	interface Storage {
		slashCommand: {
			rect: DOMRect | null;
		};
	}
}

export const SlashCommand = Extension.create({
	name: extensionName,

	priority: 200,

	addStorage() {
		return {
			rect: null,
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				char: "/",
				allowSpaces: true,
				startOfLine: true,
				pluginKey: new PluginKey(extensionName),
				allow: ({ state, range }) => {
					const $from = state.doc.resolve(range.from);
					const isRootDepth = $from.depth === 1;
					const isParagraph = $from.parent.type.name === "paragraph";
					const isStartOfNode = $from.parent.textContent?.charAt(0) === "/";

					const afterContent = $from.parent.textContent?.substring(
						$from.parent.textContent?.indexOf("/"),
					);
					const isValidAfterContent = !afterContent?.endsWith("  ");

					return (
						isRootDepth && isParagraph && isStartOfNode && isValidAfterContent
					);
				},
				command: ({ editor, props }: { editor: Editor; props: any }) => {
					const { view, state } = editor;
					const { $head, $from } = view.state.selection;

					const end = $from.pos;
					const from = $head?.nodeBefore
						? end -
							($head.nodeBefore.text?.substring(
								$head.nodeBefore.text?.indexOf("/"),
							).length ?? 0)
						: $from.start();

					const tr = state.tr.deleteRange(from, end);
					view.dispatch(tr);

					props.action(editor);
					view.focus();
				},
				items: ({ query }: { query: string }) => {
					const withFilteredCommands = GROUPS.map((group) => ({
						...group,
						commands: group.commands
							.filter((item) => {
								const labelNormalized = item.label.toLowerCase().trim();
								const queryNormalized = query.toLowerCase().trim();

								if (item.aliases) {
									const aliases = item.aliases.map((alias) =>
										alias.toLowerCase().trim(),
									);

									return (
										labelNormalized.includes(queryNormalized) ||
										aliases.includes(queryNormalized)
									);
								}

								return labelNormalized.includes(queryNormalized);
							})
							.filter((command) =>
								command.shouldBeHidden
									? !command.shouldBeHidden(this.editor)
									: true,
							),
					}));

					const withoutEmptyGroups = withFilteredCommands.filter((group) => {
						if (group.commands.length > 0) {
							return true;
						}

						return false;
					});

					const withEnabledSettings = withoutEmptyGroups.map((group) => ({
						...group,
						commands: group.commands.map((command) => ({
							...command,
							isEnabled: true,
						})),
					}));

					return withEnabledSettings;
				},
				render: () => {
					let component: any;
					let scrollHandler: (() => void) | null = null;
					const editor = this.editor; // Capture editor reference

					function repositionComponent(clientRect: DOMRect | null) {
						if (!component || !component.element || !clientRect) {
							return;
						}

						const virtualElement = {
							getBoundingClientRect() {
								return clientRect;
							},
						};

						computePosition(virtualElement, component.element, {
							placement: "bottom-start",
						}).then((pos) => {
							Object.assign(component.element.style, {
								left: `${pos.x}px`,
								top: `${pos.y}px`,
								position: pos.strategy === "fixed" ? "fixed" : "absolute",
								zIndex: "1000",
							});
						});
					}

					return {
						onStart: (props: SuggestionProps) => {
							component = new ReactRenderer(MenuList, {
								props: {
									...props,
								},
								editor: props.editor,
							});

							document.body.appendChild(component.element);

							const clientRect = props.clientRect?.();

							if (clientRect === undefined) {
								return;
							}

							editor.storage[extensionName].rect = clientRect;
							repositionComponent(clientRect);

							const { view } = props.editor;

							scrollHandler = () => {
								const rect = props.clientRect?.();
								if (rect) {
									editor.storage[extensionName].rect = rect;
									repositionComponent(rect);
								}
							};

							view.dom.parentElement?.addEventListener("scroll", scrollHandler);
						},

						onUpdate(props: SuggestionProps) {
							component.updateProps(props);

							const clientRect = props.clientRect?.();

							if (clientRect === undefined) {
								return;
							}

							editor.storage[extensionName].rect = clientRect;
							repositionComponent(clientRect);
						},

						onKeyDown(props: SuggestionKeyDownProps) {
							if (props.event.key === "Escape") {
								if (document.body.contains(component.element)) {
									document.body.removeChild(component.element);
								}
								component.destroy();
								return true;
							}

							return component.ref?.onKeyDown(props);
						},

						onExit(props) {
							if (document.body.contains(component.element)) {
								document.body.removeChild(component.element);
							}

							if (scrollHandler) {
								const { view } = props.editor;
								view.dom.parentElement?.removeEventListener(
									"scroll",
									scrollHandler,
								);
							}

							component.destroy();
						},
					};
				},
			}),
		];
	},
});

export default SlashCommand;
