const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [path.resolve(workspaceRoot, "node_modules")];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@react-native/js-polyfills": path.resolve(workspaceRoot, "node_modules/@react-native/js-polyfills"),
  "react-native": path.resolve(workspaceRoot, "node_modules/react-native")
};

module.exports = config;
