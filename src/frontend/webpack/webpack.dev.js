const merge = require('webpack-merge');

const common = require('./webpack.common.js');

// Change this to toggle debugging bloat
const isQuick = false;

module.exports = merge(common, {
    mode: 'development',

    devServer: {
        port: 8080,
        host: '0.0.0.0',
        contentBase: '.',
        historyApiFallback: true, // For ReactRouter
        disableHostCheck: true, // DO NOT LET THIS IN
        proxy: {
            "/api": "http://0.0.0.0:5000/",
            "/swaggerui": "http://0.0.0.0:5000/",
        },
    },


    devtool: isQuick ? "" : 'cheap-eval-source-map',
});
