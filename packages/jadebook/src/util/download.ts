/**
 * Download a JSON file.
 * @param data - The data to download.
 * @param fileName - The name of the file to download.
 * @example
 * ```tsx
 * downloadJson({ name: "John", age: 30 }, "data.json");
 * ```
 */
export function downloadJson<T = Record<string, unknown>>(
  data: T,
  fileName: string = "data.json"
): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(url);
}
