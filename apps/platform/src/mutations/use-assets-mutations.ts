import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getDeleteApiAssetsIdMutationOptions,
	getGetApiAssetsQueryKey,
} from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";
import { useAssetStore } from "@/providers/assets-provider";

/**
 * handles asset mutations and there optimistic updates + side effects
 */
export function useAssetMutations(props?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient();

	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const { assets, updateAssets } = useAssetStore((store) => ({
		assets: store.assets,
		updateAssets: store.updateAssets,
	}));

	const deleteAssetMutation = useMutation({
		...getDeleteApiAssetsIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			updateAssets(assets.filter((asset) => asset.id !== data.id));
		},
		onSuccess: (data, variables) => {
			if (data.status !== 200) {
				return;
			}

			queryClient.invalidateQueries({
				queryKey: getGetApiAssetsQueryKey(),
			});

			updateAssets(assets.filter((asset) => asset.id !== variables.id));

			props?.onSuccess?.();
		},
		onError: (error) => {
			console.error(error);

			queryClient.invalidateQueries({
				queryKey: getGetApiAssetsQueryKey(),
			});
		},
	});

	return {
		deleteAssetMutation,
	};
}
