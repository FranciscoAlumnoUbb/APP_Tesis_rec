// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Asegura que Metro acepte `.bin` y `.json` como assets
config.resolver.assetExts.push('bin', 'json');

module.exports = config;
