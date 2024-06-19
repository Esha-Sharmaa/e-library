const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "path": require.resolve("path-browserify"),
            "assert": require.resolve("assert"),
            "buffer": require.resolve("buffer"),
            "fs": false,
            "util": require.resolve("util/"),
            "process": require.resolve("process/browser"),
            "os": require.resolve("os-browserify/browser"),
            "zlib": require.resolve("zlib-browserify"),
            "url": require.resolve("url/"),
            "http": require.resolve("stream-http"),
            "querystring": require.resolve("querystring-es3"),
            "tls": false,
            "child_process": false,
            "https": require.resolve("https-browserify"),
            "aws-sdk": false,
            "mock-aws-s3": false,
            "async_hooks": false,
            "vm": require.resolve("vm-browserify"),
            "node-gyp": false,
            "net": require.resolve("net-browserify"),
            "nock": require.resolve("nock"),
            "npm": false,
            "timers": require.resolve("timers-browserify")
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ]
};
