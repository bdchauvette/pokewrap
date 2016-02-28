const config = require('./webpack.config');
const path = require('path');

Object.assign(config, {
  entry: {
    bundle: path.resolve(__dirname, 'test/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'test'),
    filename: '[name].js',
  },
  node: {
    fs: 'empty',
  },
});

module.exports = config;
