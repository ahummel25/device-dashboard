import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import open from 'open';

const config = require('./webpack.config');
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const portNumber = 3333;
const targetEntry = `http://localhost:${portNumber}/`;

new WebpackDevServer(webpack(config), {
  stats: { colors: true },
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  contentBase: 'dist'
}).listen(portNumber, 'localhost', err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Running at ${targetEntry}...`);
  open(targetEntry);
  return;
});
