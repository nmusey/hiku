const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: {
        path: path.resolve(__dirname, "..", "build", "client"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx"],
    },
    devtool: isDevelopment ? "eval" : false,
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
                test: /\.less$/,
                include: [
                    path.resolve(__dirname, "src", "styles"), 
                    path.resolve(__dirname, "..", "node_modules", "antd")
                ],
                use: [
                    "style-loader", 
                    "css-loader",
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: { javascriptEnabled: true }
                        }
                    } 
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(jpeg|png|gif|svg)$/,
                type: 'asset/resource'
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "assets", "index.html"),
            favicon: path.resolve(__dirname, "assets", "favicon", "favicon.ico")
        }),
        new CleanWebpackPlugin()
    ],
};