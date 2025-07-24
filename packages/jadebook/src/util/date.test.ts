import { describe, it, expect } from "vitest";
import { getRelativeDay } from "./date";

describe("date", () => {
  describe("getRelativeDay", () => {
    it("should return 1 for the same date", () => {
      const date = new Date("2025-01-01");
      const result = getRelativeDay(date, date);
      expect(result).toBe(1);
    });

    it("should return 2 for the next day", () => {
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-01-02");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(2);
    });

    it("should return correct day number for multiple days apart", () => {
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-01-05");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(5);
    });

    it("should work across months", () => {
      const startDate = new Date("2025-01-30");
      const endDate = new Date("2025-02-02");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(4); // Jan 30 (day 1), Jan 31 (day 2), Feb 1 (day 3), Feb 2 (day 4)
    });

    it("should work across years", () => {
      const startDate = new Date("2024-12-30");
      const endDate = new Date("2025-01-02");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(4); // Dec 30 (day 1), Dec 31 (day 2), Jan 1 (day 3), Jan 2 (day 4)
    });

    it("should handle leap year correctly", () => {
      const startDate = new Date("2024-02-28"); // 2024 is a leap year
      const endDate = new Date("2024-03-01");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(3); // Feb 28 (day 1), Feb 29 (day 2), Mar 1 (day 3)
    });

    it("should handle non-leap year correctly", () => {
      const startDate = new Date("2023-02-28"); // 2023 is not a leap year
      const endDate = new Date("2023-03-01");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(2); // Feb 28 (day 1), Mar 1 (day 2)
    });

    it("should work with time included in dates", () => {
      const startDate = new Date("2025-01-01T10:30:00");
      const endDate = new Date("2025-01-01T23:59:59");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(1); // Same day regardless of time
    });

    it("should work with time crossing midnight", () => {
      const startDate = new Date("2025-01-01T23:30:00");
      const endDate = new Date("2025-01-02T01:30:00");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(2); // Different days
    });

    it("should handle negative time differences (end before start)", () => {
      const startDate = new Date("2025-01-05");
      const endDate = new Date("2025-01-01");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(-3); // 4 days before, so -4 + 1 = -3
    });

    it("should work with dates far apart", () => {
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-12-31");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(365); // 364 days apart + 1 = 365
    });

    it("should handle dates with different time zones consistently", () => {
      // Create dates with specific times to test consistency
      const startDate = new Date("2025-01-01T00:00:00Z");
      const endDate = new Date("2025-01-02T00:00:00Z");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(2);
    });

    it("should handle edge case with millisecond differences", () => {
      const startDate = new Date("2025-01-01T00:00:00.000Z");
      const endDate = new Date("2025-01-01T00:00:00.999Z");
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(1); // Same day
    });

    it("should handle DST transitions correctly", () => {
      // Test around daylight saving time transition
      const startDate = new Date("2025-03-08"); // Before DST in many regions
      const endDate = new Date("2025-03-10"); // After DST transition
      const result = getRelativeDay(startDate, endDate);
      expect(result).toBe(3); // Should still count as 3 days
    });

    it("should work with Date objects created in different ways", () => {
      const startDate1 = new Date(2025, 0, 1); // Month is 0-indexed
      const endDate1 = new Date(2025, 0, 3);
      const result1 = getRelativeDay(startDate1, endDate1);
      expect(result1).toBe(3);

      const startDate2 = new Date("January 1, 2025");
      const endDate2 = new Date("January 3, 2025");
      const result2 = getRelativeDay(startDate2, endDate2);
      expect(result2).toBe(3);
    });

    it("should handle large time differences efficiently", () => {
      const startDate = new Date("1970-01-01");
      const endDate = new Date("2025-01-01");
      const result = getRelativeDay(startDate, endDate);

      // Calculate expected result: days between 1970-01-01 and 2025-01-01
      const expectedDays =
        Math.floor(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      expect(result).toBe(expectedDays);
    });
  });
});
