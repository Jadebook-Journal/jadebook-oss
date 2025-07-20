"use client";

import { PenNibStraightIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type React from "react";

type Props = {
	children: React.ReactNode;
	imageSrc: string;
};

export function AuthFormWrapper({ children, imageSrc }: Props) {
	return (
		<div className="grid lg:grid-cols-5 w-full min-h-screen">
			<div className="relative size-full lg:col-span-2">
				<div className="absolute inset-4 lg:right-2 rounded-2xl overflow-hidden">
					<div className="h-full flex flex-col gap-6 justify-between p-8">
						<motion.div
							animate={{ height: "auto" }}
							className="max-w-md w-full mx-auto grow flex flex-col justify-center"
						>
							<AnimatePresence mode="sync">{children}</AnimatePresence>
						</motion.div>

						<div className="text-balance text-center text-xs text-gray-600 [&_button]:underline [&_button]:underline-offset-4 hover:[&_button]:text-gray-900">
							Provided under the MIT (Personal Use Only) License.
						</div>
					</div>
				</div>

				<div className="absolute top-10 left-10 z-10 flex gap-4 items-center">
					<PenNibStraightIcon
						size={32}
						weight="duotone"
						className="text-emerald-500"
					/>
				</div>
			</div>

			<div className="hidden lg:block lg:col-span-3 relative size-full">
				<motion.div
					initial={{ opacity: 0.6, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="absolute inset-4 lg:left-2 bg-emerald-900 rounded-2xl overflow-hidden"
				>
					<Image
						src={imageSrc}
						alt="auth hero background"
						className="size-full object-cover rounded-2xl overflow-hidden"
						fill
						priority
						loading="eager"
						unoptimized
					/>
				</motion.div>
			</div>
		</div>
	);
}

export function AuthHeader({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col items-center text-center">
			<h1 className="text-2xl font-bold text-gray-800">{title}</h1>
			<p className="text-balance text-gray-600">{description}</p>
		</div>
	);
}
