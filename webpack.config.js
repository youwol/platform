const path = require('path');
const webpack = require('webpack');
const ROOT = path.resolve(__dirname, 'src/app');
const DESTINATION = path.resolve(__dirname, 'dist');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    context: ROOT,
    mode: 'development',
    entry: {
        'main': './main.ts'
    },
    experiments: {
        topLevelAwait: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.[contenthash].css",
            insert: "#css-anchor"
        }),
        new HtmlWebpackPlugin({
            //hash: true,
            title: 'Flux Builder',
            template: './index.html',
            filename: './index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin()
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: DESTINATION
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },
    externals: [{
        "reflect-metadata": "Reflect",
        lodash: "window['_']",
        "d3": "d3",
        "rxjs": "rxjs",
        "rxjs/operators": "window['rxjs']['operators']",
        "@youwol/logging": "window['@youwol/logging']",
        "@youwol/flux-core": "window['@youwol/flux-core']",
        "@youwol/flux-view": "window['@youwol/flux-view']",
        '@youwol/fv-group': "window['@youwol/fv-group']",
        '@youwol/fv-tree': "window['@youwol/fv-tree']",
        '@youwol/fv-input': "window['@youwol/fv-input']",
        '@youwol/fv-button': "window['@youwol/fv-button']",
        '@youwol/fv-tabs': "window['@youwol/fv-tabs']",
        '@youwol/cdn-client': "window['@youwol/cdn-client']",
        "@youwol/flux-files": "window['@youwol/flux-files']",
        '@youwol/platform-essentials': "window['@youwol/platform-essentials']",
        js_beautify: "window['js_beautify']"
    }
    ],
    module: {
        rules: [
            /****************
            * PRE-LOADERS
            *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },
            /****************
            * LOADERS
            *****************/
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: 'ts-loader'
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, './src'),
        },
        compress: true,
        port: 3004
    }
};
