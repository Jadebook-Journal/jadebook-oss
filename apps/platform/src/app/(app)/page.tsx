"use client";

import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function ProtectedPage() {
	return (
		<div className="flex-1 w-full flex flex-col gap-12">
			<h1>Hello World</h1>

			<Button onClick={() => signOutAction()}>Sign Out</Button>
		</div>
	);
}
