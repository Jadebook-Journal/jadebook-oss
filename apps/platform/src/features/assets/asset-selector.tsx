import {
	ArrowSquareOutIcon,
	FileIcon,
	UploadSimpleIcon,
	XIcon,
} from "@phosphor-icons/react";
import React from "react";
import { toast } from "sonner";
import type {
	GetApiAssets200DataItem,
	PostApiAssetsBodyEntityType,
} from "@/api-client";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAssetMutations } from "@/mutations/use-assets-mutations";
import { useAssetStore } from "@/providers/assets-provider";
import { UploadAssetDialog } from "./upload-asset-dialog";

/**
 * Will interact with the asset store and show them. plus have a "add asset" button.
 */
export function AssetSelector({
	entityType,
	entityId,
	disabled,
}: {
	entityType: PostApiAssetsBodyEntityType;
	entityId: string;
	disabled?: boolean;
}) {
	const { assets } = useAssetStore((store) => ({
		assets: store.assets,
	}));

	const [open, setOpen] = React.useState(false);

	return (
		<div className="flex flex-wrap gap-1.5 group">
			{assets.map((asset) => (
				<AssetItem key={asset.id} asset={asset} />
			))}

			{!disabled && (
				<Tooltip>
					<div className="relative size-16 isolate group/asset">
						<TooltipTrigger asChild>
							<button
								type="button"
								className="flex items-center justify-center size-full border hover:border-primary transition-all ease-in-out rounded-md overflow-hidden"
								onClick={() => {
									setOpen(true);
								}}
							>
								<UploadSimpleIcon size={16} weight="bold" />
							</button>
						</TooltipTrigger>
					</div>

					<TooltipContent>Upload Asset</TooltipContent>
				</Tooltip>
			)}

			<UploadAssetDialog
				open={open}
				setOpen={setOpen}
				onSuccess={() => {
					toast.success("Asset uploaded");

					setOpen(false);
				}}
				entityType={entityType}
				entityId={entityId}
			/>
		</div>
	);
}

function AssetItem({
	asset,
	disableDelete,
}: {
	asset: GetApiAssets200DataItem;
	disableDelete?: boolean;
}) {
	const [open, setOpen] = React.useState(false);

	const { deleteAssetMutation } = useAssetMutations();

	return (
		<>
			<Tooltip>
				<div className="relative size-16 isolate group/asset">
					<TooltipTrigger asChild>
						<button
							type="button"
							className="absolute inset-0 border border-transparent hover:border-primary transition-all ease-in-out rounded-md overflow-hidden"
							onClick={() => {
								window.open(asset.signed_url, "_blank");
							}}
						>
							{asset.mime_type.startsWith("image") ? (
								// biome-ignore lint/performance/noImgElement: These are dynamic and shouldn't be cached
								<img
									src={asset.signed_url}
									alt={asset.file_name}
									className="size-full object-cover"
								/>
							) : (
								<div className="flex items-center justify-center size-full bg-card">
									<FileIcon size={16} weight="bold" />
								</div>
							)}
						</button>
					</TooltipTrigger>

					{!disableDelete && (
						<button
							type="button"
							className="absolute z-10 top-1 right-1 bg-accent rounded-full hover:bg-destructive hover:text-white aspect-square w-4 flex items-center justify-center border sm:opacity-0 group-hover/asset:opacity-100 transition-all ease-in-out"
							onClick={() => {
								setOpen(true);
							}}
						>
							<XIcon size={10} weight="bold" />
						</button>
					)}
				</div>

				<TooltipContent>
					<ArrowSquareOutIcon />
					<p className="truncate max-w-xs">{asset.file_name}</p>
				</TooltipContent>
			</Tooltip>

			<ConfirmDialog
				open={open}
				onOpenChange={setOpen}
				title="Delete asset"
				description="Are you sure you want to delete this asset? This action cannot be undone."
				onConfirm={(): void => {
					deleteAssetMutation.mutate({
						id: asset.id,
						data: {
							path: asset.path,
						},
					});
				}}
			/>
		</>
	);
}
