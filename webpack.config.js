var path = require('path')
var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')

var serverConfig = (env, argv) => {
  process.env.NODE_ENV = env.NODE_ENV;
  return {
    entry: './src/server/index.js',
    target: 'node',
    externals: [nodeExternals()],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'server.js',
      publicPath: '/'
    },
    module: {
      rules: [
        { test: /\.(js)$/, use: 'babel-loader' },
        {
          test: /\.scss$/,
          loaders: ["css-loader", "sass-loader"]
        },
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        __isBrowser__: "false"
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: env
      })
    ]
  }
};

module.exports = [serverConfig]