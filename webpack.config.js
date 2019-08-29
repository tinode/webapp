const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, 'src/index.js'),
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production.
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  performance: {
    maxEntrypointSize: 280000,
    maxAssetSize: 280000
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-intl': 'ReactIntl',
    'firebase/app': 'firebase',
    'firebase/messaging': ['firebase', 'messaging']
  },
};
