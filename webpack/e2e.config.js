const {
  mode,
  pathTo,
  plugins,
  loaders,
  resolve,
  stats
} = require('./common');


module.exports = {
  mode,
  devtool: 'eval',

  entry: [
    pathTo('e2e', 'index.js')
  ],
  output: {
    filename: 'bundle.js',
    path: pathTo('dev')
  },
  plugins: [
    plugins.html
  ],
  module: {
    rules: [
      loaders.babel,
      loaders.css
    ]
  },
  resolve,
  stats,
  devServer: {
    historyApiFallback: true,
    liveReload: false,

    stats: {
      // Do not show list of hundreds of files included in a bundle
      chunkModules: false,
      colors: true
    }
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    child_process: 'empty'
  }
};
