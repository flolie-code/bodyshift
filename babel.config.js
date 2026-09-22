module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@app': './app',
          },
        },
      ],
      // Reanimated 4 nutzt worklets/plugin, muss letzter Plugin sein
      'react-native-worklets/plugin',
    ],
  };
};
