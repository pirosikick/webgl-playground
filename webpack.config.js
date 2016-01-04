'use strict';
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015']
        }
      }
    ]
  },
  output: {
    filename: '[name].bundle.js'
  }
};
