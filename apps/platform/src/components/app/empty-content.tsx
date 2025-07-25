"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function EmptyContent({
	title,
	description,
	icon,
	options,
	className,
	actions,
}: {
	title: string;
	description: React.ReactNode;
	icon: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
	options?: {
		disablePadding?: boolean;
		disableBorder?: boolean;
	};
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className={cn(
				"flex justify-center items-center flex-col rounded-xl gap-y-3 @container",
				options?.disableBorder ? "" : "border",
				options?.disablePadding ? "" : "px-5 py-12",
				className,
			)}
		>
			<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
				{icon}
			</motion.div>

			<p className="font-semibold text-xl">{title}</p>

			<p className="text-sm w-3/4 @md:w-1/2 text-center text-muted-foreground">
				{description}
			</p>

			{actions && <div className="mt-4">{actions}</div>}
		</motion.div>
	);
}
