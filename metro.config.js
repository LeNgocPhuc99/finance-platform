const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = withNativewind(getDefaultConfig(__dirname));

// react-native-css redirects every `import 'react-native'` to its own wrapper,
// which does not re-export `AssetRegistry` (RN 0.88). expo-asset needs it
// (fonts, Material Symbol tab icons), so give it the real react-native entry.
const nativewindResolve = config.resolver.resolveRequest;
const expoAssetDir = `${path.sep}node_modules${path.sep}expo-asset${path.sep}`;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native' && context.originModulePath.includes(expoAssetDir)) {
    return {
      type: 'sourceFile',
      filePath: path.join(__dirname, 'node_modules', 'react-native', 'index.js'),
    };
  }
  return nativewindResolve(context, moduleName, platform);
};

module.exports = config;
