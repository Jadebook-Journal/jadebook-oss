import { describe, it, expect, vi } from "vitest";
import { mergeWithDefault } from "./merge-with-default";

describe("mergeWithDefault", () => {
  describe("basic functionality", () => {
    it("should merge simple objects correctly", () => {
      const current = { text: "hello", count: 9 };
      const defaultObj = { text: "tomorrow", amount: 80 };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        text: "hello", // from current
        count: 9, // from current (additional key)
        amount: 80, // from default
      });
    });

    it("should preserve all default keys", () => {
      const current = { name: "test" };
      const defaultObj = { name: "default", age: 25, active: true };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        name: "test", // overridden
        age: 25, // from default
        active: true, // from default
      });
    });

    it("should add additional keys from current", () => {
      const current = { extra: "value", bonus: 100 };
      const defaultObj = { base: "default" };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        base: "default", // from default
        extra: "value", // from current
        bonus: 100, // from current
      });
    });
  });

  describe("null and undefined handling", () => {
    it("should return default when current is null", () => {
      const defaultObj = { text: "default", count: 5 };
      const result = mergeWithDefault(null, defaultObj);

      expect(result).toEqual(defaultObj);
    });

    it("should return default when current is undefined", () => {
      const defaultObj = { text: "default", count: 5 };
      const result = mergeWithDefault(undefined, defaultObj);

      expect(result).toEqual(defaultObj);
    });

    it("should handle undefined values in current object", () => {
      const current = { text: "hello", count: undefined, extra: "value" };
      const defaultObj = { text: "default", count: 10 };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        text: "hello", // from current
        count: 10, // from default (current was undefined)
        extra: "value", // from current
      });
    });

    it("should preserve falsy values that are not undefined", () => {
      const current = {
        text: "",
        count: 0,
        active: false,
        value: null,
      };
      const defaultObj = {
        text: "default",
        count: 10,
        active: true,
        value: "default",
      };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        text: "", // preserved falsy value
        count: 0, // preserved falsy value
        active: false, // preserved falsy value
        value: null, // preserved falsy value
      });
    });
  });

  describe("nested object handling", () => {
    it("should merge nested objects recursively", () => {
      const current = {
        user: {
          name: "John",
          preferences: {
            theme: "dark",
          },
        },
      };
      const defaultObj = {
        user: {
          name: "Default",
          age: 25,
          preferences: {
            theme: "light",
            notifications: true,
          },
        },
      };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        user: {
          name: "John", // from current
          age: 25, // from default
          preferences: {
            theme: "dark", // from current
            notifications: true, // from default
          },
        },
      });
    });

    it("should handle deeply nested objects", () => {
      const current = {
        level1: {
          level2: {
            level3: {
              value: "deep",
            },
          },
        },
      };
      const defaultObj = {
        level1: {
          level2: {
            level3: {
              value: "default",
              other: "default",
            },
            other2: "default",
          },
          other3: "default",
        },
      };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        level1: {
          level2: {
            level3: {
              value: "deep", // from current
              other: "default", // from default
            },
            other2: "default", // from default
          },
          other3: "default", // from default
        },
      });
    });

    it("should not merge arrays recursively", () => {
      const current = {
        items: [1, 2],
        nested: {
          array: ["a"],
        },
      };
      const defaultObj = {
        items: [3, 4, 5],
        nested: {
          array: ["b", "c"],
          other: "value",
        },
      };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        items: [1, 2], // replaced, not merged
        nested: {
          array: ["a"], // replaced, not merged
          other: "value", // from default
        },
      });
    });
  });

  describe("edge cases", () => {
    it("should handle empty objects", () => {
      const current = {};
      const defaultObj = { text: "default", count: 5 };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual(defaultObj);
    });

    it("should handle when current is an array", () => {
      const current = [1, 2, 3] as unknown as Record<string, unknown>;
      const defaultObj = { text: "default", count: 5 };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual(defaultObj);
    });

    it("should handle when current is a primitive", () => {
      const current = "string" as unknown as Record<string, unknown>;
      const defaultObj = { text: "default", count: 5 };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual(defaultObj);
    });

    it("should handle when current has non-object values for object keys in default", () => {
      const current = {
        user: "string instead of object",
      };
      const defaultObj = {
        user: {
          name: "default",
          age: 25,
        },
      };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        user: "string instead of object", // current value is preserved
      });
    });
  });

  describe("error handling", () => {
    it("should fallback to default when an error occurs during merging", () => {
      // Mock console.warn to avoid noise in test output
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Create an object that will cause an error when accessed
      const problematicCurrent = {};
      Object.defineProperty(problematicCurrent, "problematicKey", {
        get() {
          throw new Error("Property access error");
        },
        enumerable: true,
        configurable: true,
      });

      const defaultObj = { text: "default", count: 5 };
      const result = mergeWithDefault(problematicCurrent, defaultObj);

      expect(result).toEqual(defaultObj);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to merge objects, falling back to default:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("type safety", () => {
    it("should maintain type information", () => {
      const current = { extraProp: "test" };
      const defaultObj = { baseProp: "default" };
      const result = mergeWithDefault(current, defaultObj);

      // TypeScript should infer the correct type
      expect(result.baseProp).toBe("default");
      expect(result.extraProp).toBe("test");
    });
  });

  describe("complex scenarios", () => {
    it("should handle mixed nested structures", () => {
      const current = {
        config: {
          api: {
            timeout: 5000,
          },
          features: ["feature1"],
          enabled: true,
        },
        metadata: {
          version: "1.0.0",
        },
      };
      const defaultObj = {
        config: {
          api: {
            timeout: 3000,
            retries: 3,
            baseUrl: "https://api.example.com",
          },
          features: [],
          enabled: false,
          debug: false,
        },
        metadata: {
          version: "0.0.1",
          author: "default",
        },
        theme: "light",
      };
      const result = mergeWithDefault(current, defaultObj);

      expect(result).toEqual({
        config: {
          api: {
            timeout: 5000, // from current
            retries: 3, // from default
            baseUrl: "https://api.example.com", // from default
          },
          features: ["feature1"], // from current (array replaced)
          enabled: true, // from current
          debug: false, // from default
        },
        metadata: {
          version: "1.0.0", // from current
          author: "default", // from default
        },
        theme: "light", // from default
      });
    });
  });
});
