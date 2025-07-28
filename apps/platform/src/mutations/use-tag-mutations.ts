import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type GetApiTags200Item,
	getDeleteApiTagsIdMutationOptions,
	getGetApiTagsQueryKey,
	getPostApiTagsMutationOptions,
	getPutApiTagsIdMutationOptions,
} from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";

/**
 * Handles tag mutations and there optimistic updates + side effects
 */
export function useTagMutations(props?: {
	onSuccess?: () => void;
	onError?: () => void;
}) {
	const queryClient = useQueryClient();

	const { tags, updateTag, updateTags, session } = useAppStore((store) => ({
		tags: store.tags,
		updateTag: store.updateTag,
		updateTags: store.updateTags,
		session: store.session,
	}));

	const createTagMutation = useMutation({
		...getPostApiTagsMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			// we update the zustand store
			const new_tag: GetApiTags200Item = {
				...data.data,
				id: "temp",
				user_id: session.user.id,
				cover: null,
				pinned: false,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				icon: null,
			};

			updateTags([...tags, new_tag]);
		},
		onSuccess: (data) => {
			if (data.status !== 201) {
				return;
			}

			// re-sync the tags
			queryClient.invalidateQueries({
				queryKey: getGetApiTagsQueryKey(),
			});

			props?.onSuccess?.();
		},
		onError: (error) => {
			console.error(error);

			// will auto fix the optimistic update
			queryClient.invalidateQueries({
				queryKey: getGetApiTagsQueryKey(),
			});

			props?.onError?.();
		},
	});

	const updateTagMutation = useMutation({
		...getPutApiTagsIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			// we update the zustand store

			const tag = tags.find((tag) => tag.id === data.id);

			if (!tag) {
				throw new Error("Tag not found");
			}

			updateTag({
				...tag,
				...data.data,
				// pinned is a special case, it's named isPinned in the api
				pinned: data.data.pinned ?? tag.pinned,
				id: data.id,
				user_id: session.user.id,
			});
		},
		onSuccess: (data) => {
			if (data.status !== 200) {
				return;
			}

			// re-sync the tags
			queryClient.invalidateQueries({
				queryKey: getGetApiTagsQueryKey(),
			});

			props?.onSuccess?.();
		},
		onError: (error) => {
			console.error(error);

			// will auto fix the optimistic update
			queryClient.invalidateQueries({
				queryKey: getGetApiTagsQueryKey(),
			});

			props?.onError?.();
		},
	});

	const deleteTagMutation = useMutation({
		...getDeleteApiTagsIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			// we update the zustand store
			updateTags(tags.filter((tag) => tag.id !== data.id));
		},
		onSuccess: (data) => {
			if (data.status !== 200) {
				return;
			}

			// re-sync the tags
			queryClient.invalidateQueries({
				queryKey: getGetApiTagsQueryKey(),
			});

			props?.onSuccess?.();
		},
		onError: (error) => {
			console.error(error);

			// will auto fix the optimistic update
			queryClient.invalidateQueries({
				queryKey: getGetApiTagsQueryKey(),
			});

			props?.onError?.();
		},
	});

	return {
		createTagMutation,
		updateTagMutation,
		deleteTagMutation,
	};
}
