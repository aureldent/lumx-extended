const path = require("path");

module.exports = ({ config }) => {
  /** SCSS Loader */
  config.module.rules.push({
    test: /\.scss$/,
    loaders: [
      {
        loader: "style-loader",
        options: { attributes: { id: "injected-styles" } },
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: true,
        },
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: true,
        },
      },
    ],
  });

  /** Typescript Loader */
  config.module.rules.push({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, "../src"),
    use: [
      require.resolve("ts-loader"),
      {
        loader: require.resolve("react-docgen-typescript-loader"),
        options: {
          tsconfigPath: path.resolve(__dirname, "../tsconfig.json"),
        },
      },
    ],
  });

  config.resolve.extensions.push(".ts", ".tsx", ".scss");

  return config;
};
