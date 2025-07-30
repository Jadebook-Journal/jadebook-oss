import {
	CodeIcon,
	HighlighterIcon,
	LinkIcon,
	PaletteIcon,
	PencilSimpleLineIcon,
	QuotesIcon,
	TextAUnderlineIcon,
	TextBIcon,
	TextItalicIcon,
	TextStrikethroughIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { type Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import React, { useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "./color-picker";
import { useTextmenuCommands } from "./hooks/useTextmenuCommands";
import { useTextmenuStates } from "./hooks/useTextmenuStates";

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoButton = React.memo(Button);
const MemoColorPicker = React.memo(ColorPicker);

export type TextMenuProps = {
	editor: Editor;
	mini?: boolean;
};

export const TextMenu = ({ editor, mini = false }: TextMenuProps) => {
	const commands = useTextmenuCommands(editor);
	const states = useTextmenuStates(editor);

	return (
		<BubbleMenu
			options={{
				placement: "top-start",
			}}
			editor={editor}
			pluginKey="textMenu"
			shouldShow={states.shouldShow}
			updateDelay={100}
		>
			<div className="border bg-background shadow-sm flex rounded-lg overflow-x-auto font-sans py-1 sm:py-0">
				<div>
					<Separator orientation="vertical" />
				</div>

				<MemoButton
					tooltip="Bold"
					tooltipShortcut={["Mod", "B"]}
					onClick={commands.onBold}
					active={states.isBold}
					variant="ghost"
					size="icon"
				>
					<TextBIcon size={16} weight="bold" />
				</MemoButton>

				<MemoButton
					tooltip="Italic"
					tooltipShortcut={["Mod", "I"]}
					onClick={commands.onItalic}
					active={states.isItalic}
					variant="ghost"
					size="icon"
				>
					<TextItalicIcon size={16} weight="bold" />
				</MemoButton>

				<MemoButton
					tooltip="Underline"
					tooltipShortcut={["Mod", "U"]}
					onClick={commands.onUnderline}
					active={states.isUnderline}
					variant="ghost"
					size="icon"
				>
					<TextAUnderlineIcon size={16} weight="bold" />
				</MemoButton>

				{!mini && (
					<>
						<MemoButton
							tooltip="Strikehrough"
							tooltipShortcut={["Mod", "Shift", "S"]}
							onClick={commands.onStrike}
							active={states.isStrike}
							variant="ghost"
							size="icon"
						>
							<TextStrikethroughIcon size={16} weight="bold" />
						</MemoButton>

						<MemoButton
							tooltip="Code"
							tooltipShortcut={["Mod", "E"]}
							onClick={commands.onCode}
							active={states.isCode}
							variant="ghost"
							size="icon"
						>
							<CodeIcon size={16} weight="bold" />
						</MemoButton>
					</>
				)}

				<MemoButton
					tooltip="Blockquote"
					onClick={commands.onBlockquote}
					active={states.isBlockquote}
					variant="ghost"
					size="icon"
				>
					<QuotesIcon size={16} weight="bold" />
				</MemoButton>

				<EditLinkPopover onSetLink={commands.onLink} />

				<Popover>
					<PopoverTrigger asChild>
						<MemoButton
							active={!!states.currentHighlight}
							tooltip="Highlight text"
							variant="ghost"
							size="icon"
						>
							<HighlighterIcon size={16} weight="bold" />
						</MemoButton>
					</PopoverTrigger>
					<PopoverContent side="top" sideOffset={8} className="w-fit p-1">
						<MemoColorPicker
							color={states.currentHighlight}
							onChange={commands.onChangeBackgroundColor}
							onClear={commands.onClearBackgroundColor}
						/>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<MemoButton
							active={!!states.currentColor}
							tooltip="Text color"
							variant="ghost"
							size="icon"
						>
							<PaletteIcon size={16} weight="bold" />
						</MemoButton>
					</PopoverTrigger>
					<PopoverContent side="top" sideOffset={8} className="w-fit p-1">
						<MemoColorPicker
							color={states.currentColor}
							onChange={commands.onChangeColor}
							onClear={commands.onClearColor}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</BubbleMenu>
	);
};

type EditLinkPopoverProps = {
	onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button tooltip="Set Link" size="icon" variant="ghost">
					<LinkIcon size={16} weight="bold" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="rounded-lg overflow-hidden border p-0">
				<LinkEditorPanel onSetLink={onSetLink} />
			</PopoverContent>
		</Popover>
	);
};

// Link menu
export const LinkMenu = ({ editor }: { editor: Editor }): React.JSX.Element => {
	const [showEdit, setShowEdit] = React.useState(false);

	const { link, target } = useEditorState({
		editor,
		selector: (ctx) => {
			const attrs = ctx.editor.getAttributes("link");
			return { link: attrs.href, target: attrs.target };
		},
	});

	const shouldShow = React.useCallback(() => {
		const isActive = editor.isActive("link");
		return isActive;
	}, [editor]);

	const handleEdit = React.useCallback(() => {
		setShowEdit(true);
	}, []);

	const onSetLink = React.useCallback(
		(url: string, openInNewTab?: boolean) => {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url, target: openInNewTab ? "_blank" : "" })
				.run();
			setShowEdit(false);
		},
		[editor],
	);

	const onUnsetLink = React.useCallback(() => {
		editor.chain().focus().extendMarkRange("link").unsetLink().run();
		setShowEdit(false);
		return null;
	}, [editor]);

	return (
		<BubbleMenu
			editor={editor}
			pluginKey="textMenu"
			shouldShow={shouldShow}
			updateDelay={0}
			options={{
				onHide: () => {
					setShowEdit(false);
				},
			}}
		>
			{showEdit ? (
				<div className="bg-background border shadow-sm rounded-lg">
					<LinkEditorPanel
						initialUrl={link}
						initialOpenInNewTab={target === "_blank"}
						onSetLink={onSetLink}
					/>
				</div>
			) : (
				<LinkPreviewPanel
					url={link}
					onClear={onUnsetLink}
					onEdit={handleEdit}
				/>
			)}
		</BubbleMenu>
	);
};

