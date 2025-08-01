"use client";

import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { Coolshape } from "coolshapes-react";
import { Button } from "@/components/ui/button";

export function ErrorRoute(props: { message?: string }) {
	return (
		<main className="relative isolate size-full bg-background text-foreground">
			<div className="mx-auto flex flex-col items-center justify-center max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
				<Coolshape type="triangle" index={9} size={100} noise />

				<h1 className="mt-4 text-balance text-3xl font-medium tracking-tight sm:text-4xl">
					Error occurred
				</h1>
				<p className="mt-2 text-pretty text-sm text-muted-foreground">
					{props.message ??
						"Something went seriously wrong to the point where the page broke"}
				</p>

				<div className="mt-10 flex justify-center gap-2">
					<Button
						variant="outline"
						onClick={() => {
							window.location.reload();
						}}
					>
						<ArrowCounterClockwiseIcon size={16} weight="bold" />
						Reload the page
					</Button>
				</div>
			</div>
		</main>
	);
}
