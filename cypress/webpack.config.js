const path = require('path');

module.exports = {
    resolve: {
      extension: [".ts", ".js"]
    },
    node: {fs: "empty", child_process: "empty", readline: "empty"},
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'ts-loader'
                    },
                ],
                exclude: [/node_modules/],
            },
            {
                test: /\.feature$/,
                use: [
                    {
                        loader: 'cypress-cucumber-preprocessor/loader',
                    },
                ],
            },
            {
                test: /\.features$/,
                use: [
                    {
                        loader: 'cypress-cucumber-preprocessor/lib/featuresLoader',
                    },
                ],
            },
        ],
    }
};