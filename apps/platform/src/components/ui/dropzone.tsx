/** biome-ignore-all lint/a11y/noStaticElementInteractions: the dropzone is specifically designed to be static */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: the dropzone is specifically designed to be static */
"use client";

import { FileIcon, UploadSimpleIcon, XIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DropzoneProps {
	value?: File[];
	onChange?: (files: File[]) => void;
	className?: string;
	accept?: string;
	multiple?: boolean;
	maxSize?: number; // in bytes
}

export function Dropzone({
	value = [],
	onChange,
	className,
	accept,
	multiple = true,
	maxSize = 10 * 1024 * 1024, // 10MB default
}: DropzoneProps) {
	const [isDragOver, setIsDragOver] = React.useState(false);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);

		const droppedFiles = Array.from(e.dataTransfer.files);
		handleFiles(droppedFiles);
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		handleFiles(selectedFiles);
	};

	const handleFiles = (newFiles: File[]) => {
		// Filter files by size and type
		const validFiles = newFiles.filter((file) => {
			if (maxSize && file.size > maxSize) {
				console.warn(
					`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
				);
				return false;
			}
			return true;
		});

		if (multiple) {
			// Add to existing files, avoiding duplicates
			const existingNames = value.map((f) => f.name);
			const uniqueFiles = validFiles.filter(
				(f) => !existingNames.includes(f.name),
			);
			onChange?.([...value, ...uniqueFiles]);
		} else {
			// Replace with single file
			onChange?.(validFiles.slice(0, 1));
		}
	};

	const removeFile = (index: number) => {
		const updatedFiles = value.filter((_, i) => i !== index);
		onChange?.(updatedFiles);
	};

	const clearFiles = () => {
		onChange?.([]);
	};

	const openFileDialog = () => {
		fileInputRef.current?.click();
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	return (
		<div className={cn("w-full", className)}>
			{value.length > 0 ? (
				<div className="mt-4 space-y-3">
					<div className="flex items-center justify-between">
						<h4 className="text-sm font-medium">
							Uploaded Files ({value.length})
						</h4>
						<Button variant="outline" size="action" onClick={clearFiles}>
							Clear All
						</Button>
					</div>

					<div className="space-y-2">
						{value.map((file, index) => (
							<div
								key={`${file.name}-${index}`}
								className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
							>
								<div className="flex items-center space-x-3 min-w-0 flex-1">
									<FileIcon
										size={16}
										className="text-muted-foreground flex-shrink-0"
									/>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium line-clamp-1">
											{file.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{formatFileSize(file.size)}
										</p>
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										removeFile(index);
									}}
									className="h-8 w-8 p-0 flex-shrink-0"
								>
									<XIcon size={16} />
								</Button>
							</div>
						))}
					</div>
				</div>
			) : (
				<>
					<div
						className={cn(
							"w-full py-10 border-2 border-dashed transition-colors cursor-pointer rounded-lg",
							isDragOver
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25 hover:border-muted-foreground/50",
						)}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={openFileDialog}
					>
						<div className="flex flex-col items-center justify-center space-y-4 text-center px-6">
							<div className="rounded-full bg-muted p-4">
								<UploadSimpleIcon size={20} className="text-muted-foreground" />
							</div>
							<div className="space-y-2">
								<h3 className="text-lg font-medium">
									Drop files here or click to browse
								</h3>
								<p className="text-sm text-muted-foreground">
									{multiple ? "Upload multiple files" : "Upload a single file"}
									{maxSize && ` (max ${formatFileSize(maxSize)})`}
								</p>
							</div>
						</div>
					</div>

					<input
						ref={fileInputRef}
						type="file"
						className="hidden"
						accept={accept}
						multiple={multiple}
						onChange={handleFileInput}
					/>
				</>
			)}
		</div>
	);
}
