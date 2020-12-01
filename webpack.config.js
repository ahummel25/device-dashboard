const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: ['react-hot-loader/patch', './src'],
  },
  output: {
    publicPath: '/',
    filename: 'js/[name].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
		{
			test: /\.tsx?$/,
			loader: 'ts-loader',
			exclude: /node_modules/
		},
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
};
