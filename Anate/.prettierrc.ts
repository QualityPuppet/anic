import type { Config } from "prettier";

const config: Config = {
    tabWidth: 4,
    printWidth: 80,
    useTabs: false,
    semi: true,
    singleQuote: false,
    quoteProps: "consistent",
    trailingComma: "none",
    bracketSameLine: false,
    checkIgnorePragma: true,
    vueIndentScriptAndStyle: true
};

export default config;
