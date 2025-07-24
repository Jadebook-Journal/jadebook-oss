// Utility types for the jadebook package
export type TailwindColor =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "beige"
  | "black";

export type FileSize = {
  bytes: number;
  formatted: string;
};

export type RelativeDay =
  | "today"
  | "yesterday"
  | "tomorrow"
  | `${number} days ago`
  | `in ${number} days`;

// Generic types for common patterns
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

// Encryption types
export type EncryptionResult = {
  encrypted: string;
  iv: string;
};

// Object change detection
export type ObjectChanges<T> = Partial<T> | null;

// Text analysis types
export type WordFrequency = {
  word: string;
  count: number;
};

export type TextAnalysis = {
  wordCount: number;
  frequentWords: WordFrequency[];
};
