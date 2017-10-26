const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    inject: './src/chrome/inject.js',
    domScript: './src/chrome/domScript.js'
  },
  // Extension will be built into ./dist folder, which we can then load as unpacked extension in Chrome
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, './src')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2017', 'react']
          }
        } 
      },
      {test: /\.css$/,loader: 'style-loader!css-loader'},
      {test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,use: 'file-loader?limit=100000'},
      {test: /\.(jpe?g|png|gif|svg)$/i,use: ['file-loader?limit=100000',{loader: 'img-loader',options: {enabled: true,optipng: true}}]}
    ]
  }
}