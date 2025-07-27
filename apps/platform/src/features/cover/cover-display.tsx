"use client";

import { parseCover } from "jadebook";
import { cn } from "@/lib/utils";

export function CoverDisplay({
	cover,
	actions,
}: {
	cover: string | null | undefined;
	actions?: React.ReactNode;
}) {
	if (!cover) {
		return null;
	}

	const coverProps = parseCover(cover);

	if (!coverProps) {
		return null;
	}

	return (
		<div className="relative w-full group">
			<div
				className={cn(
					"w-full aspect-video md:aspect-[16/7] lg:aspect-[16/4] bg-muted",
					coverProps.class,
				)}
				style={{
					backgroundImage: coverProps.style,
				}}
			/>

			{actions && (
				<div className="absolute inset-0 z-10">
					<div className="max-w-3xl mx-auto w-full p-5 flex justify-end sm:opacity-0 group-hover:opacity-100 transition-opacity ease-in-out">
						{actions}
					</div>
				</div>
			)}
		</div>
	);
}
