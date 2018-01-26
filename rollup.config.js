import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/main.js',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    },
    plugins: [
        commonjs({
            include: 'node_modules/**'
        }),
        resolve(),
        babel({
            // exclude: 'node_modules/**',
            "presets": [
                ["@babel/preset-react"],
                ["@babel/preset-typescript"],
                ["@babel/preset-env", { "modules": false }]
            ]
        })
    ]
};