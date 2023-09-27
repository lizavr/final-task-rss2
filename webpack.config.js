const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EslingPlugin = require('eslint-webpack-plugin');

const mode = process.env.NODE_ENV || 'development'; // явно указываем мод ENV
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist'; // определяем под какой браузер идёт сборка
const devtool = devMode ? 'source-map' : undefined; // если режим разработки, то добавляем сорс мапы для нахождения ошибок и т.д.

module.exports = {
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true, // необходим, чтобы работал роутинг на дев сервере (чтобы могла загружаться страница с нужного роута)
  },
  entry: './src/script',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new EslingPlugin({ extensions: 'ts' }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /.(svg|png|jpg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
