"use client";

import {
	ImageIcon,
	PlusIcon,
	TagIcon,
	UploadSimpleIcon,
} from "@phosphor-icons/react";
import { ICON_TEXT_COLOR_CLASSNAMES } from "jadebook/react";
import React from "react";
import { toast } from "sonner";
import {
	getGetApiEntriesIdQueryOptions,
	useGetApiEntriesId,
	type GetApiEntriesId200,
} from "@/api-client";
import { PageContainer } from "@/components/app/page-container";
import { BlockEditor } from "@/components/editor/block-editor";
import { OptionsMenu } from "@/components/journal/options-menu";
import { Button } from "@/components/ui/button";
import { actionDatePickerStyle, DatePicker } from "@/components/ui/date-picker";
import { IconSelector } from "@/features/icon/icon-selector";
import { AssetsList } from "@/features/assets/assets-list";
import { UploadAssetDialog } from "@/features/assets/upload-asset-dialog";
import { CoverDisplay } from "@/features/cover/cover-display";
import { CoverPicker } from "@/features/cover/cover-picker";
import {
	TagSelector,
	TagSelectorCommandMenu,
} from "@/features/tag/tag-selector";
import { cn } from "@/lib/utils";
import { AssetStoreProvider, useAssetStore } from "@/providers/assets-provider";
import { EntryEditorProvider, useEditor } from "@/providers/editor-provider";
import { useGlobalEntryStore } from "@/stores/global-entry-store";
import { transparentInputStyle } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/providers/app-store-provider";
import { FullPageLoading } from "@/components/routes/loading";
import { ErrorRoute } from "@/components/routes/error";

