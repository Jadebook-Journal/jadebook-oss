/**
 * Capitalize the first letter of each word in a string
 * @param string - The string to capitalize
 * @returns The capitalized string
 */
export function capitalizeWords(string: string) {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Calculates approximate word count from character count for English text
 * @param characterCount - The total character count (including spaces)
 * @param avgCharsPerWord - Average characters per word (default: 5.0 for English)
 * @returns Approximate word count as an integer
 */
export function calculateApproxWordCount(
  characterCount: number,
  avgCharsPerWord: number = 5.0
): number {
  return Math.round(characterCount / avgCharsPerWord);
}

/**
 * Find the most frequent words in a string
 * @param input - The string to find the most frequent words in
 * @returns The most frequent words in the string
 */
export function findFrequentWords(input: string): string[] {
  // Split the input string into words
  const words = input
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 0);

  // Create a map to store word frequencies
  const wordCount: { [key: string]: number } = {};

  // Count the occurrences of each word
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Filter words that appear more than 1 times and are longer than 4 characters
  const result = Object.keys(wordCount).filter(
    (word) => wordCount[word] > 1 && word.length > 4
  );

  return result;
}

/**
 * Get detailed word frequency analysis
 * @param input - The string to analyze
 * @param minLength - Minimum word length to include (default: 4)
 * @param minCount - Minimum occurrence count to include (default: 2)
 * @returns Array of word frequency objects sorted by count
 */
export function getWordFrequency(
  input: string,
  minLength: number = 4,
  minCount: number = 2
): { word: string; count: number }[] {
  // Split the input string into words
  const words = input
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length >= minLength);

  // Create a map to store word frequencies
  const wordCount: { [key: string]: number } = {};

  // Count the occurrences of each word
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Convert to array and filter by minimum count
  return Object.entries(wordCount)
    .filter(([, count]) => count >= minCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}
