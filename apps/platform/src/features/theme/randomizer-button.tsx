import { DiceFiveIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function RandomizerButton({ randomize }: { randomize: () => void }) {
	return (
		<Button
			size="sm"
			variant="outline"
			onClick={randomize}
			className="cursor-pointer"
		>
			<DiceFiveIcon />
			Random
		</Button>
	);
}
