const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

const config = getDefaultConfig(__dirname);

// Ensure that TypeScript extensions are included:
config.resolver.sourceExts = [
  ...new Set([...config.resolver.sourceExts, "ts", "tsx"])
];

const configWithNativeWind = withNativeWind(config, { input: "./app/global.css" });

module.exports = wrapWithReanimatedMetroConfig(configWithNativeWind);
