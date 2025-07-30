"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import {
	type GetApiAssetsEntityType,
	getGetApiAssetsQueryKey,
	getPostApiAssetsUploadMutationOptions,
} from "@/api-client";
import { PageLoading } from "@/components/routes/loading";
import { useAppStore } from "@/providers/app-store-provider";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";

export function UploadAssetDialog({
	open,
	setOpen,
	onSuccess,
	entityType,
	entityId,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSuccess: () => void;
	entityType: GetApiAssetsEntityType;
	entityId: string;
}) {
	const queryClient = useQueryClient();

	const inputId = React.useId();

	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const uploadAssetMutation = useMutation({
		...getPostApiAssetsUploadMutationOptions({
			mutation: {
				onSuccess: (data) => {
					if (data.status !== 201) {
						toast.error("Failed to upload asset");

						return;
					}

					queryClient.invalidateQueries({
						queryKey: getGetApiAssetsQueryKey({
							entityType,
							entityId,
						}),
					});

					onSuccess();

					uploadAssetMutation.reset();
				},
				onError: (error) => {
					console.log(error);

					toast.error("Failed to upload asset");
				},
			},
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
	});

	// Handle file selection: only accept images and trigger upload
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		uploadAssetMutation.mutate({
			data: {
				file,
				entity_type: entityType,
				entity_id: entityId,
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upload Asset</DialogTitle>
					<DialogDescription>
						Upload an asset to your journal. You can only do 1 file at a time.
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center justify-center w-full">
					<label
						htmlFor={inputId}
						className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer"
					>
						<div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
							{uploadAssetMutation.isPending ? (
								<PageLoading />
							) : (
								<>
									<svg
										className="w-8 h-8 mb-4"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 20 16"
									>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
										/>
									</svg>
									<p className="mb-2 text-sm">
										<span className="font-semibold">Click to upload</span> or
										drag and drop
									</p>
									<p className="text-xs text-center max-w-[80%]">
										All image, audio, text, and application file types are
										supported. Max file size is 2MB.
									</p>
								</>
							)}
						</div>
						<input
							disabled={uploadAssetMutation.isPending}
							id={inputId}
							type="file"
							className="hidden"
							onChange={handleFileChange}
						/>
					</label>
				</div>
			</DialogContent>
		</Dialog>
	);
}
