const path = require('path');

module.exports = {
    entry: './source/index.tsx',
    target: 'electron-main',
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ["@babel/preset-typescript", {}],
                        ["@babel/preset-react", {}],
                        ["@babel/preset-env", {}]
                    ],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            }
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './public/script')
    }
};