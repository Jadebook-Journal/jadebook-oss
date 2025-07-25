export function PageHeading(props: {
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col @md:flex-row items-center justify-between gap-2">
			<div className="space-y-2">
				<h2 className="text-3xl font-semibold">{props.title}</h2>
				<p className="text-sm text-muted-foreground">{props.description}</p>
			</div>

			<div className="flex items-center gap-2 shrink-0">{props.actions}</div>
		</div>
	);
}

export function PageSection(props: {
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-3">
			<div className="flex flex-col @md:flex-row items-center justify-between md:gap-6 gap-3">
				<div className="space-y-0.5">
					<h2 className="font-semibold">{props.title}</h2>
					{props.description && (
						<p className="text-xs text-muted-foreground">{props.description}</p>
					)}
				</div>

				<div className="flex items-center gap-2 shrink-0">{props.actions}</div>
			</div>

			{props.children}
		</div>
	);
}
