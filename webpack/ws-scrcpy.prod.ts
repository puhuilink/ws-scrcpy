import { backend, frontend } from './ws-scrcpy.common';
import webpack from 'webpack';
import merge from 'webpack-merge';

const prodOpts: webpack.Configuration = {
    mode: 'production',
};

const front = merge({}, frontend, prodOpts);
const back = merge({}, backend, prodOpts);

module.exports = [front, back];
