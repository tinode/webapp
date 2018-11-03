const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = config = {
  entry: [
    './src/index.js',
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /src\/.*\.jsx?$/,
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
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-intl': 'ReactIntl',
    'firebase/app': 'firebase',
    'firebase/messaging': ['firebase', 'messaging']
  },
};
