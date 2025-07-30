"use client";

import {
	CopyIcon,
	DotsThreeVerticalIcon,
	DownloadSimpleIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Coolshape } from "coolshapes-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import {
	getGetApiExportQueryKey,
	getGetApiExportQueryOptions,
	getPutApiExportIdMutationOptions,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { PageSection } from "@/components/app/page";
import { PageContainer } from "@/components/app/page-container";
import { PageLoading } from "@/components/routes/loading";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportDialog } from "@/features/data/export-dialog";
import { useAppStore } from "@/providers/app-store-provider";
import {
	ImportFileDialog,
	ImportUrlDialog,
} from "@/features/data/import-dialog";

export function DataPage() {
	return (
		<PageContainer title="Data">
			<PageSection title="Import">
				<SettingsPanel>
					<SettingsPanelSection
						title="Import from JSON"
						description="Import from a Jadebook-formatted JSON file."
					>
						<ImportFileDialog />
					</SettingsPanelSection>
					<SettingsPanelSection
						title="Import from URL"
						description="Import from a Jadebook-formatted JSON file from a URL."
					>
						<ImportUrlDialog />
					</SettingsPanelSection>
				</SettingsPanel>
			</PageSection>

			<PageSection
				title="Export"
				description="Exports are publicly available which is why it's recommended to expire them when they're no longer useful."
				actions={<ExportDialog />}
			>
				<ExportList />
			</PageSection>
		</PageContainer>
	);
}

function ExportList() {
	const queryClient = useQueryClient();
	const { session } = useAppStore((state) => ({ session: state.session }));

	const [_copiedText, copyToClipboard] = useCopyToClipboard();

	const expireExportMutation = useMutation({
		...getPutApiExportIdMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onSuccess: () => {
			toast.success("Export expired");

			queryClient.invalidateQueries({
				queryKey: getGetApiExportQueryKey(),
			});
		},
		onError: () => {
			toast.error("Failed to expire export");
		},
	});

	const exportsQuery = useQuery({
		...getGetApiExportQueryOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
	});

	if (exportsQuery.isLoading) {
		return <PageLoading />;
	}

	if (
		exportsQuery.isError ||
		!exportsQuery.data ||
		exportsQuery.data.status !== 200
	) {
		return (
			<EmptyContent
				icon={<Coolshape type="polygon" index={4} noise={true} size={100} />}
				title="Error"
				description="Failed to load exports"
			/>
		);
	}

	if (exportsQuery.data.data.length === 0) {
		return (
			<EmptyContent
				icon={<Coolshape type="polygon" index={4} noise={true} size={100} />}
				title="No exports found"
				description="You haven't exported any data yet"
			/>
		);
	}

	return (
		<SettingsPanel>
			{exportsQuery.data.data.map((exportEvent) => {
				const isExpired = new Date(exportEvent.expire_at) < new Date();

				return (
					<SettingsPanelSection
						key={exportEvent.id}
						title={`${format(exportEvent.created_at, "dd MMM yyyy")} - ${exportEvent.type}`}
						description={
							isExpired
								? `Expired on ${format(exportEvent.expire_at, "PPP")}`
								: `Expires on ${format(exportEvent.expire_at, "PPP")}`
						}
					>
						{isExpired ? (
							<p className="text-sm text-muted-foreground italic">Expired</p>
						) : (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<DotsThreeVerticalIcon size={16} />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent>
									<DropdownMenuItem
										disabled={expireExportMutation.isPending}
										onClick={() =>
											copyToClipboard(
												`${window.location.origin}/data-export/${exportEvent.id}`,
											).then(() => {
												toast.success("Link copied to clipboard");
											})
										}
									>
										<CopyIcon />
										Copy link
									</DropdownMenuItem>
									<DropdownMenuItem
										disabled={expireExportMutation.isPending}
										onClick={() => {
											window.open(
												`${window.location.origin}/data-export/${exportEvent.id}?download=true`,
												"_blank",
											);
										}}
									>
										<DownloadSimpleIcon />
										Download
									</DropdownMenuItem>

									<DropdownMenuSeparator />

									<DropdownMenuItem
										disabled={expireExportMutation.isPending}
										variant="destructive"
										onClick={() => {
											expireExportMutation.mutate({
												id: exportEvent.id,
												data: {
													expire_at: new Date().toISOString(),
												},
											});
										}}
									>
										<TrashIcon />
										Expire
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</SettingsPanelSection>
				);
			})}
		</SettingsPanel>
	);
}
