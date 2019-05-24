const merge = require('webpack-merge');

const common = require('./webpack.common.js');

// Change this to toggle debugging bloat
const isQuick = false;

module.exports = merge(common, {
    mode: 'development',

    devServer: {
        port: 8080,
        contentBase: '.',
        historyApiFallback: true, // For ReactRouter
        disableHostCheck: true, // DO NOT LET THIS IN
        proxy: {
            "/api": "http://localhost:5000/",
            "/swaggerui": "http://localhost:5000/",
        },
    },


    devtool: isQuick ? "" : 'cheap-eval-source-map',
});
