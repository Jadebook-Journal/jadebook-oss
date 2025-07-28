"use client";

import * as PhosphorIcons from "@phosphor-icons/react";
import { getIcon, ICON_PHOSPHOR_KEYS } from "jadebook/react";
import React from "react";
import type { GetApiTags200Item } from "@/api-client";
import { cn } from "@/lib/utils";
import { tagColors, type tagVariants } from ".";

type Props = Pick<GetApiTags200Item, "icon" | "label" | "variant" | "color">;

export function getTagIcon(tag: Props) {
	if (!tag.icon || typeof tag.icon !== "string") {
		return { Icon: null, weight: null };
	}

	const icon = getIcon(tag.icon);

	if (!icon) {
		return { Icon: null, weight: null };
	}

	const iconKey = ICON_PHOSPHOR_KEYS[icon.key] as keyof typeof PhosphorIcons;

	// biome-ignore lint/performance/noDynamicNamespaceImportAccess: ignored using `--suppress`
	const Icon = PhosphorIcons[iconKey] as PhosphorIcons.Icon;

	return { Icon, weight: icon.weight };
}

export function RenderTag({
	tag,
	onDelete,
}: {
	tag: Props;
	onDelete?: () => void;
}) {
	const { Icon, weight } = React.useMemo(() => {
		return getTagIcon(tag);
	}, [tag]);

	const generateTag = ({ wrapperClass }: { wrapperClass: string }) => {
		return (
			<div
				className={cn(
					"group/tag text-xs items-center flex font-medium rounded border whitespace-nowrap",
					wrapperClass,
				)}
			>
				<div className="py-0.5 px-2 inline-flex items-center select-none gap-x-1">
					{Icon && (
						<span className="py-0.5">
							<Icon size={14} weight={weight} />
						</span>
					)}
					<span className="font-semibold whitespace-nowrap">{tag.label}</span>
				</div>

				{onDelete && (
					<div className="w-0 mr-0.5 group-hover/tag:w-5 pointer-events-none group-hover/tag:pointer-events-auto transition-all ease-in-out">
						<button
							type="button"
							className={cn(
								"inline-block aspect-square rounded opacity-0 p-1 w-0 group-hover/tag:w-auto",
								"group-hover/tag:opacity-100 hover:bg-destructive hover:text-white",
								"cursor-pointer transition-all ease-in-out",
							)}
							onClick={onDelete}
						>
							<PhosphorIcons.XIcon size={12} weight="bold" />
						</button>
					</div>
				)}
			</div>
		);
	};

	return generateTag({
		wrapperClass:
			tagColors[tag.color as keyof typeof tagColors][
				tag.variant as (typeof tagVariants)[number]
			],
	});
}
