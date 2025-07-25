"use client";

import equal from "fast-deep-equal";
import { isUserPro, mergeWithDefault } from "jadebook";
import React, { createContext, type ReactNode, useContext } from "react";
import { useStore as useZustandStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
	type getV1MiscPinnedResponse,
	type getV1ProfileResponse,
	type getV1TagsResponse,
	useGetV1MiscPinned,
	useGetV1Profile,
	useGetV1Tags,
} from "@/api-client";
import { defaultTheme } from "@/features/theme/presets";
import type { Subscription } from "@/lib/stripe/sync-stripe";
import { debugLog } from "@/lib/utils";
import { type AppState, createAppStore } from "@/stores/app-store";

type AppStore = ReturnType<typeof createAppStore>;

export const AppStoreContext = createContext<AppStore | null>(null);

interface AppStoreProviderProps {
	children: ReactNode;
	initialState: Pick<AppState, "session"> & {
		profile: getV1ProfileResponse;
		pinnedResources: getV1MiscPinnedResponse;
		tags: getV1TagsResponse;
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

	const profileQuery = useGetV1Profile(
		{
			onboarding: "true",
		},
		{
			query: {
				initialData: initialState.profile,
			},
			fetch: {
				headers: {
					Authorization: initialState.session.access_token,
				},
			},
		},
	);

	const pinnedResourcesQuery = useGetV1MiscPinned({
		query: {
			initialData: initialState.pinnedResources,
		},
		fetch: {
			headers: {
				Authorization: initialState.session.access_token,
			},
		},
	});

	const tagsQuery = useGetV1Tags({
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

	const profile =
		profileQuery.data.status === 200 ? profileQuery.data.data : null;
	const pinnedResources =
		pinnedResourcesQuery.data.status === 200
			? pinnedResourcesQuery.data.data
			: null;
	const tags = tagsQuery.data.status === 200 ? tagsQuery.data.data : null;

	if (!profile || !pinnedResources || !tags) {
		throw new Error("Failed to fetch profile, pinned resources, or tags");
	}

	debugLog(initialState);

	const subscription = profile.subscription
		? (JSON.parse(profile.subscription) as Subscription)
		: null;

	const theme = parseTheme(profile.theme);

	const isPro = (() => {
		if (!subscription) {
			return false;
		}

		return isUserPro(subscription.status);
	})();

	if (!storeRef.current) {
		storeRef.current = createAppStore({
			profile,
			pinnedResources,
			tags,
			isPro,
			subscription,
			theme,
			session: initialState.session,
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
			currentState.isPro !== isPro ||
			!equal(currentState.subscription, subscription) ||
			!equal(currentState.theme, theme);

		if (hasChanged) {
			storeRef.current.setState({
				profile,
				pinnedResources,
				tags,
				isPro,
				subscription,
				theme,
			});
		}
	}, [profile, pinnedResources, tags, isPro, subscription, theme]);

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

export function parseTheme(theme: string | null | undefined) {
	if (!theme) {
		return defaultTheme;
	}

	try {
		const parsedTheme = JSON.parse(theme);

		return mergeWithDefault(parsedTheme, defaultTheme);
	} catch (error) {
		console.error(error);

		return defaultTheme;
	}
}
