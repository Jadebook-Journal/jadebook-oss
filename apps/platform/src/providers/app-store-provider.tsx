"use client";

import equal from "fast-deep-equal";
import React, { createContext, type ReactNode, useContext } from "react";
import { useStore as useZustandStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { BASE_CONFIG } from "@/features/config/base.config";
import { type AppState, createAppStore } from "@/stores/app-store";
import {
	type getApiMiscPinnedResponse,
	useGetApiMiscPinned,
	useGetApiProfile,
	useGetApiTags,
	type getApiProfileResponse,
	type getApiTagsResponse,
} from "@/api-client";

import { mergeWithDefault } from "jadebook";
import { defaultThemeState } from "@/features/theme/config.theme";
import type { SavedThemeSettings, ThemeType } from "@/types/theme";
import { AppConfig } from "@/types/config";

type AppStore = ReturnType<typeof createAppStore>;

export const AppStoreContext = createContext<AppStore | null>(null);

interface AppStoreProviderProps {
	children: ReactNode;
	initialState: Pick<AppState, "session"> & {
		profile: getApiProfileResponse;
		pinnedResources: getApiMiscPinnedResponse;
		tags: getApiTagsResponse;
	};
}

/**
 * The app store requires values from the server so to sync the server and client, we need a provider for the app store
 */
export const AppStoreProvider = ({
	children,
	initialState,
}: AppStoreProviderProps) => {
	// useRef to ensure the store is created only once per request/render
	const storeRef = React.useRef<AppStore | null>(null);

	// Load React Query with the initial data — let's us load on server and refresh on client
	const profileQuery = useGetApiProfile({
		query: {
			initialData: initialState.profile,
		},
		fetch: {
			headers: {
				Authorization: initialState.session.access_token,
			},
		},
	});

	const pinnedResourcesQuery = useGetApiMiscPinned({
		query: {
			initialData: initialState.pinnedResources,
		},
		fetch: {
			headers: {
				Authorization: initialState.session.access_token,
			},
		},
	});

	const tagsQuery = useGetApiTags({
		query: {
			initialData: initialState.tags,
		},
		fetch: {
			headers: {
				Authorization: initialState.session.access_token,
			},
		},
	});

	if (
		profileQuery.isError ||
		pinnedResourcesQuery.isError ||
		tagsQuery.isError
	) {
		throw new Error("Failed to fetch profile, pinned resources, or tags");
	}

	// properly type the data
	const profile =
		profileQuery.data.status === 200 ? profileQuery.data.data : null;
	const pinnedResources =
		pinnedResourcesQuery.data.status === 200
			? pinnedResourcesQuery.data.data
			: null;
	const tags = tagsQuery.data.status === 200 ? tagsQuery.data.data : null;

	// the initial data is required for the app to work correctly
	if (!profile || !pinnedResources || !tags) {
		throw new Error("Failed to fetch profile, pinned resources, or tags");
	}

	// parse the JSON to appropriate types
	const theme = parseTheme(profile.theme);
	const config = parseConfig(profile.config);

	if (!storeRef.current) {
		storeRef.current = createAppStore({
			profile,
			pinnedResources,
			tags,
			theme,
			session: initialState.session,
			config,
		});
	}

	React.useEffect(() => {
		if (!storeRef.current) return;

		const currentState = storeRef.current.getState();

		// Check if any values have actually changed
		const hasChanged =
			!equal(currentState.profile, profile) ||
			!equal(currentState.pinnedResources, pinnedResources) ||
			!equal(currentState.tags, tags) ||
			!equal(currentState.theme, theme);

		if (hasChanged) {
			storeRef.current.setState({
				profile,
				pinnedResources,
				tags,
				theme,
			});
		}
	}, [profile, pinnedResources, tags, theme]);

	return (
		<AppStoreContext.Provider value={storeRef.current}>
			{children}
		</AppStoreContext.Provider>
	);
};

// Custom hook to use the store from the context
export const useAppStore = <T,>(selector: (store: AppState) => T): T => {
	const appStoreContext = useContext(AppStoreContext);

	if (!appStoreContext) {
		throw new Error("useAppStore must be used within AppStoreProvider");
	}

	return useZustandStore(appStoreContext, useShallow(selector));
};

// Parse the config from the profile
function parseConfig(config: string | null | undefined): AppConfig {
	if (!config) {
		console.log("using default config");

		return BASE_CONFIG;
	}

	try {
		const parsedConfig = JSON.parse(config);

		return mergeWithDefault(parsedConfig, BASE_CONFIG);
	} catch (error) {
		console.error(error);

		return BASE_CONFIG;
	}
}

// Parse the theme from the profile
function parseTheme(theme: string | null | undefined): SavedThemeSettings {
	if (!theme) {
		return {
			mode: "light",
			theme: {
				styles: defaultThemeState,
			},
		};
	}

	try {
		const parsedTheme = JSON.parse(theme);

		return parsedTheme as SavedThemeSettings;
	} catch (error) {
		console.error(error);

		return {
			mode: "light",
			theme: {
				styles: defaultThemeState,
			},
		};
	}
}
