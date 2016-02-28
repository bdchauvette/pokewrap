const webpack = require('webpack');
const path = require('path');

const config = {
  entry: {
    pokewrap: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/browser'),
  },
  resolve: {
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      test: /\.min\.js$/,
      compress: {
        warnings: false,
      },
    }),
  ],
};

if (process.env.NODE_ENV === 'production') {
  Object.assign(config, {
    entry: { 'pokewrap.min': './src/index.js' },
  });
}

module.exports = config;
