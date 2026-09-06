import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
    base: "/anic/",
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    define: {
        __APP_VERSION__: JSON.stringify(
            JSON.parse(readFileSync("./package.json", "utf-8")).version
        )
    },
    css: {
        preprocessorOptions: {
            scss: {
                //additionalData: `@use "~/styles/index.scss" as *;`,
            }
        }
    }
});
