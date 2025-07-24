// Utility type to remove undefined from property types
type NonUndefined<T> = {
  [K in keyof T]: Exclude<T[K], undefined>;
};

// Overload for when no key mapping is used - returns the same type with undefined removed
export function buildObject<T extends Record<string, unknown>>(
  input: T
): Partial<NonUndefined<T>>;

// Overload for when key mapping is used - returns the mapped type
export function buildObject<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(input: T, keyMapping: Partial<Record<keyof T, keyof U>>): Partial<U>;

/**
 * Builds an object from input data, excluding undefined values
 * Supports optional key mapping for transforming field names
 *
 * @example
 * ```tsx
 * const input = {
 *   name: "John",
 *   age: 30,
 * };
 *
 * const result = buildObject(input);
 *
 * // result will be { name: "John", age: 30 }
 *
 * @example key mapping
 * ```tsx
 * const input = {
 *   name: "John",
 *   age: 30,
 * };
 *
 * const result = buildObject(input, {
 *   name: "first_name",
 *   age: "age",
 * });
 *
 * // result will be { first_name: "John", age: 30 }
 */
export function buildObject<
  T extends Record<string, unknown>,
  U extends Record<string, unknown> = NonUndefined<T>,
>(input: T, keyMapping?: Partial<Record<keyof T, keyof U>>): Partial<U> {
  const result: Partial<U> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      const outputKey = keyMapping?.[key as keyof T] ?? key;
      result[outputKey as keyof U] = value as U[keyof U];
    }
  }

  return result;
}
