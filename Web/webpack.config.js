const { CheckerPlugin } = require('awesome-typescript-loader');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.resolve(__dirname, 'frontend'),
    entry: {
        bundle: './index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'wwwroot'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
};
