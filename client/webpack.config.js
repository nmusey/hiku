import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const isDevelopment = process.env.NODE_ENV !== "production";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default {
    entry: resolve(currentDirectory, "src", "index.tsx"),
    output: {
        path: resolve(currentDirectory, "..", "build", "client"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: ['.', 'node_modules']
    },
    devtool: isDevelopment ? "eval" : false,
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.client.json"
                    }
                },
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
                    resolve(currentDirectory, "src", "styles"), 
                    resolve(currentDirectory, "..", "node_modules", "antd")
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
            template: resolve(currentDirectory, "assets", "index.html"),
            favicon: resolve(currentDirectory, "assets", "favicon", "favicon.ico")
        }),
        new CleanWebpackPlugin()
    ],
};