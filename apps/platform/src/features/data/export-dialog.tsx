"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays } from "date-fns";
import React from "react";
import { toast } from "sonner";
import {
	getGetApiExportQueryKey,
	getPostApiExportMutationOptions,
} from "@/api-client";
import { SettingsPanel, SettingsPanelSectionMini } from "@/components/settings";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/providers/app-store-provider";

export function ExportDialog() {
	const queryClient = useQueryClient();

	const { profile, session } = useAppStore((state) => ({
		profile: state.profile,
		session: state.session,
	}));

	const [open, setOpen] = React.useState(false);
	const [selectedType, setSelectedType] = React.useState<"entries" | "goals">(
		"entries",
	);

	// use when the account was created as the default start date
	const [startDate, setStartDate] = React.useState<Date>(
		new Date(profile.created_at),
	);
	const [endDate, setEndDate] = React.useState<Date>(new Date());
	const [expireAt, setExpireAt] = React.useState<Date>(addDays(new Date(), 3));

	const createExportMutation = useMutation({
		...getPostApiExportMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onSuccess: () => {
			toast.success("Export created");

			// refresh the exports list
			queryClient.invalidateQueries({
				queryKey: getGetApiExportQueryKey(),
			});

			setOpen(false);

			// reset the state
			setSelectedType("entries");
			setStartDate(new Date(profile.created_at));
			setEndDate(new Date());
			setExpireAt(addDays(new Date(), 3));
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">Export</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Export</DialogTitle>

					<DialogDescription>
						Export your data for offline or sharing. The export will be in JSON
						format.
					</DialogDescription>
				</DialogHeader>

				<SettingsPanel>
					<SettingsPanelSectionMini title="Resource">
						<Tabs
							value={selectedType}
							onValueChange={(value) =>
								setSelectedType(value as "entries" | "goals")
							}
						>
							<TabsList>
								<TabsTrigger value="entries">Entries</TabsTrigger>
								<TabsTrigger value="goals">Goals</TabsTrigger>
							</TabsList>
						</Tabs>
					</SettingsPanelSectionMini>

					<SettingsPanelSectionMini
						title="Start Date"
						description="Include entries from this date onwards"
					>
						<DatePicker
							className="w-fit"
							label="Start date"
							date={startDate}
							setDate={(value) => setStartDate(value)}
						/>
					</SettingsPanelSectionMini>

					<SettingsPanelSectionMini
						title="End Date"
						description="Include entries up to this date"
					>
						<DatePicker
							className="w-fit"
							label="End date"
							date={endDate}
							setDate={(value) => setEndDate(value)}
						/>
					</SettingsPanelSectionMini>

					<SettingsPanelSectionMini
						title="Expire At"
						description="The export will no longer be available after this date"
					>
						<DatePicker
							className="w-fit"
							label="Expire at"
							date={expireAt}
							setDate={(value) => setExpireAt(value)}
						/>
					</SettingsPanelSectionMini>
				</SettingsPanel>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant="outline"
							size="sm"
							disabled={createExportMutation.isPending}
						>
							Cancel
						</Button>
					</DialogClose>

					<Button
						variant="default"
						size="sm"
						disabled={createExportMutation.isPending}
						onClick={() => {
							createExportMutation.mutate({
								data: {
									type: selectedType,
									start_date: startDate.toISOString(),
									end_date: endDate.toISOString(),
									expire_at: expireAt.toISOString(),
								},
							});
						}}
					>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
