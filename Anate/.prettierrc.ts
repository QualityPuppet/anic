import { type Config } from "prettier";

const config: Config = {
    tabWidth: 4,
    printWidth: 80,
    tabs: false,
    semicolons: true,
    quotes: true,
    quoteProps: consistent,
    trailingComma: "none",
    bracketSameLine = false,
    checkIgnorePragma: true,
    vueIndentScriptAndStyle: true
};

export default config;
