const webpack = require('webpack');
const dotenv = require('dotenv');

/**
 * 環境設定
 * .envが共通ファイル、.env.localが個人用ファイル
 */
const env = Object.assign(
    {},
    dotenv.config({ path: '.env' }).parsed || {},
    dotenv.config({ path: '.env.local' }).parsed || {},
);

/**
 * ビルド環境
 */
env.NODE_ENV =
    env.NODE_ENV === 'production' ? env.NODE_ENV : process.env.NODE_ENV;
console.log('NODE_ENV:', env.NODE_ENV);

/**
 * Path / File
 */
const path = require('path');
const electronSrcPath = path.resolve(__dirname, '../electron', 'src');

/**
 * 製品環境判定
 */
const isProduct = env.NODE_ENV == 'production';

module.exports = {
    pwa: {
        iconPaths: {
            favicon32: './favicon.ico',
            themeColor: '#027BE3',
        },
    },
    publicPath: './',

    css: {
        sourceMap: !isProduct,
        loaderOptions: {
            stylus: {
                preferPathResolver: 'webpack',
            },
        },
    },

    configureWebpack: {
        target: 'electron-renderer',
        devServer: {
            host: '0.0.0.0',
            disableHostCheck: true,
            https: false,
        },

        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '%': path.resolve(electronSrcPath),
            },
            mainFields: ['browser', 'main', 'module'],
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    APP_NAME: `"${env.APP_NAME}"`,
                    NODE_ENV: `"${env.NODE_ENV}"`,
                    NODE_ENABLE_PWA: `${env.NODE_ENABLE_PWA}`,
                },
            }),
        ],

        devtool: isProduct ? false : '#source-map',
    },

    pluginOptions: {
        quasar: {
            treeShake: true,
        },
    },

    transpileDependencies: [/[\\\/]node_modules[\\\/]quasar[\\\/]/],
};
