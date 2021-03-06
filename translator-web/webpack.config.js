const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const fileSystem = require("fs");
const CleanCSSPlugin = require("less-plugin-clean-css");

module.exports = {
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {loader: "babel-loader"}
            },
            {
                test: /\.html$/,
                use: [
                    {loader: "html-loader"}
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ["file-loader",],
            },
            {
                test: /\.(csv|tsv)$/,
                use: ["csv-loader",],
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"],
            },
            {
                test: /\.(less|scss)$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                strictMath: true,
                                noIeCompat: true,
                                plugins: [
                                    new CleanCSSPlugin({advanced: true}),
                                ],
                            },
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ],
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },
    devServer: {
        onBeforeSetupMiddleware: function (devServer) {
            devServer.app.get("/hello-world", function (req, res) {
                const fileName = "./src/data/xml1.xml";
                res.writeHead(200, {"Content-Type": "application/xml"});
                fileSystem.createReadStream(fileName).pipe(res);
            });
            devServer.app.get("/good-bye-cruel-world", function (req, res) {
                res.json({msg: {message: "Good bye, cruel world!"}});
            });
        },
        proxy: [
            {
                context: [
                    "/api/v1",
                    "/oauth2/callback/",
                    "/oauth2/authorize",
                    "/user/me",
                    "/auth"
                ],
                target: "http://localhost:8082/"
            }
        ],
        historyApiFallback: {
            index: '/'
        }
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"]
    }
};

// require("./dev/sonar-scanner.js");
