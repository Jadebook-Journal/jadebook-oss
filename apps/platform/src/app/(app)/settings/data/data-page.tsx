"use client";

import { Coolshape } from "coolshapes-react";
import React from "react";
import { EmptyContent } from "@/components/app/empty-content";
import { PageSection } from "@/components/app/page";
import { PageContainer } from "@/components/app/page-container";

export function DataPage() {
	return (
		<PageContainer title="Data">
			<PageSection title="Import">
				<EmptyContent
					icon={<Coolshape type="polygon" index={4} noise={true} size={100} />}
					title="Coming soon"
					description="We're working on it. Stay tuned!"
				/>
			</PageSection>
		</PageContainer>
	);
}
