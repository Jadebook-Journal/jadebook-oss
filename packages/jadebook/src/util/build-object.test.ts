import { describe, expect, it } from "vitest";
import { buildObject } from "./build-object";

describe("buildObject", () => {
  it("should build an object excluding undefined values", () => {
    const input = {
      name: "John",
      age: 30,
      email: undefined,
      active: true,
    };

    const result = buildObject(input);

    expect(result).toEqual({
      name: "John",
      age: 30,
      active: true,
    });
    expect(result).not.toHaveProperty("email");
  });

  it("should preserve null values", () => {
    const input = {
      name: "John",
      middleName: null,
      age: undefined,
    };

    const result = buildObject(input);

    expect(result).toEqual({
      name: "John",
      middleName: null,
    });
    expect(result).not.toHaveProperty("age");
  });

  it("should handle empty object", () => {
    const input = {};
    const result = buildObject(input);

    expect(result).toEqual({});
  });

  it("should handle object with all undefined values", () => {
    const input = {
      a: undefined,
      b: undefined,
      c: undefined,
    };

    const result = buildObject(input);

    expect(result).toEqual({});
  });

  it("should handle various data types", () => {
    const input = {
      string: "test",
      number: 42,
      boolean: false,
      array: [1, 2, 3],
      object: { nested: true },
      zero: 0,
      emptyString: "",
      undefinedValue: undefined,
    };

    const result = buildObject(input);

    expect(result).toEqual({
      string: "test",
      number: 42,
      boolean: false,
      array: [1, 2, 3],
      object: { nested: true },
      zero: 0,
      emptyString: "",
    });
    expect(result).not.toHaveProperty("undefinedValue");
  });

  describe("with key mapping", () => {
    it("should map keys according to the mapping object", () => {
      const input = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      const keyMapping = {
        firstName: "first_name" as const,
        lastName: "last_name" as const,
      };

      const result = buildObject(input, keyMapping);

      expect(result).toEqual({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com", // unchanged key
      });
    });

    it("should exclude undefined values even with key mapping", () => {
      const input = {
        firstName: "John",
        lastName: undefined,
        email: "john@example.com",
      };

      const keyMapping = {
        firstName: "first_name" as const,
        lastName: "last_name" as const,
      };

      const result = buildObject(input, keyMapping);

      expect(result).toEqual({
        first_name: "John",
        email: "john@example.com",
      });
      expect(result).not.toHaveProperty("last_name");
      expect(result).not.toHaveProperty("lastName");
    });

    it("should handle partial key mapping", () => {
      const input = {
        a: 1,
        b: 2,
        c: 3,
        d: undefined,
      };

      const keyMapping = {
        a: "alpha" as const,
        c: "gamma" as const,
      };

      const result = buildObject(input, keyMapping);

      expect(result).toEqual({
        alpha: 1,
        b: 2, // unmapped key stays the same
        gamma: 3,
      });
      expect(result).not.toHaveProperty("d");
    });

    it("should handle empty key mapping", () => {
      const input = {
        name: "test",
        value: 123,
        undefinedProp: undefined,
      };

      const result = buildObject(input, {});

      expect(result).toEqual({
        name: "test",
        value: 123,
      });
    });
  });

  describe("type safety", () => {
    it("should work with typed input and output", () => {
      interface UserInput extends Record<string, unknown> {
        firstName: string;
        lastName: string;
        age?: number;
        email?: string;
      }

      interface UserOutput extends Record<string, unknown> {
        first_name: string;
        last_name: string;
        age?: number;
        email?: string;
      }

      const input: UserInput = {
        firstName: "John",
        lastName: "Doe",
        age: undefined,
        email: "john@example.com",
      };

      const keyMapping: Partial<Record<keyof UserInput, keyof UserOutput>> = {
        firstName: "first_name",
        lastName: "last_name",
      };

      const result = buildObject<UserInput, UserOutput>(input, keyMapping);

      expect(result).toEqual({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
      });
      expect(result).not.toHaveProperty("age");
    });
  });
});
