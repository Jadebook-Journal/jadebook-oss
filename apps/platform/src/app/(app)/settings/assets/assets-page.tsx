"use client";

import {
	ArrowSquareOutIcon,
	DotsThreeIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Coolshape } from "coolshapes-react";
import React from "react";
import {
	type GetApiAssets200DataItem,
	getGetApiAssetsQueryOptions,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { PageContainer } from "@/components/app/page-container";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssetMutations } from "@/mutations/use-assets-mutations";
import { useAppStore } from "@/providers/app-store-provider";
import { AssetStoreProvider, useAssetStore } from "@/providers/assets-provider";
import { useRouter } from "next/navigation";

export function AssetsPage() {
	return (
		<PageContainer title="Assets">
			<AssetStoreProvider>
				<SettingsAssets />
			</AssetStoreProvider>
		</PageContainer>
	);
}

export function SettingsAssets() {
	const { session } = useAppStore((state) => ({
		session: state.session,
	}));

	const { updateAssets } = useAssetStore((state) => ({
		updateAssets: state.updateAssets,
	}));

	const systemsQuery = useQuery({
		...getGetApiAssetsQueryOptions(
			{},
			{
				fetch: {
					headers: {
						Authorization: `Bearer ${session.access_token}`,
					},
				},
			},
		),
		select: (data) => {
			// sync the agents to the store
			if (data.status === 200) {
				updateAssets(data.data.data);
			}

			return data;
		},
	});

	if (systemsQuery.isLoading) {
		return <Skeleton className="w-full h-10" />;
	}

	if (
		systemsQuery.isError ||
		!systemsQuery.data ||
		systemsQuery.data.status !== 200
	) {
		return (
			<EmptyContent
				icon={<Coolshape type="ellipse" index={4} noise={true} size={100} />}
				title="Error loading assets"
				description="Please try again later."
			/>
		);
	}

	return <AssetsList />;
}

function AssetsList() {
	const { assets } = useAssetStore((state) => ({
		assets: state.assets,
	}));

	if (assets.length === 0) {
		return (
			<EmptyContent
				icon={<Coolshape type="ellipse" index={4} noise={true} size={100} />}
				title="No assets found"
				description="Looks like you've got no assets. You can attach files to your content and they will be stored here."
			/>
		);
	}

	return (
		<SettingsPanel>
			{assets.map((asset) => {
				return (
					<SettingsPanelSection
						key={asset.id}
						title={asset.file_name}
						description={asset.mime_type}
					>
						<SettingsAssetOptionsMenu asset={asset} />
					</SettingsPanelSection>
				);
			})}
		</SettingsPanel>
	);
}

function SettingsAssetOptionsMenu({
	asset,
}: {
	asset: GetApiAssets200DataItem;
}) {
	const router = useRouter();
	const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

	const { deleteAssetMutation } = useAssetMutations({
		onSuccess: () => {
			setConfirmDialogOpen(false);
		},
	});

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<DotsThreeIcon size={12} weight="bold" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() => {
							const url = new URL(window.location.origin);

							if (asset.entity_type === "entry") {
								url.pathname = `/journal/${asset.entity_id}`;
							} else if (asset.entity_type === "goal") {
								url.pathname = `/goals/${asset.entity_id}`;
							}

							router.push(url.toString());
						}}
					>
						<ArrowSquareOutIcon size={12} />
						Open entity
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						variant="destructive"
						onClick={() => {
							setConfirmDialogOpen(true);
						}}
					>
						<TrashIcon size={12} />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ConfirmDialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				title="Delete asset"
				description="Are you sure you want to delete this asset? This action cannot be undone."
				onConfirm={() => {
					deleteAssetMutation.mutate({
						id: asset.id,
						data: { path: asset.path },
					});
				}}
			/>
		</>
	);
}
