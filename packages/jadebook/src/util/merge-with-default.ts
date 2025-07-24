/**
 * Merge a current object with a default object.
 * The result will have all keys from the default object, with values from current where they exist,
 * plus any additional keys from current that don't exist in default.
 *
 * @param current - The current object (may be incomplete or have additional keys).
 * @param defaultObj - The default object (provides the base structure and fallback values).
 * @returns The merged object with proper typing.
 *
 * @example
 * ```tsx
 * const current = { text: "hello", count: 9 };
 * const defaultObj = { text: "tomorrow", amount: 80 };
 * const merged = mergeWithDefault(current, defaultObj);
 * // Result: { text: "hello", count: 9, amount: 80 }
 * ```
 */
export function mergeWithDefault<
  TDefault extends Record<string, unknown>,
  TCurrent extends Record<string, unknown>,
>(
  current: TCurrent | null | undefined,
  defaultObj: TDefault
): TDefault & TCurrent {
  // If current is null/undefined or not an object, return default
  if (!current || typeof current !== "object" || Array.isArray(current)) {
    return { ...defaultObj } as TDefault & TCurrent;
  }

  try {
    const result = { ...defaultObj } as Record<string, unknown>;

    // Add/override with values from current
    for (const key in current) {
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        const currentValue = current[key];
        const defaultValue = result[key];

        // Handle nested objects recursively
        if (
          typeof defaultValue === "object" &&
          defaultValue !== null &&
          !Array.isArray(defaultValue) &&
          typeof currentValue === "object" &&
          currentValue !== null &&
          !Array.isArray(currentValue)
        ) {
          result[key] = mergeWithDefault(
            currentValue as Record<string, unknown>,
            defaultValue as Record<string, unknown>
          );
        } else if (currentValue !== undefined) {
          // Use current value if it's defined (including null, false, 0, empty string)
          result[key] = currentValue;
        }
        // If currentValue is undefined, keep the default value
      }
    }

    return result as TDefault & TCurrent;
  } catch (error) {
    // If anything goes wrong during merging, fallback to default
    console.warn("Failed to merge objects, falling back to default:", error);

    return { ...defaultObj } as TDefault & TCurrent;
  }
}
