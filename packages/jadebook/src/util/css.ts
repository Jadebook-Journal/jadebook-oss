/**
 * Update a CSS variable in the document's root element.
 * @param property - The property to update.
 * @param variable - The variable to update.
 * @example
 * ```tsx
 * updateCssVariable("--primary-color", "hsl(210, 100%, 50%)");
 * ```
 */
export function updateCssVariable(property: string, variable: string): void {
  const root = document.documentElement;

  root.style.setProperty(property, variable);
}
