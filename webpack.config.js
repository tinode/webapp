const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const mode = argv.mode === 'production' ? 'prod' : 'dev';
  const maxAssetSize = mode === 'prod' ? 360000 : 1512000;
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
      publicPath: '/umd/'
    },
    optimization: {
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
          { from: 'node_modules/react/umd/react.development.js', to: 'react.development.js' },
          { from: 'node_modules/react/umd/react.production.min.js', to: 'react.production.min.js' },
          { from: 'node_modules/react-dom/umd/react-dom.development.js', to: 'react-dom.development.js' },
          { from: 'node_modules/react-dom/umd/react-dom.production.min.js', to: 'react-dom.production.min.js' },
          { from: 'node_modules/react-intl/react-intl.iife.js', to: 'react-intl.iife.js' },
          { from: 'node_modules/qrcodejs/qrcode.js', to: 'qrcode.js' },
          { from: 'node_modules/qrcodejs/qrcode.min.js', to: 'qrcode.min.js' },
          { from: 'node_modules/firebase/firebase-app-compat.js', to: 'firebase-app-compat.js' },
          { from: 'node_modules/firebase/firebase-messaging-compat.js', to: 'firebase-messaging-compat.js' },
        ],
      }),
    ],
    externals: {
      'livekit-client': 'LivekitClient',
      'qrcodejs': 'QRCode',
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-intl': 'ReactIntl',
      'tinode-sdk': 'tinode',
    },
  };
}
