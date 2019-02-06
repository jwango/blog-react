var path = require('path')
var nodeExternals = require('webpack-node-externals')

var mockConfig = {
  entry: './mock/src/build-posts.js',
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'scripts'),
    filename: 'build-posts.js',
  },
   module: {
    rules: [
      { 
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              "@babel/preset-env"
            ]
          }
        }
      },
    ]
   }
};

module.exports = [mockConfig];