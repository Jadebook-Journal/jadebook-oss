"use client";

import { format } from "date-fns";
import { useGlobalEntryStore } from "@/stores/global-entry-store";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

/**
 * A dialog that displays information about an entry.
 */
export function EntryInformationDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const characterCount = useGlobalEntryStore((store) => store.character_count);
	const createdAt = useGlobalEntryStore((store) => store.created_at);
	const updatedAt = useGlobalEntryStore((store) => store.updated_at);
	const entryDate = useGlobalEntryStore((store) => store.entry_date);
	const title = useGlobalEntryStore((store) => store.title);
	const excerpt = useGlobalEntryStore((store) => store.excerpt);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Information</DialogTitle>
					<DialogDescription className="sr-only">
						This is the information dialog
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5">
					<InformationBit title="Title" value={title} />
					<InformationBit title="Excerpt" value={excerpt || "No excerpt"} />

					<div className="grid grid-cols-2 gap-5">
						<InformationBit
							title="Created"
							value={format(createdAt, "dd MMM yyyy")}
						/>
						<InformationBit
							title="Modified"
							value={format(updatedAt, "dd MMM yyyy")}
						/>
						<InformationBit
							title="Entry Date"
							value={format(entryDate, "dd MMM yyyy")}
						/>
						<InformationBit
							title="Character Count"
							value={characterCount.toString()}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function InformationBit({ title, value }: { title: string; value: string }) {
	return (
		<div>
			<p className="text-xs text-muted-foreground">{title}</p>
			<p className="text-base font-medium">{value}</p>
		</div>
	);
}
