import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';

export const PROJECT_ROOT = path.resolve(__dirname, '..');
export const SERVER_DIST_PATH = path.join(PROJECT_ROOT, 'dist/server');
export const CLIENT_DIST_PATH = path.join(PROJECT_ROOT, 'dist/public');

export const common: webpack.Configuration = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' },
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(asset)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]',
                        },
                    },
                ],
            },
            {
                include: path.resolve(PROJECT_ROOT, 'vendor/Genymobile'),
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.platform': JSON.stringify(
                process.env.platform === 'testwa-cloud' ? 'testwa-cloud' : 'testwa-gen',
            ),
        }),
    ],
};

const front: webpack.Configuration = {
    entry: path.join(PROJECT_ROOT, './src/app/index.ts'),
    externals: ['fs'],
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(PROJECT_ROOT, '/src/public/index.html'),
            inject: 'head',
        }),
        new MiniCssExtractPlugin(),
    ],
    output: {
        filename: 'bundle.js',
        path: CLIENT_DIST_PATH,
    },
};

export const frontend = merge({}, common, front);

const back: webpack.Configuration = {
    entry: path.join(PROJECT_ROOT, './src/server/index.ts'),
    externals: [nodeExternals()],
    node: {
        global: false,
        __filename: false,
        __dirname: false,
    },
    output: {
        filename: 'index.js',
        path: SERVER_DIST_PATH,
    },
    target: 'node',
};

export const backend = merge({}, common, back);