type LinkEditorPanelProps = {
	initialUrl?: string;
	initialOpenInNewTab?: boolean;
	onSetLink: (url: string, openInNewTab?: boolean) => void;
};

const useLinkEditorState = ({
	initialUrl,
	initialOpenInNewTab,
	onSetLink,
}: LinkEditorPanelProps) => {
	const [url, setUrl] = React.useState(initialUrl || "");
	const [openInNewTab, setOpenInNewTab] = React.useState(
		initialOpenInNewTab || false,
	);

	const onChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setUrl(event.target.value);
		},
		[],
	);

	const isValidUrl = React.useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

	const handleSubmit = React.useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (isValidUrl) {
				onSetLink(url, openInNewTab);
			}
		},
		[url, isValidUrl, openInNewTab, onSetLink],
	);

	return {
		url,
		setUrl,
		openInNewTab,
		setOpenInNewTab,
		onChange,
		handleSubmit,
		isValidUrl,
	};
};

export const LinkEditorPanel = ({
	onSetLink,
	initialOpenInNewTab,
	initialUrl,
}: LinkEditorPanelProps) => {
	const state = useLinkEditorState({
		onSetLink,
		initialOpenInNewTab,
		initialUrl,
	});

	const id = useId();

	return (
		<div className="p-1">
			<form onSubmit={state.handleSubmit}>
				<label
					htmlFor={id}
					className="flex items-center gap-2 p-0 rounded-lg cursor-text w-full"
				>
					<Input
						id={id}
						type="url"
						className="flex-1 h-9 w-full bg-transparent outline-hidden min-w-[16rem] text-sm"
						placeholder="Enter URL"
						value={state.url}
						onChange={state.onChange}
					/>
				</label>
			</form>
		</div>
	);
};

type LinkPreviewPanelProps = {
	url: string;
	onEdit: () => void;
	onClear: () => void;
};

const LinkPreviewPanel = ({ onClear, onEdit, url }: LinkPreviewPanelProps) => {
	const sanitizedLink = url?.startsWith("javascript:") ? "" : url;
	return (
		<div className="flex items-center bg-background border shadow-sm rounded-lg">
			<a
				href={sanitizedLink}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm underline break-all px-3 overflow-x-auto whitespace-nowrap"
			>
				{url}
			</a>
			<div>
				<Separator orientation="vertical" />
			</div>
			<Button variant="ghost" size="icon" onClick={onEdit}>
				<PencilSimpleLineIcon size={16} weight="bold" />
			</Button>
			<Button variant="ghostDestructive" size="icon" onClick={onClear}>
				<TrashIcon size={16} weight="bold" />
			</Button>
		</div>
	);
};
