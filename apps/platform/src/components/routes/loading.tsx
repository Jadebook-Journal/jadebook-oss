import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export function FullPageLoading() {
	return (
		<div className="size-full min-h-screen py-12 flex flex-col items-center justify-center">
			<CircleNotchIcon size={32} weight="light" className="animate-spin" />
		</div>
	);
}

export function PageLoading({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"size-full w-full py-12 flex flex-col items-center justify-center",
				className,
			)}
		>
			<CircleNotchIcon size={24} weight="light" className="animate-spin" />
		</div>
	);
}
