export const COVER_CONFIG = {
	solid: {
		slate: "bg-slate-500",
		gray: "bg-gray-500",
		zinc: "bg-zinc-500",
		neutral: "bg-neutral-500",
		stone: "bg-stone-500",
		red: "bg-red-500",
		orange: "bg-orange-500",
		amber: "bg-amber-500",
		yellow: "bg-yellow-500",
		lime: "bg-lime-500",
		green: "bg-green-500",
		emerald: "bg-emerald-500",
		teal: "bg-teal-500",
		cyan: "bg-cyan-500",
		sky: "bg-sky-500",
		blue: "bg-blue-500",
		indigo: "bg-indigo-500",
		violet: "bg-violet-500",
		purple: "bg-purple-500",
		fuchsia: "bg-fuchsia-500",
		pink: "bg-pink-500",
		rose: "bg-rose-500",
		beige: "bg-[#FFEEE3]",
		black: "bg-black",
	},
	gradient: {
		1: "bg-linear-to-r from-slate-900 to-slate-700",
		2: "bg-linear-to-r from-yellow-600 to-red-600",
		3: "bg-linear-to-r from-blue-300 to-blue-800",
		4: "bg-linear-to-r from-violet-200 to-pink-200",
		5: "bg-linear-to-r from-green-300 to-yellow-300",
		6: "bg-linear-to-tl from-teal-300 to-cyan-600",
		7: "bg-linear-to-r from-neutral-300 to-stone-400",
		8: "bg-linear-to-r from-blue-300 to-purple-500",
		9: "bg-linear-to-tr from-violet-500 to-orange-300",
		10: "bg-linear-to-r from-rose-100 to-teal-100",
		11: "bg-linear-to-r from-green-200 to-blue-500",
		12: "bg-linear-to-r from-teal-200 to-lime-200",
	},
} as const;

// cover is in a special format `type:value`

export type CoverType = "color" | "unsplash" | "url" | "gradient";

export type CoverProps = {
	type: CoverType;
	value: string;
};

/**
 * Generate a cover string from a cover props
 * @param type - The type of cover. Can be `color`, `url`, or `gradient`
 * @param value - The value of the cover. For `color`, it's the color name. For `url`, it's the url. For `gradient`, it's the gradient name.
 * @returns The cover string
 */
export function generateCover({ type, value }: CoverProps) {
	return `${type}:${value}`;
}

/**
 * Parse a cover string into a cover props
 * @param cover - The cover string
 * @returns The cover props
 */
export function getCoverProps(cover: string): null | CoverProps {
	const [type, value] = cover.split(/:(.+)/);

	const avaiable_types: CoverType[] = ["color", "url", "gradient"];

	if (
		typeof value !== "string" ||
		value === "" ||
		!avaiable_types.includes(type as CoverType)
	) {
		return null;
	}

	if (type === "color") {
		const color = COVER_CONFIG.solid[value as keyof typeof COVER_CONFIG.solid];

		return { type, value: color };
	}

	if (type === "gradient") {
		const key = Number.parseInt(value) as keyof typeof COVER_CONFIG.gradient;
		const gradient = COVER_CONFIG.gradient[key];

		return { type, value: gradient };
	}

	return { type, value } as CoverProps;
}

/**
 * Parse a cover string into the required style and class for rendering
 * @param rawCover - The cover string
 * @returns The cover props
 */
export function parseCover(rawCover: string) {
	const cover = getCoverProps(rawCover);

	if (!cover) {
		return null;
	}

	const className = (() => {
		switch (cover.type) {
			case "color":
			case "gradient":
				return cover.value;

			case "url":
				return "bg-cover bg-center bg-no-repeat";
		}
	})();

	return {
		style: cover.type === "url" ? `url(${cover.value})` : undefined,
		class: className,
	};
}
