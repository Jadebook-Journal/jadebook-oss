import { describe, it, expect } from "vitest";
import { TAILWIND_COLORS_ARRAY, hslToHex, hexToHsl } from "./colors";

describe("colors", () => {
  describe("TAILWIND_COLORS_ARRAY", () => {
    it("should contain expected tailwind colors", () => {
      expect(TAILWIND_COLORS_ARRAY).toContain("slate");
      expect(TAILWIND_COLORS_ARRAY).toContain("gray");
      expect(TAILWIND_COLORS_ARRAY).toContain("red");
      expect(TAILWIND_COLORS_ARRAY).toContain("blue");
      expect(TAILWIND_COLORS_ARRAY).toContain("green");
    });

    it("should have the correct length", () => {
      expect(TAILWIND_COLORS_ARRAY).toHaveLength(24);
    });

    it("should be readonly", () => {
      expect(() => {
        // @ts-expect-error - testing readonly nature
        TAILWIND_COLORS_ARRAY.push("new-color");
      }).toThrow();
    });
  });

  describe("hslToHex", () => {
    it("should convert basic HSL values to hex", () => {
      expect(hslToHex("hsl(0, 100%, 50%)")).toBe("#ff0000"); // Red
      expect(hslToHex("hsl(120, 100%, 50%)")).toBe("#00ff00"); // Green
      expect(hslToHex("hsl(240, 100%, 50%)")).toBe("#0000ff"); // Blue
    });

    it("should handle white and black", () => {
      expect(hslToHex("hsl(0, 0%, 100%)")).toBe("#ffffff"); // White
      expect(hslToHex("hsl(0, 0%, 0%)")).toBe("#000000"); // Black
    });

    it("should handle gray values", () => {
      expect(hslToHex("hsl(0, 0%, 50%)")).toBe("#808080"); // Gray
    });

    it("should handle decimal values", () => {
      expect(hslToHex("hsl(210, 50.5%, 25.5%)")).toBeDefined();
    });

    it("should handle edge cases with whitespace", () => {
      expect(hslToHex("hsl( 0 , 100% , 50% )")).toBe("#ff0000");
    });

    it("should return black for invalid HSL strings", () => {
      expect(hslToHex("invalid")).toBe("#000000");
      expect(hslToHex("hsl()")).toBe("#000000");
      expect(hslToHex("hsl(400, 100%, 50%)")).toBe("#000000");
      expect(hslToHex("")).toBe("#000000");
    });

    it("should handle saturation of 0", () => {
      expect(hslToHex("hsl(120, 0%, 50%)")).toBe("#808080");
    });
  });

  describe("hexToHsl", () => {
    it("should convert basic hex values to HSL", () => {
      expect(hexToHsl("#ff0000")).toBe("hsl(0, 100%, 50%)"); // Red
      expect(hexToHsl("#00ff00")).toBe("hsl(120, 100%, 50%)"); // Green
      expect(hexToHsl("#0000ff")).toBe("hsl(240, 100%, 50%)"); // Blue
    });

    it("should handle hex with and without hash", () => {
      expect(hexToHsl("#ff0000")).toBe("hsl(0, 100%, 50%)");
      expect(hexToHsl("ff0000")).toBe("hsl(0, 100%, 50%)");
    });

    it("should handle white and black", () => {
      expect(hexToHsl("#ffffff")).toBe("hsl(0, 0%, 100%)"); // White
      expect(hexToHsl("#000000")).toBe("hsl(0, 0%, 0%)"); // Black
    });

    it("should handle gray values", () => {
      expect(hexToHsl("#808080")).toBe("hsl(0, 0%, 50%)"); // Gray
    });

    it("should handle uppercase hex", () => {
      expect(hexToHsl("#FF0000")).toBe("hsl(0, 100%, 50%)");
      expect(hexToHsl("FF0000")).toBe("hsl(0, 100%, 50%)");
    });

    it("should round values correctly", () => {
      const result = hexToHsl("#123456");
      expect(result).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
    });
  });

  describe("round-trip conversions", () => {
    it("should maintain consistency in round-trip conversions", () => {
      const originalHex = "#ff5733";
      const hsl = hexToHsl(originalHex);
      const backToHex = hslToHex(hsl);

      // Due to rounding, we might have slight differences, so we check if they're close
      expect(backToHex.toLowerCase()).toBe(originalHex.toLowerCase());
    });

    it("should handle round-trip for common colors", () => {
      const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#000000"];

      colors.forEach((color) => {
        const hsl = hexToHsl(color);
        const backToHex = hslToHex(hsl);
        expect(backToHex.toLowerCase()).toBe(color.toLowerCase());
      });
    });
  });
});
