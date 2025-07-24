import { describe, it, expect } from "vitest";
import { formatFileSize } from "./files";

describe("formatFileSize", () => {
  describe("bytes", () => {
    it("should format 0 bytes", () => {
      expect(formatFileSize(0)).toBe("0 B");
    });

    it("should format small byte values", () => {
      expect(formatFileSize(1)).toBe("1 B");
      expect(formatFileSize(512)).toBe("512 B");
      expect(formatFileSize(1023)).toBe("1023 B");
    });
  });

  describe("kilobytes", () => {
    it("should format exactly 1 KB", () => {
      expect(formatFileSize(1024)).toBe("1.0 KB");
    });

    it("should format KB values with decimals", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB");
      expect(formatFileSize(2048)).toBe("2.0 KB");
      expect(formatFileSize(1024 * 10.5)).toBe("10.5 KB");
    });

    it("should format KB boundary values", () => {
      expect(formatFileSize(1024 * 1024 - 1)).toBe("1024.0 KB");
    });
  });

  describe("megabytes", () => {
    it("should format exactly 1 MB", () => {
      expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
    });

    it("should format MB values with decimals", () => {
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe("1.5 MB");
      expect(formatFileSize(1024 * 1024 * 2)).toBe("2.0 MB");
      expect(formatFileSize(1024 * 1024 * 10.25)).toBe("10.3 MB");
    });

    it("should format MB boundary values", () => {
      expect(formatFileSize(1024 * 1024 * 1024 - 1)).toBe("1024.0 MB");
    });
  });

  describe("gigabytes", () => {
    it("should format exactly 1 GB", () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe("1.0 GB");
    });

    it("should format GB values with decimals", () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1.5)).toBe("1.5 GB");
      expect(formatFileSize(1024 * 1024 * 1024 * 2)).toBe("2.0 GB");
      expect(formatFileSize(1024 * 1024 * 1024 * 10.75)).toBe("10.8 GB");
    });

    it("should format large GB values", () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 100)).toBe("100.0 GB");
      expect(formatFileSize(1024 * 1024 * 1024 * 1000)).toBe("1000.0 GB");
    });
  });

  describe("edge cases", () => {
    it("should handle decimal precision correctly", () => {
      // Test that decimals are rounded to 1 decimal place
      expect(formatFileSize(1024 * 1.234)).toBe("1.2 KB");
      expect(formatFileSize(1024 * 1024 * 1.999)).toBe("2.0 MB");
      expect(formatFileSize(1024 * 1024 * 1024 * 1.111)).toBe("1.1 GB");
    });

    it("should handle very large numbers", () => {
      expect(formatFileSize(Number.MAX_SAFE_INTEGER)).toMatch(/\d+\.\d+ GB/);
    });
  });
});
