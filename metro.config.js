const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Ensure that TypeScript extensions are included:
config.resolver.sourceExts = [
  ...new Set([...config.resolver.sourceExts, "ts", "tsx"])
];

module.exports = withNativeWind(config, { input: "./app/global.css" });
