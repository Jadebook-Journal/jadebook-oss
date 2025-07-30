import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ThemePreset } from "@/types/theme";
import { useThemeHelpers } from "./use-theme-helpers";

type ThemePresetSelectProps = {
	presets: Record<string, ThemePreset>;
	currentPreset: string | null;
	onPresetChange: (preset: string) => void;
};

const ThemePresetSelect = ({
	presets,
	currentPreset,
	onPresetChange,
}: ThemePresetSelectProps) => {
	const { getThemeColor, presetNames, value } = useThemeHelpers({
		presets,
		currentPreset,
		onPresetChange,
	});

	return (
		<Select value={value || ""} onValueChange={onPresetChange}>
			<SelectTrigger className="h-12 cursor-pointer">
				<SelectValue placeholder="Choose Theme" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Pre Built Themes</SelectLabel>
					{presetNames.map((name) => {
						return (
							<SelectItem
								key={name}
								value={name}
								className="flex items-center gap-3"
							>
								{/* Theme Color Grid Icon */}
								<div className="flex items-center">
									<div className="bg-background relative size-[26px] rounded border p-1">
										<div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px]">
											<div
												className="rounded-[2px]"
												style={{
													backgroundColor: getThemeColor(name, "primary"),
												}}
											/>
											<div
												className="rounded-[2px]"
												style={{
													backgroundColor: getThemeColor(name, "destructive"),
												}}
											/>
											<div
												className="rounded-[2px]"
												style={{
													backgroundColor: getThemeColor(name, "secondary"),
												}}
											/>
											<div
												className="rounded-full"
												style={{
													backgroundColor: getThemeColor(name, "accent"),
												}}
											/>
										</div>
									</div>
								</div>
								<span className="block">
									{name
										.replace(/-/g, " ")
										.replace(/\b\w/g, (char) => char.toUpperCase())}
								</span>
							</SelectItem>
						);
					})}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default ThemePresetSelect;
