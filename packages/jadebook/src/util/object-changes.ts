import equal from "fast-deep-equal";

/**
 * Get the differences between two objects
 * @param obj1 - The first object
 * @param obj2 - The second object
 * @returns The differences between the two objects
 */
export function getObjectChanges<T>(obj1: T, obj2: T): Partial<T> | null {
  const differences: Partial<T> = {};

  if (typeof obj1 !== typeof obj2) {
    console.error("Objects are of different types");

    return null;
  }

  // If one of the objects is null, return null
  if (!obj1 || !obj2) {
    return null;
  }

  Object.keys(obj1).forEach((key) => {
    const typedKey = key as keyof T;

    if (!equal(obj1[typedKey], obj2[typedKey])) {
      differences[typedKey] = obj2[typedKey];
    }
  });

  if (Object.keys(differences).length === 0) {
    return null;
  }

  return differences;
}
