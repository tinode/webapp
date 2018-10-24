module.exports =  config = {
  entry: [
    './src/index.js',
  ],
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
};
