"use client";

import { PageSection } from "@/components/app/page";
import { PageContainer } from "@/components/app/page-container";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { ConfigSaveButton } from "@/components/settings/settings-save-button";
import {
	Select,
	SelectItem,
	SelectLabel,
	SelectContent,
	SelectValue,
	SelectTrigger,
	SelectGroup,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/providers/app-store-provider";

export function ConfigPage() {
	return (
		<PageContainer title="Config" actions={<ConfigSaveButton />}>
			<SettingsFeatures />
			<SettingsGeneral />
			<SettingsSidebar />
		</PageContainer>
	);
}

function SettingsFeatures() {
	const { config, updateConfig } = useAppStore((state) => ({
		config: state.config,
		updateConfig: state.updateConfig,
	}));

	return (
		<PageSection
			title="Features"
			description="You can toggle on or off different features in the app. It won't remove them — instead it'll hide them from your UI."
		>
			<SettingsPanel>
				<SettingsPanelSection
					title="Search"
					description="Search your journal entries using semantic search."
				>
					<Switch
						checked={config.features.search}
						onCheckedChange={(value) => {
							updateConfig({
								...config,
								features: {
									...config.features,
									search: value,
								},
							});
						}}
					/>
				</SettingsPanelSection>

				<SettingsPanelSection
					title="Goals"
					description="Goals are a way to track your progress and stay motivated."
				>
					<Switch
						checked={config.features.goals}
						onCheckedChange={(value) => {
							updateConfig({
								...config,
								features: {
									...config.features,
									goals: value,
								},
							});
						}}
					/>
				</SettingsPanelSection>
			</SettingsPanel>
		</PageSection>
	);
}

function SettingsGeneral() {
	const { config, updateConfig } = useAppStore((state) => ({
		config: state.config,
		updateConfig: state.updateConfig,
	}));

	return (
		<PageSection title="General">
			<SettingsPanel>
				<SettingsPanelSection
					title="Layout"
					description="Will change how your entries are displayed."
				>
					<Select
						value={config.layout.journalLayout}
						onValueChange={(value) => {
							updateConfig({
								...config,
								layout: {
									...config.layout,
									journalLayout: value as "list" | "grid" | "monthly",
								},
							});
						}}
					>
						<SelectTrigger className="w-fit gap-x-2">
							<SelectValue placeholder="Select a layout" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Layout</SelectLabel>
								<SelectItem value="list">List</SelectItem>
								<SelectItem value="grid">Grid</SelectItem>
								<SelectItem value="monthly">Monthly</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</SettingsPanelSection>

				<SettingsPanelSection
					title="Grid Item Icons"
					description="Will show the icon of the entry in the grid view. Can be hidden for more simplicity."
				>
					<Switch
						checked={config.layout.showItemIcon}
						onCheckedChange={(checked) => {
							updateConfig({
								...config,
								layout: { ...config.layout, showItemIcon: checked },
							});
						}}
					/>
				</SettingsPanelSection>

				<SettingsPanelSection
					title="Sort date"
					description="Will change sort order for loading entries."
				>
					<Select
						value={config.layout.sortDate}
						onValueChange={(value) => {
							updateConfig({
								...config,
								layout: {
									...config.layout,
									sortDate: value as "created_at" | "updated_at" | "entry_date",
								},
							});
						}}
					>
						<SelectTrigger className="w-fit gap-x-2">
							<SelectValue placeholder="Select a sort date" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Sort date</SelectLabel>
								<SelectItem value="created_at">Created at</SelectItem>
								<SelectItem value="updated_at">Updated at</SelectItem>
								<SelectItem value="entry_date">Entry date</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</SettingsPanelSection>
			</SettingsPanel>
		</PageSection>
	);
}

function SettingsSidebar() {
	const { config, updateConfig } = useAppStore((state) => ({
		config: state.config,
		updateConfig: state.updateConfig,
	}));

	return (
		<PageSection title="Sidebar">
			<SettingsPanel>
				<SettingsPanelSection
					title="Sidebar Variant"
					description="Will change the way your app looks, including the UI container."
				>
					<Select
						value={config.layout.sidebarVariant}
						onValueChange={(value) => {
							updateConfig({
								...config,
								layout: {
									...config.layout,
									sidebarVariant: value as "default" | "floating" | "inset",
								},
							});
						}}
					>
						<SelectTrigger className="w-fit gap-x-2">
							<SelectValue placeholder="Select a variant" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Variant</SelectLabel>
								<SelectItem value="default">Default</SelectItem>
								<SelectItem value="floating">Floating</SelectItem>
								<SelectItem value="inset">Inset</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</SettingsPanelSection>

				<SettingsPanelSection
					title="Sidebar Hidden State"
					description="If the sidebar is offcanvas, hover your cursor near the edge to toggle it."
				>
					<Select
						value={config.layout.sidebarHiddenState}
						onValueChange={(value) => {
							updateConfig({
								...config,
								layout: {
									...config.layout,
									sidebarHiddenState: value as "offcanvas" | "icon" | "none",
								},
							});
						}}
					>
						<SelectTrigger className="w-fit gap-x-2">
							<SelectValue placeholder="Select a hidden state" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Hidden State</SelectLabel>
								<SelectItem value="offcanvas">Offcanvas</SelectItem>
								<SelectItem value="icon">Icon</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</SettingsPanelSection>

				<SettingsPanelSection
					title="Monochrome Icons"
					description="Will override the icon color of pinned items and tags to match the base color palette."
				>
					<Switch
						checked={config.layout.monochromeIcons}
						onCheckedChange={(checked) => {
							updateConfig({
								...config,
								layout: { ...config.layout, monochromeIcons: checked },
							});
						}}
					/>
				</SettingsPanelSection>
			</SettingsPanel>
		</PageSection>
	);
}
