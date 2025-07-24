# Jadebook Package Usage

This package provides utility functions with full TypeScript support for your Jadebook applications.

## Infrastructure

We use Rolldown as the bundler, Vitest for the tests, and a special package `dts-bundle-generator` that generates the correct typescript for autocomplete in code editors.

## Installation

In your app's `package.json`:
```json
{
  "dependencies": {
    "jadebook": "workspace:*"
  }
}
```

## Usage Examples

### Text Utilities with Type Safety

```typescript
import { 
  capitalizeWords, 
  calculateApproxWordCount, 
  findFrequentWords,
  getWordFrequency,
  type WordFrequency 
} from "jadebook";

// Capitalize words
const title = capitalizeWords("hello world"); // "Hello World"

// Calculate word count
const wordCount = calculateApproxWordCount(500); // ~100 words

// Get word frequency analysis with full type safety
const frequencies: WordFrequency[] = getWordFrequency(
  "This is a sample text with some repeated words. This text is for testing.",
  3, // minimum word length
  2  // minimum count
);
// Returns: [{ word: "this", count: 2 }, { word: "text", count: 2 }]
```

### Color Utilities with Type Safety

```typescript
import { 
  hslToHex, 
  hexToHsl, 
  TAILWIND_COLORS_ARRAY,
  type HexColor, 
  type HslColor,
  type TailwindColor 
} from "jadebook";

// Convert colors with type safety
const hexColor: HexColor = hslToHex("hsl(120, 50%, 50%)");
const hslColor: HslColor = hexToHsl("#ff0000");

// Use Tailwind colors with autocomplete
const tailwindColor: TailwindColor = "emerald"; // Full autocomplete!
const isValidColor = TAILWIND_COLORS_ARRAY.includes(tailwindColor);
```

### Object Utilities with Generics

```typescript
import { 
  mergeWithDefault, 
  getObjectChanges,
  type ObjectChanges,
  type DeepPartial 
} from "jadebook";

// Merge with default values - fully typed
interface UserConfig {
  theme: string;
  notifications: boolean;
  language: string;
}

const defaultConfig: UserConfig = {
  theme: "light",
  notifications: true,
  language: "en"
};

const userConfig: DeepPartial<UserConfig> = {
  theme: "dark"
};

// Full type safety and autocomplete
const finalConfig = mergeWithDefault(userConfig, defaultConfig);
// Type: UserConfig & DeepPartial<UserConfig>

// Detect changes between objects
const changes: ObjectChanges<UserConfig> = getObjectChanges(
  { theme: "light", notifications: true, language: "en" },
  { theme: "dark", notifications: true, language: "en" }
);
// Returns: { theme: "dark" } | null
```

### Encryption with Type Safety

```typescript
import { 
  encrypt, 
  decrypt, 
  type EncryptionResult 
} from "jadebook";

// Encrypt data
const result: EncryptionResult = encrypt("sensitive data", "secret-key");
// Type: { encrypted: string; iv: string }

// Decrypt data
const decrypted: string = decrypt(result.encrypted, "secret-key", result.iv);
```

### File and Date Utilities

```typescript
import { 
  formatFileSize, 
  getRelativeDay,
  type FileSize,
  type RelativeDay 
} from "jadebook";

// Format file sizes
const size: FileSize = formatFileSize(1024 * 1024); // { bytes: 1048576, formatted: "1.00 MB" }

// Get relative day strings
const day: RelativeDay = getRelativeDay(new Date()); // "today"
```

## Key Benefits

1. **Full Type Safety**: All functions have proper TypeScript types
2. **Autocomplete**: Your IDE will provide intelligent autocomplete
3. **Compile-time Checks**: Catch errors before runtime
4. **Generic Support**: Functions work with your custom types
5. **Utility Types**: Access to helpful types like `DeepPartial`, `NonNullable`, etc.

## Available Types

- `HexColor` - Template literal type for hex colors
- `HslColor` - Template literal type for HSL colors  
- `TailwindColor` - Union type of all Tailwind color names
- `WordFrequency` - Object type for word frequency analysis
- `EncryptionResult` - Type for encryption results
- `ObjectChanges<T>` - Type for object change detection
- `DeepPartial<T>` - Make all properties optional recursively
- `RelativeDay` - Union type for relative day strings
- `FileSize` - Object type for file size information 