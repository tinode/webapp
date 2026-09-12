const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const mode = argv.mode === 'production' ? 'prod' : 'dev';
  const maxAssetSize = mode === 'prod' ? 360000 : 1512000;
  return {
    target: ['web', 'es2020'],
    entry: {
      index: path.resolve(__dirname, 'src/index.js'),
    },
    resolve: {
      alias: {
        'react-intl$': path.resolve(__dirname, 'src/lib/react-intl-compat.js'),
        'react-intl-original$': path.resolve(__dirname, 'node_modules/react-intl'),
      },
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                envName: mode === 'prod' ? 'production' : 'development',
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'umd'),
      filename: `[name].${mode}.js`,
      publicPath: '/umd/',
      module: true
    },
    experiments: {
      outputModule: true,
    },
    optimization: {
      runtimeChunk: 'single',
      minimize: (mode === 'prod'),
      minimizer: ['...']
    },
    performance: {
      maxEntrypointSize: maxAssetSize,
      maxAssetSize: maxAssetSize,
      assetFilter: function(assetFilename) {
        // Exclude all sourcemaps
        if (/\.map$/.test(assetFilename)) {
          return false;
        }
        return true;
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: `node_modules/tinode-sdk/umd/tinode.${mode}.js`, to: `tinode.${mode}.js` },
          { from: `node_modules/tinode-sdk/umd/tinode.${mode}.js.map`, to: `tinode.${mode}.js.map` },
        ],
      }),
    ],
    externalsType: 'module',
    externals: {
      'livekit-client': 'var LivekitClient',
      'qrcodejs': 'var QRCode',
      'react': 'react',
      'react-dom/client': 'react-dom/client',
      'react-intl-original': 'react-intl-original',
      'tinode-sdk': 'var tinode',
    },
  };
}
