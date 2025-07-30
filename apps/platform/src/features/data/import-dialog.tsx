"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
import { Dropzone } from "@/components/ui/dropzone";
import { useMutation } from "@tanstack/react-query";
import { getPostApiImportJsonMutationOptions } from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function ImportFileDialog() {
	const router = useRouter();
	const { session } = useAppStore((store) => ({ session: store.session }));
	const [open, setOpen] = React.useState(false);

	const [file, setFile] = React.useState<File | null>(null);

	const importFileMutation = useMutation({
		...getPostApiImportJsonMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onSuccess: () => {
			toast.success("Imported successfully");

			setOpen(false);

			router.refresh();
		},
		onError: () => {
			toast.error("Failed to import");
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Import from JSON</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import from JSON</DialogTitle>

					<DialogDescription>
						Import from a Jadebook-formatted JSON file.
					</DialogDescription>
				</DialogHeader>

				<Dropzone
					className="mt-4"
					accept="application/json"
					multiple={false}
					maxSize={10 * 1024 * 1024} // 10MB
					value={file ? [file] : []}
					onChange={(files) => {
						setFile(files[0] ?? null);
					}}
				/>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant="outline"
							size="sm"
							disabled={importFileMutation.isPending}
						>
							Cancel
						</Button>
					</DialogClose>

					<Button
						variant="default"
						size="sm"
						disabled={!file || importFileMutation.isPending}
						onClick={() => {
							if (!file) {
								return;
							}

							importFileMutation.mutate({
								data: {
									file: file,
								},
							});
						}}
					>
						Import
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function ImportUrlDialog() {
	const router = useRouter();
	const { session } = useAppStore((store) => ({ session: store.session }));
	const [open, setOpen] = React.useState(false);

	const [url, setUrl] = React.useState("");

	const importFileMutation = useMutation({
		...getPostApiImportJsonMutationOptions({
			fetch: {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			},
		}),
		onSuccess: () => {
			toast.success("Imported successfully");

			setOpen(false);

			router.refresh();
		},
		onError: () => {
			toast.error("Failed to import");
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Import from URL</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import from URL</DialogTitle>

					<DialogDescription>
						Import from a Jadebook-formatted JSON file from a URL.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-1">
					<Label asChild>
						<p>URL</p>
					</Label>
					<Input value={url} onChange={(e) => setUrl(e.target.value)} />
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant="outline"
							size="sm"
							disabled={importFileMutation.isPending}
						>
							Cancel
						</Button>
					</DialogClose>

					<Button
						variant="default"
						size="sm"
						disabled={!url || importFileMutation.isPending}
						onClick={() => {
							if (!url) {
								return;
							}

							importFileMutation.mutate({
								data: {
									url: url,
								},
							});
						}}
					>
						Import
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
