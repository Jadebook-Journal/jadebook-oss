import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateCssVariable } from "./css";

describe("css", () => {
  describe("updateCssVariable", () => {
    let mockDocumentElement: {
      style: {
        setProperty: ReturnType<typeof vi.fn>;
      };
    };

    beforeEach(() => {
      // Reset mocks
      vi.clearAllMocks();

      // Mock document.documentElement
      mockDocumentElement = {
        style: {
          setProperty: vi.fn(),
        },
      };

      // Mock the global document object
      Object.defineProperty(global, "document", {
        value: {
          documentElement: mockDocumentElement,
        },
        writable: true,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should update CSS variable with HSL color", () => {
      updateCssVariable("--primary-color", "hsl(210, 100%, 50%)");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--primary-color",
        "hsl(210, 100%, 50%)"
      );
    });

    it("should update CSS variable with RGB color", () => {
      updateCssVariable("--secondary-color", "rgb(255, 0, 0)");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--secondary-color",
        "rgb(255, 0, 0)"
      );
    });

    it("should update CSS variable with hex color", () => {
      updateCssVariable("--accent-color", "#ff0000");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--accent-color",
        "#ff0000"
      );
    });

    it("should update CSS variable with named color", () => {
      updateCssVariable("--text-color", "red");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--text-color",
        "red"
      );
    });

    it("should update CSS variable with pixel values", () => {
      updateCssVariable("--font-size", "16px");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--font-size",
        "16px"
      );
    });

    it("should update CSS variable with rem values", () => {
      updateCssVariable("--spacing", "1.5rem");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--spacing",
        "1.5rem"
      );
    });

    it("should update CSS variable with percentage values", () => {
      updateCssVariable("--width", "100%");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--width",
        "100%"
      );
    });

    it("should update CSS variable with string values", () => {
      updateCssVariable("--font-family", "Arial, sans-serif");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--font-family",
        "Arial, sans-serif"
      );
    });

    it("should update CSS variable with complex values", () => {
      updateCssVariable("--box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--box-shadow",
        "0 4px 6px rgba(0, 0, 0, 0.1)"
      );
    });

    it("should handle empty string values", () => {
      updateCssVariable("--empty-value", "");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--empty-value",
        ""
      );
    });

    it("should handle values with whitespace", () => {
      updateCssVariable("--spaced-value", "  value with spaces  ");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--spaced-value",
        "  value with spaces  "
      );
    });

    it("should handle multiple consecutive calls", () => {
      updateCssVariable("--color-1", "#ff0000");
      updateCssVariable("--color-2", "blue");
      updateCssVariable("--size", "20px");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledTimes(3);
      expect(mockDocumentElement.style.setProperty).toHaveBeenNthCalledWith(
        1,
        "--color-1",
        "#ff0000"
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenNthCalledWith(
        2,
        "--color-2",
        "blue"
      );
      expect(mockDocumentElement.style.setProperty).toHaveBeenNthCalledWith(
        3,
        "--size",
        "20px"
      );
    });

    it("should handle CSS calc() function", () => {
      updateCssVariable("--calculated-width", "calc(100% - 20px)");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--calculated-width",
        "calc(100% - 20px)"
      );
    });

    it("should handle CSS var() function", () => {
      updateCssVariable("--inherited-color", "var(--primary-color)");

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--inherited-color",
        "var(--primary-color)"
      );
    });
  });
});
