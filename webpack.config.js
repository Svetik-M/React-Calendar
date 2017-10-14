'use strict'

const NODE_ENV = process.env.NODE_ENV || 'development';
const WEBPACK = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: [
      'webpack-hot-middleware/client',
      './scripts/app.jsx'
    ],
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },

    watch: NODE_ENV == 'development',

    devtool: NODE_ENV === 'development' ? 'inline-source-map' : null,

    plugins: [
        new ExtractTextPlugin('styles.css', {
            allChunks: true
        }),
        new WEBPACK.NoErrorsPlugin(),
        new WEBPACK.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        })
    ],

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js']
    },

    resolveLoader: {
            modulesDirectories: ['node_modules'],
            moduleTemplates: ['*-loader', '*'],
            extensions: ['', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0', 'stage-1']
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!resolve-url!sass-loader?sourceMap')
            }
        ]
    }
 };

if (NODE_ENV === 'prodaction') {
    module.exports.plugins.push(
        new WEBPACK.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    )
}
