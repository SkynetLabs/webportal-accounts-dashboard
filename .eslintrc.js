module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  ignorePatterns: ["coverage/*", "package.json"],
  extends: ["react-app", "plugin:storybook/recommended"],
};
