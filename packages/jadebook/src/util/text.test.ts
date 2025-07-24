import { describe, expect, it } from "vitest";
import {
  capitalizeWords,
  calculateApproxWordCount,
  findFrequentWords,
} from "./text";

describe("text helpers", () => {
  describe("capitalizeWords", () => {
    it("should capitalize the first letter of each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
      expect(capitalizeWords("javascript is awesome")).toBe(
        "Javascript Is Awesome"
      );
      expect(capitalizeWords("single")).toBe("Single");
    });

    it("should handle empty strings", () => {
      expect(capitalizeWords("")).toBe("");
    });

    it("should handle strings with multiple spaces", () => {
      expect(capitalizeWords("hello  world")).toBe("Hello  World");
    });
  });

  describe("calculateApproxWordCount", () => {
    it("should calculate approximate word count with default avgCharsPerWord", () => {
      expect(calculateApproxWordCount(50)).toBe(10); // 50 / 5.0 = 10
      expect(calculateApproxWordCount(23)).toBe(5); // 23 / 5.0 = 4.6, rounded to 5
    });

    it("should calculate approximate word count with custom avgCharsPerWord", () => {
      expect(calculateApproxWordCount(40, 4)).toBe(10); // 40 / 4 = 10
      expect(calculateApproxWordCount(30, 6)).toBe(5); // 30 / 6 = 5
    });

    it("should handle zero character count", () => {
      expect(calculateApproxWordCount(0)).toBe(0);
    });
  });

  describe("findFrequentWords", () => {
    it("should find words that appear more than once and are longer than 4 characters", () => {
      const input = "hello world hello testing world programming testing hello";
      const result = findFrequentWords(input);

      expect(result).toContain("hello");
      expect(result).toContain("world");
      expect(result).toContain("testing");
      expect(result).not.toContain("programming"); // appears only once
    });

    it("should filter out short words even if frequent", () => {
      const input = "the cat and the dog and the bird";
      const result = findFrequentWords(input);

      expect(result).not.toContain("the"); // short word
      expect(result).not.toContain("and"); // short word
      expect(result).not.toContain("cat"); // short word
    });

    it("should handle empty input", () => {
      expect(findFrequentWords("")).toEqual([]);
    });

    it("should handle input with no frequent words", () => {
      const input = "unique words every single time different";
      const result = findFrequentWords(input);

      expect(result).toEqual([]);
    });

    it("should be case insensitive", () => {
      const input = "Hello world HELLO testing World TESTING hello";
      const result = findFrequentWords(input);

      expect(result).toContain("hello");
      expect(result).toContain("world");
      expect(result).toContain("testing");
    });
  });
});
