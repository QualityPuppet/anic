import { defineConfig } from "oxlint";

export default defineConfig({
    plugins: ["eslint", "typescript", "unicorn", "oxc", "vue"],
    env: {
        browser: true
    },
    globals: {
        foo: "readonly"
    },
    settings: {},
    categories: {
        correctness: "error",
        suspicious: "warn",
        perf: "warn",
        pedantic: "allow"
    },
    rules: {
        "eqeqeq": "warn",
        "import/no-cycle": "error"
    }
    //   overrides: [
    //     {
    //       files: ["*.test.ts", "*.spec.ts"],
    //       rules: {
    //         "@typescript-eslint/no-explicit-any": "off",
    //       },
    //     },
    //  ],
});
