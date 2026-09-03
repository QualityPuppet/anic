export default function getVersion(appVersion: string): string {
    const versionParts = appVersion.split(".") as string[];
    const major = Number(versionParts[0]!);
    const majorName = versionNames[major];

    if (majorName) {
        return `${majorName} - (${appVersion})`;
    }

    console.warn("we've run out of version names!");
    return appVersion;
}

const versionNames = [
    "beta",
    "release",
    "Rimuru",
    "Maomao",
    "Tanya",
    "Izutsumi",
    "Bocchi"
];
