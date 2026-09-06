import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        changed: false,
        include: ["**/*spec*"]
    }
});
