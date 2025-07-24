/**
 * Makes sure the content is in the correct format.
 * @param content - The content of the editor as a string.
 * @returns The parsed content.
 */
export function handleEditorContent(
  content: string | null | undefined
): JSON | string | undefined {
  return content
    ? content.startsWith(`{"type":"doc"`)
      ? JSON.parse(content)
      : content
    : undefined;
}
