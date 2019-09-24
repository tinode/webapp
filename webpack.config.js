const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const mode = argv.mode === 'production' ? 'prod' : 'dev';
  return {
    entry: {
      index: path.resolve(__dirname, 'src/index.js'),
    },
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
    output: {
      path: path.resolve(__dirname, 'umd'),
      filename: `[name].${mode}.js`,
      publicPath: '/umd/'
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
      maxEntrypointSize: 262144,
      maxAssetSize: 262144
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-intl': 'ReactIntl',
      'firebase/app': 'firebase',
      'firebase/messaging': ['firebase', 'messaging']
    },
  };
}
