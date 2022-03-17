const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'index'),
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: "bundle.js",
    chunkFilename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      use: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.js', '.js','.ts']
  },
};