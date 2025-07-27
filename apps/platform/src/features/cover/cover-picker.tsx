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
							<TabsTrigger value="unsplash">Unsplash</TabsTrigger>
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
		const glow = Object.keys(COVER_CONFIG.glow);
		const vivid = Object.keys(COVER_CONFIG.vivid);
		const grads = Object.keys(COVER_CONFIG.grads);

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

				<CoverSection title="Glow Cascade by Is.Graphics">
					{glow.map((glow) => {
						const { mini, full } =
							COVER_CONFIG.glow[
								Number.parseInt(glow) as keyof typeof COVER_CONFIG.glow
							];

						return (
							<ImageItem
								key={glow}
								onClick={() =>
									handleUpdateCover(generateCover({ type: "url", value: full }))
								}
								data={{
									type: "image",
									src: mini,
								}}
								label={`Glow — ${glow}`}
							/>
						);
					})}
				</CoverSection>

				<CoverSection title="Vivid Spheroids by Is.Graphics">
					{vivid.map((vivid) => {
						const { mini, full } =
							COVER_CONFIG.vivid[
								Number.parseInt(vivid) as keyof typeof COVER_CONFIG.vivid
							];

						return (
							<ImageItem
								key={vivid}
								onClick={() =>
									handleUpdateCover(generateCover({ type: "url", value: full }))
								}
								data={{
									type: "image",
									src: mini,
								}}
								label={`Vivid — ${vivid}`}
							/>
						);
					})}
				</CoverSection>

				<CoverSection title="Grads V2 by Charco">
					{grads.map((grad) => {
						const { mini, full } =
							COVER_CONFIG.grads[
								Number.parseInt(grad) as keyof typeof COVER_CONFIG.grads
							];

						return (
							<ImageItem
								key={grad}
								onClick={() =>
									handleUpdateCover(generateCover({ type: "url", value: full }))
								}
								data={{
									type: "image",
									src: mini,
								}}
								label={`Grads V2 — ${grad}`}
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
