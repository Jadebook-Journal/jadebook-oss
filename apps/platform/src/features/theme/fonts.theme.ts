// Type Imports
import type { ThemeStyleProps } from "@/types/theme";

const sansSerifFontNames = [
	"Arial",
	"Helvetica",
	"Verdana",
	"Inter",
	"Roboto",
	"Open Sans",
	"Geist",
	"Montserrat",
	"Noto Sans",
	"Nunito Sans",
] as const;

const serifFontNames = ["Times New Roman", "Georgia"] as const;

const monoFontNames = ["Courier New", "Monaco", "Geist Mono"] as const;

type FontName =
	| (typeof monoFontNames)[number]
	| (typeof serifFontNames)[number]
	| (typeof sansSerifFontNames)[number];

export const fonts: Record<FontName, string> = {
	// Browser-based sans-serif fonts
	Arial: "Arial, sans-serif",
	Helvetica: "Helvetica, sans-serif",
	Verdana: "Verdana, sans-serif",

	// Specific sans-serif fonts
	Inter: "Inter, sans-serif",
	Roboto: "Roboto, sans-serif",
	"Open Sans": "Open Sans, sans-serif",
	Geist: "Geist, Geist Fallback, sans-serif",
	Montserrat: "Montserrat, sans-serif",
	"Noto Sans": "Noto Sans, sans-serif",
	"Nunito Sans": "Nunito Sans, sans-serif",

	// Browser-based serif fonts
	"Times New Roman": "Times New Roman, serif",
	Georgia: "Georgia, serif",

	// Browser-based monospace fonts
	"Courier New": "Courier New, monospace",
	Monaco: "Monaco, monospace",
	"Geist Mono": "Geist Mono, Geist Mono Fallback, monospace",
};

export const sansSerifFonts = Object.fromEntries(
	Object.entries(fonts).filter(([key]) =>
		sansSerifFontNames.includes(key as (typeof sansSerifFontNames)[number]),
	),
);

export const serifFonts = Object.fromEntries(
	Object.entries(fonts).filter(([key]) =>
		serifFontNames.includes(key as (typeof serifFontNames)[number]),
	),
);

export const monoFonts = Object.fromEntries(
	Object.entries(fonts).filter(([key]) =>
		monoFontNames.includes(key as (typeof monoFontNames)[number]),
	),
);

// we currently don't use serif or mono fonts so we let the user pick from all fonts
export const allFonts = Object.fromEntries(Object.entries(fonts));

export const getAppliedThemeFont = (
	state: Partial<ThemeStyleProps> | undefined,
	fontKey: keyof ThemeStyleProps,
): string | null => {
	if (!state) return null;
	const fontSans = state[fontKey];

	// find key of font in fonts object based on value
	const key = Object.keys(fonts).find((key) =>
		fonts[key as keyof typeof fonts].includes(fontSans as string),
	);

	return key ? key : null;
};
