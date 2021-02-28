const path = require("path"),
  HTMLWebpackPlugin = require("html-webpack-plugin"),
  MiniCSSExtractPlugin = require("mini-css-extract-plugin"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/frontend/src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/i,
        use: {
          loader: "html-loader",
          options: {
            minimize: true,
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
          },
          "css-loader",
        ],
        // use: [MiniCSSExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: ["file-loader?name=assets/[name].[ext]", "image-webpack-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: "./src/frontend/src/index.html",
      filename: "./index.html",
    }),
    // CSS
    new MiniCSSExtractPlugin(),
  ],
};
