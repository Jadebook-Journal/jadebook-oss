"use client";

import { useQuery } from "@tanstack/react-query";
import {
	type GetApiAssetsEntityType,
	getGetApiAssetsQueryOptions,
} from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";
import { useAssetStore } from "@/providers/assets-provider";
import { AssetSelector } from "./asset-selector";

export function AssetsList({
	entityType,
	entityId,
}: {
	entityType: GetApiAssetsEntityType;
	entityId: string;
}) {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const { assets, updateAssets } = useAssetStore((store) => ({
		assets: store.assets,
		updateAssets: store.updateAssets,
	}));

	const _assetsQuery = useQuery({
		...getGetApiAssetsQueryOptions(
			{
				entityType,
				entityId,
			},
			{
				fetch: {
					headers: {
						Authorization: `Bearer ${session.access_token}`,
					},
				},
				query: {
					select: (data) => {
						if (data.status === 200) {
							updateAssets(data.data.data);
						}

						return data.data;
					},
				},
			},
		),
	});

	if (!assets || assets.length === 0) {
		return null;
	}

	return (
		<div className="p-3 bg-muted rounded-md space-y-2">
			<p className="text-sm font-semibold">Assets</p>
			<AssetSelector entityType={entityType} entityId={entityId} />
		</div>
	);
}
