const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
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
          use: [
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
      minimize: (mode === 'prod'),
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {},
            format: {
              comments: false,
            },
            mangle: true, // Note `mangle.properties` is `false` by default.
            module: false,
            output: null,
            toplevel: false,
            nameCache: null,
            ie8: false,
            keep_classnames: undefined,
            keep_fnames: false,
            safari10: false,
          },
          extractComments: false,
        })
      ]
    },
    performance: {
      maxEntrypointSize: 262144,
      maxAssetSize: 262144
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: `node_modules/tinode-sdk/umd/tinode.${mode}.js`, to: `tinode.${mode}.js` },
        ],
      }),
    ],
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-intl': 'ReactIntl',
      'firebase/app': 'firebase',
      'firebase/messaging': ['firebase', 'messaging'],
      'tinode-sdk': 'Tinode',
    },
  };
}
