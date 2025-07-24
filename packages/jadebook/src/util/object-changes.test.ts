import { describe, it, expect, vi } from "vitest";
import { getObjectChanges } from "./object-changes";

describe("getObjectChanges", () => {
  it("should return differences between two objects", () => {
    const obj1 = { name: "John", age: 25, city: "New York" };
    const obj2 = { name: "John", age: 30, city: "Boston" };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toEqual({
      age: 30,
      city: "Boston",
    });
  });

  it("should return null when objects are identical", () => {
    const obj1 = { name: "John", age: 25, city: "New York" };
    const obj2 = { name: "John", age: 25, city: "New York" };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toBeNull();
  });

  it("should return null when first object is null", () => {
    const obj1 = null;
    const obj2 = { name: "John", age: 25 };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toBeNull();
  });

  it("should return null when second object is null", () => {
    const obj1 = { name: "John", age: 25 };
    const obj2 = null;

    const result = getObjectChanges(obj1, obj2);

    expect(result).toBeNull();
  });

  it("should return null when both objects are null", () => {
    const obj1 = null;
    const obj2 = null;

    const result = getObjectChanges(obj1, obj2);

    expect(result).toBeNull();
  });

  it("should return null when objects are of different types and log error", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const obj1 = { name: "John" };

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const obj2 = "string" as any; // Using any to test type mismatch

    const result = getObjectChanges(obj1, obj2);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith("Objects are of different types");

    consoleSpy.mockRestore();
  });

  it("should handle nested objects correctly", () => {
    const obj1 = {
      name: "John",
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
      },
      hobbies: ["reading", "swimming"],
    };

    const obj2 = {
      name: "John",
      address: {
        street: "456 Oak Ave",
        city: "New York",
        zipCode: "10001",
      },
      hobbies: ["reading", "running"],
    };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toEqual({
      address: {
        street: "456 Oak Ave",
        city: "New York",
        zipCode: "10001",
      },
      hobbies: ["reading", "running"],
    });
  });

  it("should handle arrays in objects", () => {
    const obj1 = { items: [1, 2, 3], name: "test" };
    const obj2 = { items: [1, 2, 4], name: "test" };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toEqual({
      items: [1, 2, 4],
    });
  });

  it("should handle empty objects", () => {
    const obj1 = {};
    const obj2 = {};

    const result = getObjectChanges(obj1, obj2);

    expect(result).toBeNull();
  });

  it("should handle objects with different keys", () => {
    const obj1 = { name: "John", age: 25 };
    const obj2 = { name: "John", age: 25, city: "New York" };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toBeNull(); // Since we only iterate over keys from obj1
  });

  it("should handle boolean values", () => {
    const obj1 = { isActive: true, isVerified: false };
    const obj2 = { isActive: false, isVerified: false };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toEqual({
      isActive: false,
    });
  });

  it("should handle undefined values", () => {
    const obj1: { name: string; age: number | undefined } = {
      name: "John",
      age: undefined,
    };
    const obj2: { name: string; age: number | undefined } = {
      name: "John",
      age: 25,
    };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toEqual({
      age: 25,
    });
  });

  it("should handle objects with Date values", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-01-02");

    const obj1 = { createdAt: date1, name: "John" };
    const obj2 = { createdAt: date2, name: "John" };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toEqual({
      createdAt: date2,
    });
  });

  it("should handle complex nested structures", () => {
    const obj1 = {
      user: {
        profile: {
          name: "John",
          settings: {
            theme: "dark",
            notifications: true,
          },
        },
        posts: [
          { id: 1, title: "First Post" },
          { id: 2, title: "Second Post" },
        ],
      },
    };

    const obj2 = {
      user: {
        profile: {
          name: "John",
          settings: {
            theme: "light",
            notifications: true,
          },
        },
        posts: [
          { id: 1, title: "First Post" },
          { id: 2, title: "Updated Second Post" },
        ],
      },
    };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toEqual({
      user: {
        profile: {
          name: "John",
          settings: {
            theme: "light",
            notifications: true,
          },
        },
        posts: [
          { id: 1, title: "First Post" },
          { id: 2, title: "Updated Second Post" },
        ],
      },
    });
  });

  it("should handle objects with function values", () => {
    const func1 = () => "hello";
    const func2 = () => "world";

    const obj1 = { name: "John", callback: func1 };
    const obj2 = { name: "John", callback: func2 };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toEqual({
      callback: func2,
    });
  });

  it("should handle objects with symbol values", () => {
    const symbol1 = Symbol("test1");
    const symbol2 = Symbol("test2");

    const obj1 = { name: "John", id: symbol1 };
    const obj2 = { name: "John", id: symbol2 };

    const result = getObjectChanges(obj1, obj2);

    expect(result).toEqual({
      id: symbol2,
    });
  });
});
