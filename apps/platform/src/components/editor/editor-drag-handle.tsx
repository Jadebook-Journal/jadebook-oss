import {
	ClipboardIcon,
	CopySimpleIcon,
	DotsSixVerticalIcon,
	PlusIcon,
	TextTSlashIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import DragHandle from "@tiptap/extension-drag-handle-react";
import type { Node } from "@tiptap/pm/model";
import type { NodeSelection } from "@tiptap/pm/state";
import type { Editor } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type ContentItemMenuProps = {
	editor: Editor;
};

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const data = useData();

	const actions = useContentItemActions(
		editor,
		data.currentNode,
		data.currentNodePos,
	);

	useEffect(() => {
		if (menuOpen) {
			editor.commands.setMeta("lockDragHandle", true);
		} else {
			editor.commands.setMeta("lockDragHandle", false);
		}
	}, [editor, menuOpen]);

	return (
		<DragHandle
			pluginKey="ContentItemMenu"
			editor={editor}
			onNodeChange={data.handleNodeChange}
		>
			<div className="items-center gap-0.5 pr-2 hidden md:flex opacity-40 hover:opacity-100 transition-all ease-in-out">
				<Button variant="ghost" size="icon" onClick={actions.handleAdd}>
					<PlusIcon size={16} weight="bold" />
				</Button>

				<Popover open={menuOpen} onOpenChange={setMenuOpen}>
					<PopoverTrigger>
						<div
							className={cn(
								buttonVariants({ size: "icon", variant: "ghost" }),
								"cursor-grab",
							)}
						>
							<DotsSixVerticalIcon size={16} weight="bold" />
						</div>
					</PopoverTrigger>
					<PopoverContent className="p-1 flex flex-col w-fit">
						<Button
							variant="ghost"
							className="justify-start px-3"
							onClick={() => actions.resetTextFormatting()}
						>
							<TextTSlashIcon size={16} weight="bold" />
							Clear formatting
						</Button>
						<Button
							variant="ghost"
							className="justify-start px-3"
							onClick={() => {
								actions.copyNodeToClipboard();
								setMenuOpen(false);
							}}
						>
							<ClipboardIcon size={16} weight="bold" />
							Copy to clipboard
						</Button>
						<Button
							variant="ghost"
							className="justify-start px-3"
							onClick={() => {
								actions.duplicateNode();
								setMenuOpen(false);
							}}
						>
							<CopySimpleIcon size={16} weight="bold" />
							Duplicate
						</Button>
						<Separator className="my-1" />
						<Button
							variant="destructive"
							className="justify-start bg-transparent text-foreground px-3"
							onClick={() => {
								actions.deleteNode();
								setMenuOpen(false);
							}}
						>
							<TrashIcon size={16} weight="bold" />
							Delete
						</Button>
					</PopoverContent>
				</Popover>
			</div>
		</DragHandle>
	);
};

const useData = () => {
	const [currentNode, setCurrentNode] = useState<Node | null>(null);
	const [currentNodePos, setCurrentNodePos] = useState<number>(-1);

	const handleNodeChange = React.useCallback(
		(data: { node: Node | null; editor: Editor; pos: number }) => {
			if (data.node) {
				setCurrentNode(data.node);
			}

			setCurrentNodePos(data.pos);
		},
		[],
	);

	return {
		currentNode,
		currentNodePos,
		setCurrentNode,
		setCurrentNodePos,
		handleNodeChange,
	};
};

const useContentItemActions = (
	editor: Editor,
	currentNode: Node | null,
	currentNodePos: number,
) => {
	const [, copyToClipboard] = useCopyToClipboard();
	const resetTextFormatting = React.useCallback(() => {
		const chain = editor.chain();

		chain.setNodeSelection(currentNodePos).unsetAllMarks();

		if (currentNode?.type.name !== "paragraph") {
			chain.setParagraph();
		}

		chain.run();
	}, [editor, currentNodePos, currentNode?.type.name]);

	const duplicateNode = React.useCallback(() => {
		editor.commands.setNodeSelection(currentNodePos);

		const { $anchor } = editor.state.selection;
		const selectedNode =
			$anchor.node(1) || (editor.state.selection as NodeSelection).node;

		editor
			.chain()
			.setMeta("hideDragHandle", true)
			.insertContentAt(
				currentNodePos + (currentNode?.nodeSize || 0),
				selectedNode.toJSON(),
			)
			.run();
	}, [editor, currentNodePos, currentNode?.nodeSize]);

	const copyNodeToClipboard = React.useCallback(() => {
		editor
			.chain()
			.setMeta("hideDragHandle", true)
			.setNodeSelection(currentNodePos)
			.run();

		const { $anchor } = editor.state.selection;
		const selectedNode =
			$anchor.node(1) || (editor.state.selection as NodeSelection).node;

		if (selectedNode.type.name === "imageBlock") {
			copyToClipboard(selectedNode.attrs.src).then(() => {
				toast("Copied to clipboard");
			});
		} else if (selectedNode.textContent) {
			copyToClipboard(selectedNode.textContent).then(() => {
				toast("Copied to clipboard");
			});
		}
	}, [editor, currentNodePos, copyToClipboard]);

	const deleteNode = React.useCallback(() => {
		editor
			.chain()
			.setMeta("hideDragHandle", true)
			.setNodeSelection(currentNodePos)
			.deleteSelection()
			.run();
	}, [editor, currentNodePos]);

	const handleAdd = React.useCallback(() => {
		if (currentNodePos !== -1) {
			const currentNodeSize = currentNode?.nodeSize || 0;
			const insertPos = currentNodePos + currentNodeSize;
			const currentNodeIsEmptyParagraph =
				currentNode?.type.name === "paragraph" &&
				currentNode?.content?.size === 0;
			const focusPos = currentNodeIsEmptyParagraph
				? currentNodePos + 2
				: insertPos + 2;

			editor
				.chain()
				.command(({ dispatch, tr, state }) => {
					if (dispatch) {
						if (currentNodeIsEmptyParagraph) {
							tr.insertText("/", currentNodePos, currentNodePos + 1);
						} else {
							tr.insert(
								insertPos,
								state.schema.nodes.paragraph.create(null, [
									state.schema.text("/"),
								]),
							);
						}

						return dispatch(tr);
					}

					return true;
				})
				.focus(focusPos)
				.run();
		}
	}, [currentNode, currentNodePos, editor]);

	return {
		resetTextFormatting,
		duplicateNode,
		copyNodeToClipboard,
		deleteNode,
		handleAdd,
	};
};
