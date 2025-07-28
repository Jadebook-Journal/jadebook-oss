import { Button } from "@/components/ui/button";
import { DiceFiveIcon } from "@phosphor-icons/react";

export function RandomizerButton({ randomize }: { randomize: () => void }) {
	return (
		<Button
			size="action"
			variant="default"
			onClick={randomize}
			className="cursor-pointer"
		>
			<DiceFiveIcon />
			Random
		</Button>
	);
}
