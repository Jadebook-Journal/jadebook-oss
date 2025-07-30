"use client";

import { Coolshape } from "coolshapes-react";
import React from "react";
import { EmptyContent } from "@/components/app/empty-content";
import { PageSection } from "@/components/app/page";
import { PageContainer } from "@/components/app/page-container";
import { ExportDialog } from "@/features/data/export-dialog";
import { useQuery } from "@tanstack/react-query";
import { getGetApiExportQueryOptions } from "@/api-client";
import { PageLoading } from "@/components/routes/loading";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { format } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ArrowSquareOutIcon,
	CopyIcon,
	DotsThreeVerticalIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/providers/app-store-provider";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";

export function DataPage() {
	return (
		<PageContainer title="Data">
			<PageSection title="Import">
				<EmptyContent
					icon={<Coolshape type="polygon" index={4} noise={true} size={100} />}
					title="Coming soon"
					description="We're working on it. Stay tuned!"
				/>
			</PageSection>

			<PageSection title="Export" actions={<ExportDialog />}>
				<ExportList />
			</PageSection>
		</PageContainer>
	);
}

function ExportList() {
	const { session } = useAppStore((state) => ({ session: state.session }));

	const [_copiedText, copyToClipboard] = useCopyToClipboard();

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
				return (
					<SettingsPanelSection
						key={exportEvent.id}
						title={`${format(exportEvent.created_at, "dd MMM yyyy")} - ${exportEvent.type}`}
						description={
							new Date(exportEvent.expire_at) < new Date()
								? `Expired on ${format(exportEvent.expire_at, "PPP")}`
								: `Expires on ${format(exportEvent.expire_at, "PPP")}`
						}
					>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<DotsThreeVerticalIcon size={16} />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() =>
										copyToClipboard(
											`${window.location.origin}/export/${exportEvent.id}`,
										).then(() => {
											toast.success("Link copied to clipboard");
										})
									}
								>
									<CopyIcon />
									Copy link
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										window.open(
											`${window.location.origin}/export/${exportEvent.id}?download=true`,
											"_blank",
										);
									}}
								>
									<ArrowSquareOutIcon />
									Open in new tab
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SettingsPanelSection>
				);
			})}
		</SettingsPanel>
	);
}
