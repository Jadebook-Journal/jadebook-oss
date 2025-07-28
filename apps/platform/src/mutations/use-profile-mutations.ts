import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getDeleteApiProfileMutationOptions,
	getGetApiProfileQueryKey,
	getPutApiProfileMutationOptions,
} from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Handles profile mutations and there optimistic updates + side effects
 */
export function useProfileMutations(props?: {
	onSuccess?: () => void;
	onError?: () => void;
}) {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { profile, session, updateProfile } = useAppStore((store) => ({
		profile: store.profile,
		session: store.session,
		updateProfile: store.updateProfile,
	}));

	const updateProfileMutation = useMutation({
		...getPutApiProfileMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onMutate: (data) => {
			// we update the zustand store
			updateProfile({ ...profile, ...data.data });
		},
		onSuccess: (data) => {
			if (data.status !== 200) {
				return;
			}

			// re-sync the profile
			queryClient.invalidateQueries({
				queryKey: getGetApiProfileQueryKey(),
			});

			props?.onSuccess?.();
		},
		onError: (error) => {
			console.error(error);

			// will auto fix the optimistic update
			queryClient.invalidateQueries({
				queryKey: getGetApiProfileQueryKey(),
			});

			props?.onError?.();
		},
	});

	const deleteProfileMutation = useMutation({
		...getDeleteApiProfileMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onSuccess: (data) => {
			if (data.status !== 200) {
				return;
			}

			router.push("/");

			props?.onSuccess?.();
		},
		onError: (error) => {
			toast.error("Failed to delete profile");
			console.error(error);

			props?.onError?.();
		},
	});

	return {
		updateProfileMutation,
		deleteProfileMutation,
	};
}
