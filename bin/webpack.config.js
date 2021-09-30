var path = require('path');
var webpack = require('webpack');
var cssnano = require('cssnano');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    ['web-ui']:[ path.resolve(__dirname, '../src/styles/index.scss') ],
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: /src/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.woff(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            query: 'prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff',
          },
        ],
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            query: 'prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff2',
          },
        ],
      },
      {
        test: /\.otf(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            query: 'prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=font/opentype',
          },
        ],
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            query: 'prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream',
          },
        ],
      },
      {
        test: /\.eot(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            query: 'prefix=fonts/&name=fonts/[name].[ext]',
          },
        ],
      },
      {
        test: /\.svg(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            query: 'prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml',
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            query: 'limit=8192',
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          cssnano({
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions']
            },
            discardComments: {
              removeAll: true
            },
            safe: true,
            sourcemap: true
          })
        ],
        context: '/',
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
  ],
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.json', '.css', '.sass', '.scss', '.html']
  },
};
