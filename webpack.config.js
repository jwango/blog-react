var path = require('path')
var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')

// TODO: sync up client-side config with this config
var serverConfig = (env, argv) => {
  process.env.NODE_ENV = env.NODE_ENV;
  return {
    entry: './src/server/index.js',
    target: 'node',
    mode: env.NODE_ENV,
    devtool: env.NODE_ENV === 'development' ? 'source-map' : undefined,
    externals: [nodeExternals()],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'server.js',
      publicPath: '/'
    },
    module: {
      rules: [
        { 
          test: /\.(js)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                "react-app"
              ],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread"
              ]
            }
          }
        },
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