/**
 * Ensure a link has a https protocol
 * @param link - The link to ensure has a https protocol
 * @returns The link with a https protocol
 */
export function ensureHttpsProtocol(link: string): string {
  // Check if the link starts with a protocol or is a hash URL
  if (/^https?:\/\//i.test(link) || /^#/.test(link)) {
    return link; // Link is valid as is
  }
  // Add the default protocol if no protocol is specified
  return `https://${link}`;
}
