const { CheckerPlugin } = require("awesome-typescript-loader");
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    bundle: "./index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "..", "Web", "wwwroot"),
    filename: "[name].js",
    chunkFilename: "[name].[hash].chunk.js",
    publicPath: "/"
  },
  optimization: {
    splitChunks: {
      chunks: "async"
    }
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: "../"
            }
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
