"use client";

import { COVER_CONFIG, generateCover } from "jadebook";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ImageItem } from "./image-item";

export function CoverPicker({
	children,
	title,
	cover,
	onValueChange,
}: {
	children?: React.ReactNode;
	title?: string;
	cover: string | null;
	onValueChange: (value: string | null) => void;
}) {
	const [tab, setTab] = React.useState<"gallery" | "link" | "unsplash">(
		"gallery",
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				{children ? (
					children
				) : (
					<Button variant="secondary" size="action">
						{title || "Edit cover"}
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent
				className={cn(
					"max-w-lg p-0 overflow-hidden w-[80vw] sm:w-[400px] lg:w-[500px] border max-h-[60vh] h-fit",
					tab !== "link" && "h-[500px]",
				)}
			>
				<Tabs
					className="h-full flex flex-col w-full"
					value={tab}
					onValueChange={(value) =>
						setTab(value as "gallery" | "link" | "unsplash")
					}
				>
					<div className="p-1 border-b bg-muted flex items-center justify-between shrink-0">
						<TabsList>
							<TabsTrigger value="gallery">Gallery</TabsTrigger>
							<TabsTrigger value="link">Link</TabsTrigger>
						</TabsList>

						{cover && (
							<Button
								variant="link"
								size="action"
								onClick={() => onValueChange(null)}
							>
								Remove cover
							</Button>
						)}
					</div>

					<div className="h-full overflow-y-auto flex-1 grow">
						<TabsContent value="gallery">
							<GalleryImageSelection handleUpdateCover={onValueChange} />
						</TabsContent>

						<TabsContent value="link">
							<LinkSelection handleUpdateCover={onValueChange} />
						</TabsContent>
					</div>
				</Tabs>
			</PopoverContent>
		</Popover>
	);
}

const CoverSection = ({
	children,
	title,
	additionalContent,
}: {
	children: React.ReactNode;
	title?: string;
	additionalContent?: React.ReactNode;
}) => {
	return (
		<div className="p-2 space-y-1 w-full">
			{title && <p className="text-sm font-medium">{title}</p>}

			{additionalContent}

			<div className="grid grid-cols-4 gap-1 w-full">{children}</div>
		</div>
	);
};

const GalleryImageSelection = React.memo(
	({ handleUpdateCover }: { handleUpdateCover: (cover: string) => void }) => {
		const colors = Object.keys(COVER_CONFIG.solid);
		const gradient = Object.keys(COVER_CONFIG.gradient);

		return (
			<>
				<CoverSection title="Colors">
					{colors.map((color) => {
						const colorClass =
							COVER_CONFIG.solid[color as keyof typeof COVER_CONFIG.solid];

						return (
							<ImageItem
								key={color}
								onClick={() =>
									handleUpdateCover(
										generateCover({ type: "color", value: color }),
									)
								}
								data={{
									type: "color",
									className: colorClass,
								}}
								label={`Color — ${color}`}
							/>
						);
					})}
				</CoverSection>

				<CoverSection title="Gradients">
					{gradient.map((gradient) => {
						const key = Number.parseInt(
							gradient,
						) as keyof typeof COVER_CONFIG.gradient;
						const gradientClass = COVER_CONFIG.gradient[key];

						return (
							<ImageItem
								key={gradient}
								onClick={() =>
									handleUpdateCover(
										generateCover({ type: "gradient", value: gradient }),
									)
								}
								data={{
									type: "color",
									className: gradientClass,
								}}
								label={`Gradient — ${gradient}`}
							/>
						);
					})}
				</CoverSection>
			</>
		);
	},
);

GalleryImageSelection.displayName = "GalleryImageSelection";

const LinkSelection = React.memo(
	({ handleUpdateCover }: { handleUpdateCover: (cover: string) => void }) => {
		const [link, setLink] = React.useState("");

		return (
			<div className="p-3 space-y-3 flex flex-col items-center">
				<Input
					placeholder="Enter a link"
					value={link}
					onChange={(e) => setLink(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleUpdateCover(generateCover({ type: "url", value: link }));
						}
					}}
				/>

				<Button
					className="w-1/2"
					size="sm"
					onClick={() =>
						handleUpdateCover(generateCover({ type: "url", value: link }))
					}
				>
					Submit
				</Button>

				<p className="text-xs text-muted-foreground">
					Works with any public image URL.
				</p>
			</div>
		);
	},
);

LinkSelection.displayName = "LinkSelection";
