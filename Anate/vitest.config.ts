import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "testConfig",
        include: ["src/tests/**/*.spec.ts", "tests/**/*.spec.ts"],
        forceRerunTriggers: ["**/src/tests/*.spec.ts"],
        watch: true
    }
});
