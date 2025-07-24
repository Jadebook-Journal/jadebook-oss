/**
 * The array of tailwind colors.
 * @see https://tailwindcss.com/docs/customizing-colors#default-color-palette
 */
export const TAILWIND_COLORS_ARRAY = Object.freeze([
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "beige",
  "black",
] as const);

/**
 * Template-literal type representing a **valid** hex colour (always 6-digit).
 */
export type HexColor = `#${string}`;

/**
 * Template-literal type representing a standard `hsl(...)` string where the
 * hue is expressed in degrees and the saturation/lightness are expressed in
 * percent.
 */
export type HslColor = `hsl(${number}, ${number}%, ${number}%)`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const formatNumber = (value: number, fractionDigits = 1): string => {
  // Output integers without a decimal part to keep backwards-compatibility with
  // existing expectations in the test-suite.
  if (Math.abs(value - Math.round(value)) < Number.EPSILON) {
    return `${Math.round(value)}`;
  }

  // Otherwise keep up to `fractionDigits` digits, trimming insignificant zeros
  // **only** from the fractional part (if present).
  const fixed = value.toFixed(fractionDigits);
  if (!fixed.includes(".")) return fixed;

  return fixed.replace(/0+$/, "").replace(/\.$/, "");
};

export function hslToHex(hslString: string): HexColor {
  const hslRegex =
    /^hsl\(\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)$/i;
  const match = hslString.match(hslRegex);

  if (!match) return "#000000";

  const hue = parseFloat(match[1]);
  const saturation = parseFloat(match[2]);
  const lightness = parseFloat(match[3]);

  if (
    hue < 0 ||
    hue >= 360 ||
    saturation < 0 ||
    saturation > 100 ||
    lightness < 0 ||
    lightness > 100
  ) {
    return "#000000";
  }

  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // Achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number): string => {
    const value = Math.round(clamp(x, 0, 1) * 255);
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToHsl(inputHex: string): HslColor {
  let hex = inputHex.trim();

  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }

  // Allow short 3-digit hex by expanding e.g. "f80" → "ff8800"
  if (hex.length === 3 && /^[0-9A-Fa-f]{3}$/.test(hex)) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return "hsl(0, 0%, 0%)";
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60; // Convert to degrees
  }

  const hFormatted = formatNumber(clamp(h, 0, 360), 1);
  const sFormatted = formatNumber(clamp(s * 100, 0, 100), 0);
  const lFormatted = formatNumber(clamp(l * 100, 0, 100), 0);

  return `hsl(${hFormatted}, ${sFormatted}%, ${lFormatted}%)` as HslColor;
}