export function EntryPage({ entryId }: { entryId: string }) {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const cover = useGlobalEntryStore((store) => store.cover);
	const title = useGlobalEntryStore((store) => store.title);

	const updateEntry = useGlobalEntryStore((store) => store.updateEntry);

	const entryQuery = useQuery({
		...getGetApiEntriesIdQueryOptions(entryId, {
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
	});

	// Sync local and server state
	React.useEffect(() => {
		if (entryQuery.data && entryQuery.data.status === 200) {
			updateEntry(entryQuery.data.data);
		}
	}, [entryQuery.data, updateEntry]);

	if (entryQuery.isLoading) {
		return <FullPageLoading />;
	}

	if (
		entryQuery.isError ||
		!entryQuery.data ||
		entryQuery.data.status !== 200
	) {
		return <ErrorRoute />;
	}

	return (
		<EntryEditorProvider initialContent={entryQuery.data.data.content || ""}>
			<AssetStoreProvider>
				<PageContainer
					title={title}
					externalContent={
						<CoverDisplay cover={cover} actions={<CoverPickerButton />} />
					}
					actions={
						<div className="flex gap-3 items-center">
							<EntryDatePicker />

							<OptionsMenu />
						</div>
					}
				>
					<InternalPage />
				</PageContainer>
			</AssetStoreProvider>
		</EntryEditorProvider>
	);
}

function InternalPage() {
	const { editor } = useEditor();

	const entryId = useGlobalEntryStore((store) => store.id);
	const type = useGlobalEntryStore((store) => store.type);

	return (
		<>
			<div className="space-y-4 group">
				<DocumentHeader />

				<TitleInput />

				<TagsList />

				<AssetsList entityType="entry" entityId={entryId} />
			</div>

			<BlockEditor editor={editor} />
		</>
	);
}

function CoverPickerButton({ children }: { children?: React.ReactNode }) {
	const cover = useGlobalEntryStore((store) => store.cover);
	const updateCover = useGlobalEntryStore((store) => store.updateCover);

	return (
		<CoverPicker
			cover={cover}
			onValueChange={(value) => {
				updateCover(value);
			}}
		>
			{children}
		</CoverPicker>
	);
}

function DocumentHeader() {
	const icon = useGlobalEntryStore((store) => store.icon);
	const cover = useGlobalEntryStore((store) => store.cover);

	return (
		<div
			className={cn(
				"flex gap-2 items-center justify-start",
				icon && "flex-col items-start",
			)}
		>
			<IconSelectorButton />

			<div className="flex gap-2 items-center justify-start">
				{!cover && (
					<CoverPickerButton>
						<Button
							variant="outline"
							size="sm"
							className="w-fit sm:opacity-20 group-hover:opacity-100 transition-all ease-in-out text-xs [&_svg]:size-3 [&_svg:not([class*='size-'])]:size-3 h-7"
						>
							<ImageIcon /> Cover
						</Button>
					</CoverPickerButton>
				)}

				<AddTagButton />

				<AddAssetButton />
			</div>
		</div>
	);
}

function IconSelectorButton() {
	const icon = useGlobalEntryStore((store) => store.icon);
	const updateIcon = useGlobalEntryStore((store) => store.updateIcon);

	return (
		<IconSelector
			includeColor
			value={icon}
			onChange={updateIcon}
			emptyState={
				<Button
					variant="outline"
					size="sm"
					className="w-fit sm:opacity-20 group-hover:opacity-100 transition-all ease-in-out text-xs [&_svg]:size-3 [&_svg:not([class*='size-'])]:size-3 h-7"
				>
					<PlusIcon /> Icon
				</Button>
			}
			valueState={({ Icon, color, weight }) => (
				<Button variant="logo" size="logo">
					<Icon
						size={24}
						weight={weight}
						className={ICON_TEXT_COLOR_CLASSNAMES[color]}
					/>
				</Button>
			)}
		/>
	);
}

function AddTagButton() {
	const tags = useGlobalEntryStore((store) => store.tags);
	const updateTags = useGlobalEntryStore((store) => store.updateTags);

	const [open, setOpen] = React.useState(false);

	if (tags && tags.length > 0) {
		return null;
	}

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				className="w-fit sm:opacity-20 group-hover:opacity-100 transition-all ease-in-out text-xs [&_svg]:size-3 [&_svg:not([class*='size-'])]:size-3 h-7"
				onClick={() => {
					setOpen(true);
				}}
			>
				<TagIcon /> Add Tag
			</Button>

			<TagSelectorCommandMenu
				open={open}
				setOpen={setOpen}
				value={[]}
				onValueChange={(tag) => {
					updateTags([tag]);
				}}
			/>
		</>
	);
}

function TitleInput() {
	const title = useGlobalEntryStore((store) => store.title);
	const updateTitle = useGlobalEntryStore((store) => store.updateTitle);

	const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

	const resizeTextarea = () => {
		if (textareaRef.current) {
			const textarea = textareaRef.current;
			textarea.style.height = "auto"; // Reset height to ensure accurate measurement
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignored using `--suppress`
	React.useEffect(() => {
		resizeTextarea();
	}, [title]);

	return (
		<textarea
			rows={1}
			ref={textareaRef}
			placeholder="Untitled document"
			className={cn(transparentInputStyle, "text-4xl font-semibold")}
			value={title || ""}
			onChange={(e) => {
				if (e.target.value !== title) {
					updateTitle(e.target.value);
				}
			}}
		/>
	);
}

function TagsList() {
	const tags = useGlobalEntryStore((store) => store.tags);
	const updateTags = useGlobalEntryStore((store) => store.updateTags);

	if (!tags || tags.length === 0) {
		return null;
	}

	return <TagSelector value={tags} onValueChange={updateTags} />;
}

function EntryDatePicker() {
	const entryDate = useGlobalEntryStore((store) => store.entry_date);
	const updateEntryDate = useGlobalEntryStore((store) => store.updateEntryDate);

	return (
		<DatePicker
			label="Entry Date"
			date={new Date(entryDate)}
			setDate={(date) => {
				updateEntryDate(date.toISOString());
			}}
			className={cn(actionDatePickerStyle)}
		/>
	);
}

function AddAssetButton() {
	const entryId = useGlobalEntryStore((store) => store.id);

	const [open, setOpen] = React.useState(false);

	const { assets } = useAssetStore((store) => ({
		assets: store.assets,
	}));

	if (assets && assets.length > 0) {
		return null;
	}

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				className="w-fit sm:opacity-20 group-hover:opacity-100 transition-all ease-in-out text-xs [&_svg]:size-3 [&_svg:not([class*='size-'])]:size-3 h-7"
				onClick={() => {
					setOpen(true);
				}}
			>
				<UploadSimpleIcon /> Add Asset
			</Button>

			<UploadAssetDialog
				open={open}
				setOpen={setOpen}
				onSuccess={() => {
					toast.success("Asset uploaded");

					setOpen(false);
				}}
				entityType="entry"
				entityId={entryId}
			/>
		</>
	);
}
