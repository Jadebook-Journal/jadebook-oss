"use client";

import equal from "fast-deep-equal";
import { useProfileMutations } from "@/mutations/use-profile-mutations";
import {
	parseConfig,
	parseTheme,
	useAppStore,
} from "@/providers/app-store-provider";
import { Button } from "../ui/button";
import { generateThemeCode } from "@/features/theme/style-generator";
import type { ThemeStyleProps } from "@/types/theme";

export function ThemeExportButton() {
	const { theme } = useAppStore((store) => ({
		theme: store.theme,
	}));

	return (
		<Button
			variant="secondary"
			value="action"
			size="action"
			onClick={() => {
				navigator.clipboard.writeText(
					generateThemeCode({
						light: theme.theme.light as ThemeStyleProps,
						dark: theme.theme.dark as ThemeStyleProps,
					}),
				);
			}}
		>
			Copy Theme
		</Button>
	);
}

export function ThemeSaveButton() {
	const { theme, profile } = useAppStore((store) => ({
		theme: store.theme,
		profile: store.profile,
	}));

	const originalTheme = parseTheme(profile.theme);

	const { updateProfileMutation } = useProfileMutations();

	const handleSave = () => {
		updateProfileMutation.mutate({
			data: {
				theme: JSON.stringify(theme),
			},
		});
	};

	const isDisabled =
		updateProfileMutation.isPending || equal(theme, originalTheme);

	return (
		<Button
			value="action"
			size="action"
			disabled={isDisabled}
			onClick={handleSave}
		>
			Save changes
		</Button>
	);
}

export function ConfigSaveButton() {
	const { config, profile } = useAppStore((store) => ({
		config: store.config,
		profile: store.profile,
	}));

	const originalConfig = parseConfig(profile.config);

	const { updateProfileMutation } = useProfileMutations();

	const handleSave = () => {
		updateProfileMutation.mutate({
			data: {
				config: JSON.stringify(config),
			},
		});
	};

	const isDisabled =
		updateProfileMutation.isPending || equal(config, originalConfig);

	return (
		<Button
			value="action"
			size="action"
			disabled={isDisabled}
			onClick={handleSave}
		>
			Save changes
		</Button>
	);
}
