const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: __dirname + '/src/js/app.js',
  output: {
    path: __dirname + '/dist/assets/js',
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  // plugins: [new HtmlWebpackPlugin({ template: './src/**/*.pug' })],
};
