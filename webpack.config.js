const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  optimization: {
    runtimeChunk: 'single',
  },
  entry: { 
    index: './src/js/index.js',
    storage: './src/js/storage.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: "[name][ext]",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash:true,
      title: 'What Todo?',
      myPageHeader: 'What Todo?',
      template: './src/index.html',
      filename: './index.html'
    })
  ],
  module: {
    rules: [
      // to find CSS
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // loading fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};