// metro.config.js
// small tweaks: allow .cjs & model weight .bin files to pass Metro bundler

const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const { assetExts } = config.resolver;

// add custom extensions only if not already present
["cjs", "bin"].forEach((ext) => {
  if (!assetExts.includes(ext)) assetExts.push(ext);
});

module.exports = config;
