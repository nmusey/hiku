const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: {
        path: path.resolve(__dirname, "..", "build", "client"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
        {
            test: /\.(ts|tsx)$/,
            loader: "ts-loader",
            exclude: /node_modules/
        },
        {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader",
        },
        {
            test: /\.css$/,
            loader: "css-loader",
        },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, ".", "assets", "index.html"),
        }),
        // new TsconfigPathsPlugin({
        //     configFile: path.resolve(__dirname, "tsconfig.client.json")
        // })
    ],
};