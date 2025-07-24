import { defineConfig } from "rolldown";

export default defineConfig({
  input: {
    index: "src/index.ts",
    react: "src/react.ts",
  },
  output: [
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].mjs",
      chunkFileNames: "[name]-[hash].mjs",
    },
    {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].cjs",
      chunkFileNames: "[name]-[hash].cjs",
    },
  ],
  external: ["fast-deep-equal", "@phosphor-icons/react"],
  platform: "node",
});
