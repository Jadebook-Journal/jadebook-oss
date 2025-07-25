const isMac =
	typeof window !== "undefined"
		? navigator.platform.toUpperCase().indexOf("MAC") >= 0
		: false;

export const ShortcutKey = ({
	children,
}: {
	children: string;
}): React.JSX.Element => {
	const className =
		"inline-flex items-center justify-center w-5 h-5 p-1 text-[0.625rem] rounded font-semibold leading-none border border-b-2";

	if (children === "Mod") {
		return <kbd className={className}>{isMac ? "⌘" : "Ctrl"}</kbd>; // ⌃
	}

	if (children === "Shift") {
		return <kbd className={className}>⇧</kbd>;
	}

	if (children === "Alt") {
		return <kbd className={className}>{isMac ? "⌥" : "Alt"}</kbd>;
	}

	return <kbd className={className}>{children}</kbd>;
};

export function Shortcut({ shortcut }: { shortcut: string[] }) {
	return (
		<span className="flex items-center gap-0.5">
			{shortcut.map((shortcutKey) => (
				<ShortcutKey key={shortcutKey}>{shortcutKey}</ShortcutKey>
			))}
		</span>
	);
}
