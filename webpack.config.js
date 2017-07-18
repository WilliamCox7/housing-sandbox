var webpack = require('webpack');
var path = require('path');

module.exports = {

  devtool: 'source-map',

  entry: [
    './client/index.js'
  ],

  output: {
    path: path.join(__dirname, '/build'),
    filename: "bundle.js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude:/node_modules/,
        loaders: [ 'babel']
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  resolve: {
    extensions: ["", ".js", ".css"]
  },

  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }

}
